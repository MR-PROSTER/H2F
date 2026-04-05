"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Stethoscope, AlertCircle, Bot, Mic, PhoneOff } from "lucide-react";
import { useWebRTCCall } from "@/hooks/useWebRTCCall";
import useRecordingStore from "@/store/useRecordingStore";

const MOCK_DOCTOR = {
    name: "Dr. Priya Sharma",
    hospital: "Apollo Hospitals",
};

const getBackendHttpUrl = () => process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

const getBackendWsUrl = () => {
    const backend = getBackendHttpUrl();
    if (backend.startsWith("https://")) return backend.replace("https://", "wss://");
    if (backend.startsWith("http://")) return backend.replace("http://", "ws://");
    return `ws://${backend}`;
};

const blobToBase64 = (blob: Blob): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const result = typeof reader.result === "string" ? reader.result : "";
            resolve(result.includes(",") ? result.split(",")[1] : result);
        };
        reader.onerror = () => reject(new Error("Failed to read audio blob"));
        reader.readAsDataURL(blob);
    });

const playBase64Audio = (base64Audio: string) => {
    return new Promise<void>((resolve) => {
        try {
            const decoded = atob(base64Audio);
            const bytes = new Uint8Array(decoded.length);
            for (let i = 0; i < decoded.length; i += 1) {
                bytes[i] = decoded.charCodeAt(i);
            }

            const blob = new Blob([bytes.buffer], { type: "audio/wav" });
            const url = URL.createObjectURL(blob);
            const audio = new Audio(url);

            audio.onended = () => {
                URL.revokeObjectURL(url);
                resolve();
            };
            audio.onerror = () => {
                URL.revokeObjectURL(url);
                resolve();
            };

            audio.play().catch(() => resolve());
        } catch {
            resolve();
        }
    });
};

