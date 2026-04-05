'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

interface UseWebRTCCallReturn {
    localStream: MediaStream | null;
    remoteStream: MediaStream | null;
    startCall: (sessionId: string) => Promise<void>;
    joinCall: (sessionId: string) => Promise<void>;
    endCall: () => void;
    isConnected: boolean;
    error: string | null;
}

const STUN_SERVERS: RTCIceServer[] = [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
];

const getBackendHttpUrl = () => {
    return process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
};

const getBackendWsUrl = () => {
    const httpUrl = getBackendHttpUrl();
    if (httpUrl.startsWith('https://')) {
        return httpUrl.replace('https://', 'wss://');
    }
    if (httpUrl.startsWith('http://')) {
        return httpUrl.replace('http://', 'ws://');
    }
    return `ws://${httpUrl}`;
};

export function useWebRTCCall(): UseWebRTCCallReturn {
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
    const socketRef = useRef<WebSocket | null>(null);
    const localStreamRef = useRef<MediaStream | null>(null);
    const remoteStreamRef = useRef<MediaStream | null>(null);
    const pendingCandidatesRef = useRef<RTCIceCandidateInit[]>([]);

    const flushPendingCandidates = useCallback(async () => {
        if (!peerConnectionRef.current || pendingCandidatesRef.current.length === 0) {
            return;
        }

        const queued = [...pendingCandidatesRef.current];
        pendingCandidatesRef.current = [];

        for (const candidate of queued) {
            try {
                await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
            } catch (candidateError) {
                console.error('Failed to add queued ICE candidate:', candidateError);
            }
        }
    }, []);

    const cleanup = useCallback(() => {
        if (peerConnectionRef.current) {
            peerConnectionRef.current.close();
            peerConnectionRef.current = null;
        }

        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(track => track.stop());
            localStreamRef.current = null;
        }

        if (socketRef.current) {
            try {
                if (socketRef.current.readyState === WebSocket.OPEN) {
                    socketRef.current.close();
                }
            } catch (socketCloseError) {
                console.error('Error while closing signaling socket:', socketCloseError);
            }
            socketRef.current = null;
        }

        pendingCandidatesRef.current = [];

        setLocalStream(null);
        setRemoteStream(null);
        setIsConnected(false);
    }, []);

    const initializePeerConnection = useCallback(() => {
        const pc = new RTCPeerConnection({ iceServers: STUN_SERVERS });

        pc.onicecandidate = ({ candidate }) => {
            if (candidate && socketRef.current?.readyState === WebSocket.OPEN) {
                socketRef.current.send(
                    JSON.stringify({
                        type: 'ice-candidate',
                        candidate,
                    })
                );
            }
        };

        pc.ontrack = (event) => {
            if (event.streams && event.streams[0]) {
                remoteStreamRef.current = event.streams[0];
                setRemoteStream(event.streams[0]);
            }
        };

        pc.onconnectionstatechange = () => {
            if (pc.connectionState === 'connected') {
                setIsConnected(true);
            } else if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
                setIsConnected(false);
            }
        };

        peerConnectionRef.current = pc;
        return pc;
    }, []);

    const setupLocalAudio = useCallback(async () => {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: {
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true,
            },
            video: false,
        });

        localStreamRef.current = stream;
        setLocalStream(stream);
        return stream;
    }, []);

    const connectSignalingSocket = useCallback((sessionId: string, role: 'agent' | 'customer') => {
        const wsUrl = `${getBackendWsUrl()}/webrtc-signal?room=${encodeURIComponent(sessionId)}&role=${role}`;
        const socket = new WebSocket(wsUrl);
        socketRef.current = socket;
        return socket;
    }, []);

    const addRemoteIceCandidate = useCallback(async (candidate: RTCIceCandidateInit) => {
        if (!peerConnectionRef.current) {
            pendingCandidatesRef.current.push(candidate);
            return;
        }

        const hasRemoteDescription = Boolean(peerConnectionRef.current.remoteDescription?.type);
        if (!hasRemoteDescription) {
            pendingCandidatesRef.current.push(candidate);
            return;
        }

        try {
            await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (candidateError) {
            console.error('Failed to add ICE candidate:', candidateError);
        }
    }, []);

    const startCall = useCallback(async (sessionId: string) => {
        try {
            setError(null);

            const stream = await setupLocalAudio();
            const socket = connectSignalingSocket(sessionId, 'agent');

            socket.onopen = () => {
                console.log('Connected to signaling server as agent');
            };

            socket.onmessage = async ({ data }) => {
                const raw = typeof data === 'string' ? data : '';
                if (!raw) return;
                const message = JSON.parse(raw);

                if (message.type === 'peer-joined') {
                    const pc = initializePeerConnection();

                    stream.getTracks().forEach((track) => {
                        pc.addTrack(track, stream);
                    });

                    const offer = await pc.createOffer();
                    await pc.setLocalDescription(offer);

                    if (socket.readyState === WebSocket.OPEN) {
                        socket.send(
                            JSON.stringify({
                                type: 'offer',
                                offer,
                            })
                        );
                    }
                }

                if (message.type === 'answer' && message.answer && peerConnectionRef.current) {
                    await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(message.answer));
                    await flushPendingCandidates();
                }

                if (message.type === 'ice-candidate' && message.candidate) {
                    await addRemoteIceCandidate(message.candidate);
                }

                if (message.type === 'call-ended' || message.type === 'peer-left') {
                    cleanup();
                }
            };

            socket.onerror = () => {
                setError('Signaling connection failed');
            };

            socket.onclose = () => {
                setIsConnected(false);
            };

        } catch (err) {
            console.error('Error starting call:', err);
            setError(err instanceof Error ? err.message : 'Failed to start call');
            cleanup();
        }
    }, [addRemoteIceCandidate, cleanup, connectSignalingSocket, flushPendingCandidates, initializePeerConnection, setupLocalAudio]);

    const joinCall = useCallback(async (sessionId: string) => {
        try {
            setError(null);

            const stream = await setupLocalAudio();
            const socket = connectSignalingSocket(sessionId, 'customer');

            socket.onopen = () => {
                console.log('Connected to signaling server as customer');
            };

            socket.onmessage = async ({ data }) => {
                const raw = typeof data === 'string' ? data : '';
                if (!raw) return;
                const message = JSON.parse(raw);

                if (message.type === 'offer' && message.offer) {
                    const pc = initializePeerConnection();

                    stream.getTracks().forEach((track) => {
                        pc.addTrack(track, stream);
                    });

                    await pc.setRemoteDescription(new RTCSessionDescription(message.offer));

                    const answer = await pc.createAnswer();
                    await pc.setLocalDescription(answer);

                    if (socket.readyState === WebSocket.OPEN) {
                        socket.send(
                            JSON.stringify({
                                type: 'answer',
                                answer,
                            })
                        );
                    }

                    await flushPendingCandidates();
                }

                if (message.type === 'ice-candidate' && message.candidate) {
                    await addRemoteIceCandidate(message.candidate);
                }

                if (message.type === 'call-ended' || message.type === 'peer-left') {
                    cleanup();
                }
            };

            socket.onerror = () => {
                setError('Signaling connection failed');
            };

            socket.onclose = () => {
                setIsConnected(false);
            };

        } catch (err) {
            console.error('Error joining call:', err);
            setError(err instanceof Error ? err.message : 'Failed to join call');
            cleanup();
        }
    }, [addRemoteIceCandidate, cleanup, connectSignalingSocket, flushPendingCandidates, initializePeerConnection, setupLocalAudio]);

    const endCall = useCallback(() => {
        if (socketRef.current?.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify({ type: 'end-call' }));
        }
        cleanup();
    }, [cleanup]);

    useEffect(() => {
        return () => {
            cleanup();
        };
    }, [cleanup]);

    return {
        localStream,
        remoteStream,
        startCall,
        joinCall,
        endCall,
        isConnected,
        error,
    };
}

export default useWebRTCCall;