const AICustomerJoinPage = ({
    sessionId,
    onExit,
}: {
    sessionId: string;
    onExit: () => void;
}) => {
    const [status, setStatus] = useState<"loading" | "ready" | "active" | "ended" | "error">("loading");
    const [statusText, setStatusText] = useState("Connecting to AI call...");
    const [errorText, setErrorText] = useState("");
    const [conversationStarted, setConversationStarted] = useState(false);
    const [isAISpeaking, setIsAISpeaking] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [currentUtterance, setCurrentUtterance] = useState("");

    const wsRef = useRef<WebSocket | null>(null);
    const localStreamRef = useRef<MediaStream | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const pendingQueueRef = useRef<Array<{ audio: string; text: string; isFinal: boolean }>>([]);
    const playbackQueueRef = useRef<Array<{ audio: string; text: string; isFinal: boolean }>>([]);
    const isPlayingRef = useRef(false);
    const conversationStartedRef = useRef(false);

    const endCall = () => {
        setStatus("ended");
        setStatusText("Call ended. Thank you.");

        if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({ type: "call-ended" }));
        }

        wsRef.current?.close();
        wsRef.current = null;

        if (mediaRecorderRef.current?.state === "recording") {
            mediaRecorderRef.current.stop();
        }

        localStreamRef.current?.getTracks().forEach((track) => track.stop());
        localStreamRef.current = null;
        setIsRecording(false);
        setIsAISpeaking(false);
    };

    const processPlaybackQueue = async () => {
        if (isPlayingRef.current || playbackQueueRef.current.length === 0) {
            return;
        }

        isPlayingRef.current = true;
        const next = playbackQueueRef.current.shift();
        if (!next) {
            isPlayingRef.current = false;
            return;
        }

        setIsAISpeaking(true);
        setCurrentUtterance(next.text);
        setStatusText(`AI: ${next.text}`);
        await playBase64Audio(next.audio);

        isPlayingRef.current = false;
        if (playbackQueueRef.current.length > 0) {
            processPlaybackQueue();
            return;
        }

        if (next.isFinal) {
            setIsAISpeaking(false);
            setStatus("active");
            setStatusText("Your turn. Tap Speak to respond.");
        }
    };

    const startConversation = () => {
        setConversationStarted(true);
        conversationStartedRef.current = true;
        if (pendingQueueRef.current.length > 0) {
            playbackQueueRef.current.push(...pendingQueueRef.current);
            pendingQueueRef.current = [];
            processPlaybackQueue();
        }
    };

    const recordAndSendSpeech = async () => {
        if (!localStreamRef.current || !wsRef.current || isAISpeaking || status === "ended") {
            return;
        }

        const supportedTypes = ["audio/webm;codecs=opus", "audio/webm", "audio/ogg", ""];
        const mimeType = supportedTypes.find((type) => type === "" || MediaRecorder.isTypeSupported(type)) || "";

        audioChunksRef.current = [];

        const recorder = mimeType
            ? new MediaRecorder(localStreamRef.current, { mimeType, audioBitsPerSecond: 128000 })
            : new MediaRecorder(localStreamRef.current);

        mediaRecorderRef.current = recorder;
        setIsRecording(true);
        setStatusText("Listening...");

        recorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                audioChunksRef.current.push(event.data);
            }
        };

        recorder.onstop = async () => {
            setIsRecording(false);

            if (audioChunksRef.current.length === 0 || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
                setStatusText("Could not capture audio. Please try again.");
                return;
            }

            try {
                setStatusText("Processing your response...");
                const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
                const base64Audio = await blobToBase64(blob);

                const response = await fetch(`${getBackendHttpUrl()}/transcribe-ai`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ audio: base64Audio }),
                });

                const data = await response.json();
                const transcript = (data.transcript || "").trim();
                const languageCode = data.language || "en";

                if (!transcript) {
                    setStatusText("Nothing heard. Please speak again.");
                    return;
                }

                setCurrentUtterance(`You: ${transcript}`);
                setStatusText("Sending your response...");
                wsRef.current.send(
                    JSON.stringify({
                        type: "customer-speech",
                        transcript,
                        languageCode,
                    })
                );
            } catch (error) {
                console.error("AI speech processing error:", error);
                setStatusText("Could not process your response. Try again.");
            }
        };

        recorder.start();
        setTimeout(() => {
            if (recorder.state === "recording") {
                recorder.stop();
            }
        }, 5000);
    };

    useEffect(() => {
        if (!sessionId || sessionId.length < 36) {
            setStatus("error");
            setErrorText("This AI call link is invalid or expired.");
            return;
        }

        const setup = async () => {
            try {
                const localStream = await navigator.mediaDevices.getUserMedia({
                    audio: {
                        echoCancellation: true,
                        noiseSuppression: true,
                        autoGainControl: true,
                    },
                    video: false,
                });
                localStreamRef.current = localStream;

                const ws = new WebSocket(`${getBackendWsUrl()}/ai-call?session=${encodeURIComponent(sessionId)}`);
                wsRef.current = ws;

                ws.onopen = () => {
                    setStatus("ready");
                    setStatusText("Connected. Waiting for AI greeting...");
                };

                ws.onmessage = async (event) => {
                    const message = JSON.parse(event.data as string);

                    if (message.type === "error") {
                        setStatus("error");
                        setErrorText(message.message || "AI call error");
                        return;
                    }

                    if (message.type === "call-ended") {
                        endCall();
                        return;
                    }

                    if (message.type === "ai-speech") {
                        const packet = {
                            audio: message.audio,
                            text: message.text,
                            isFinal: message.isFinal !== false,
                        };

                        if (!conversationStartedRef.current) {
                            pendingQueueRef.current.push(packet);
                            setStatus("ready");
                            setStatusText("AI is ready. Tap Start Conversation.");
                            return;
                        }

                        playbackQueueRef.current.push(packet);
                        processPlaybackQueue();
                    }
                };

                ws.onclose = () => {
                    if (status !== "ended") {
                        setStatus("ended");
                        setStatusText("Connection closed.");
                    }
                };

                ws.onerror = () => {
                    setStatus("error");
                    setErrorText("Failed to connect AI call signaling.");
                };
            } catch (error) {
                console.error("AI setup error:", error);
                setStatus("error");
                setErrorText("Microphone access is required to join this call.");
            }
        };

        setup();

        return () => {
            wsRef.current?.close();
            localStreamRef.current?.getTracks().forEach((track) => track.stop());
            if (mediaRecorderRef.current?.state === "recording") {
                mediaRecorderRef.current.stop();
            }
        };
    }, [sessionId]);

    if (status === "error") {
        return (
            <div className="w-full min-h-screen bg-[#080708] flex items-center justify-center p-4">
                <div className="w-full max-w-md bg-[#0f0e10] rounded-2xl p-8 border border-[#dc2626]/30 flex flex-col items-center gap-6">
                    <div className="w-16 h-16 rounded-full bg-[#dc2626]/20 flex items-center justify-center">
                        <AlertCircle size={32} className="text-[#dc2626]" />
                    </div>
                    <div className="flex flex-col items-center gap-2 text-center">
                        <h2 className="text-white text-xl font-bold font-oxanium">Unable to Join AI Call</h2>
                        <p className="text-[#9d9d9d] text-sm font-lexend">{errorText}</p>
                    </div>
                    <button
                        onClick={onExit}
                        className="w-full py-3 rounded-xl text-white font-semibold font-outfit transition-all duration-200 bg-[#1f1f1f] hover:bg-[#2b2b2b]"
                    >
                        Return Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-[#080708] flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-[#0f0e10] rounded-2xl p-8 border border-[#1f1f1f] flex flex-col items-center gap-6">
                <div className="w-16 h-16 rounded-full bg-[#7c3aed]/20 border border-[#7c3aed]/40 flex items-center justify-center">
                    <Bot size={28} className={isAISpeaking ? "text-[#7c3aed] animate-pulse" : "text-[#7c3aed]"} />
                </div>

                <div className="flex flex-col items-center gap-2 text-center">
                    <h1 className="text-white text-2xl font-bold font-oxanium">AI Assistant Call</h1>
                    <p className="text-[#9d9d9d] text-sm font-lexend">{statusText}</p>
                </div>

                <div className="w-full rounded-lg p-4 bg-[#0e0e0e] border-[#717171]">
                    <p className="text-[#dadada] text-sm font-lexend leading-relaxed min-h-[44px]">
                        {currentUtterance || "Waiting for conversation..."}
                    </p>
                </div>

                {!conversationStarted && status !== "ended" && (
                    <button
                        onClick={startConversation}
                        className="w-full py-3 rounded-xl text-white font-semibold font-outfit transition-all duration-200 bg-[#4caf50] hover:bg-[#43a047]"
                    >
                        Start Conversation
                    </button>
                )}

                {conversationStarted && status !== "ended" && (
                    <button
                        onClick={recordAndSendSpeech}
                        disabled={isAISpeaking || isRecording}
                        className="w-full py-3 rounded-xl text-white font-semibold font-outfit transition-all duration-200 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        <Mic size={18} />
                        {isRecording ? "Listening..." : "Speak"}
                    </button>
                )}

                <button
                    onClick={endCall}
                    className="w-full py-3 rounded-xl text-white font-semibold font-outfit transition-all duration-200 bg-[#dc2626] hover:bg-[#b91c1c] flex items-center justify-center gap-2"
                >
                    <PhoneOff size={18} />
                    End Call
                </button>
            </div>
        </div>
    );
};

const PatientJoinPage = () => {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const sessionId = params.sessionId as string;
    const mode = searchParams.get("mode") === "ai" ? "ai" : "manual";

    const [status, setStatus] = useState<"loading" | "ready" | "connected" | "error">("loading");
    const [errorMsg, setErrorMsg] = useState("");

    const { joinCall, endCall, isConnected, error: webrtcError } = useWebRTCCall();

    const setCallStatus = useRecordingStore((state) => state.setCallStatus);
    const setSessionId = useRecordingStore((state) => state.setSessionId);

    const handleCancel = () => {
        endCall();
        router.push("/");
    };

    if (mode === "ai") {
        return <AICustomerJoinPage sessionId={sessionId} onExit={handleCancel} />;
    }

    useEffect(() => {
        if (!sessionId || sessionId.length < 36) {
            setStatus("error");
            setErrorMsg("This link has expired or is invalid.");
            return;
        }

        setSessionId(sessionId);
        setStatus("ready");
    }, [sessionId, setSessionId]);

    useEffect(() => {
        if (webrtcError) {
            setStatus("error");
            setErrorMsg(webrtcError);
        }
    }, [webrtcError]);

    useEffect(() => {
        if (isConnected) {
            setStatus("connected");
            setCallStatus("connected");
        }
    }, [isConnected, setCallStatus]);

    const handleJoinCall = async () => {
        try {
            setStatus("loading");
            await joinCall(sessionId);
        } catch (err) {
            setStatus("error");
            setErrorMsg(err instanceof Error ? err.message : "Failed to join call");
        }
    };

    if (status === "error") {
        return (
            <div className="w-full min-h-screen bg-[#080708] flex items-center justify-center p-4">
                <div className="w-full max-w-md bg-[#0f0e10] rounded-2xl p-8 border border-[#dc2626]/30 flex flex-col items-center gap-6">
                    <div className="w-16 h-16 rounded-full bg-[#dc2626]/20 flex items-center justify-center">
                        <AlertCircle size={32} className="text-[#dc2626]" />
                    </div>

                    <div className="flex flex-col items-center gap-2 text-center">
                        <h2 className="text-white text-xl font-bold font-oxanium">Link Expired</h2>
                        <p className="text-[#9d9d9d] text-sm font-lexend">{errorMsg}</p>
                    </div>

                    <button
                        onClick={handleCancel}
                        className="w-full py-3 rounded-xl text-white font-semibold font-outfit transition-all duration-200 bg-[#1f1f1f] hover:bg-[#2b2b2b]"
                    >
                        Return Home
                    </button>
                </div>
            </div>
        );
    }

    if (status === "connected") {
        return (
            <div className="w-full min-h-screen bg-[#080708] flex items-center justify-center p-4">
                <div className="w-full max-w-md bg-[#0f0e10] rounded-2xl p-8 border border-[#1f1f1f] flex flex-col items-center gap-6">
                    <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                        <div className="w-4 h-4 rounded-full bg-green-500 animate-pulse" />
                    </div>

                    <div className="flex flex-col items-center gap-2 text-center">
                        <h2 className="text-white text-xl font-bold font-oxanium">Connected</h2>
                        <p className="text-[#9d9d9d] text-sm font-lexend">You are now talking with {MOCK_DOCTOR.name}</p>
                    </div>

                    <div className="w-full rounded-lg p-4 bg-[#0e0e0e] border-[#717171]">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-mono text-[#6b6b6b] tracking-widest">CALL DURATION</span>
                            <span className="text-sm font-oxanium text-[#10b981]">Live</span>
                        </div>
                        <p className="text-[#dadada] text-sm font-lexend">
                            The call is being recorded and transcribed for medical documentation purposes.
                        </p>
                    </div>

                    <button
                        onClick={handleCancel}
                        className="w-full py-3 rounded-xl text-white font-semibold font-outfit transition-all duration-200 bg-[#dc2626] hover:bg-[#b91c1c]"
                    >
                        End Call
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-[#080708] flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-[#0f0e10] rounded-2xl p-8 border border-[#1f1f1f] flex flex-col items-center gap-6">
                {/* VANI Logo */}
                <div className="w-12 h-12 rounded-xl bg-[#1a1a1a] flex items-center justify-center">
                    <span className="text-lg font-bold text-teal-500 font-oxanium">V</span>
                </div>

                {/* Header */}
                <div className="flex flex-col items-center gap-2 text-center">
                    <h1 className="text-white text-2xl font-bold font-oxanium">Your Doctor is Calling</h1>
                    <p className="text-[#9d9d9d] text-sm font-lexend">Please join the call when ready</p>
                </div>

                {/* Doctor Info Card */}
                <div className="w-full rounded-lg p-4 bg-[#0e0e0e] border-[#717171] flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#1a1a1a] border-2 border-teal-500/50 flex items-center justify-center">
                        <Stethoscope size={20} className="text-teal-500" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-white font-bold font-lexend text-sm">{MOCK_DOCTOR.name}</span>
                        <span className="text-[#6b6b6b] text-xs font-lexend">{MOCK_DOCTOR.hospital}</span>
                    </div>
                </div>

                {/* Status Indicator */}
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/20 border border-green-500/30">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-green-500 text-xs font-mono tracking-widest">Ready to connect</span>
                </div>

                {/* Join Button */}
                <button
                    onClick={handleJoinCall}
                    disabled={status !== "ready"}
                    className="w-full py-4 rounded-xl text-white font-semibold text-lg font-outfit transition-all duration-200 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {status === "loading" ? "Connecting..." : "Join Call"}
                </button>

                {/* Consent Notice */}
                <p className="text-[#6b6b6b] text-[11px] font-lexend text-center leading-relaxed">
                    By joining, you consent to this call being recorded and transcribed
                    for medical documentation.
                </p>

                {/* Cancel Link */}
                <button
                    onClick={handleCancel}
                    className="text-[#6b6b6b] text-xs font-lexend hover:text-[#9d9d9d] transition-colors"
                >
                    Not ready? Close this page
                </button>
            </div>
        </div>
    );
};

export default PatientJoinPage;
