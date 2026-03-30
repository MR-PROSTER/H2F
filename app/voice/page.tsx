'use client'
import { useEffect, useRef } from "react"
import Image from 'next/image'
import Visualizer from "@/components/voice/visualizer"
import useRecordingStore from '@/store/useRecordingStore'
import { sampleTranscription } from "@/store/sampleTranscription"

// ── Transcript Panel ────────────────────────────────────
const TranscriptPanel = ({ isRecording }: { isRecording: boolean }) => {
    const transcript = useRecordingStore((state) => state.transcript)
    const bottomRef = useRef<HTMLDivElement>(null)

    // Testing Transcription
    const transcription = sampleTranscription;


    // Auto scroll to bottom on new lines
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [transcript])

    return (
        <div className="flex flex-col h-full bg-[#090909]">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[#9d9d9d]">
                <h1 className="font-bold text-white text-2xl font-oxanium tracking-wide">
                    LIVE TRANSCRIPT
                </h1>
                {isRecording && (
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-green-500 text-xs font-mono tracking-widest">
                            LIVE
                        </span>
                    </div>
                )}
                {!isRecording && transcript.length > 0 && (
                    <span className="text-[#475569] text-xs font-mono">
                        {transcript.length} lines
                    </span>
                )}
            </div>

            {/* Transcript lines */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
                {transcription.transcript.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center">
                        <p className="text-[#b7b7b7] font-mono text-sm tracking-widest uppercase">
                            {isRecording ? 'Listening...' : 'No transcript yet'}
                        </p>
                    </div>
                ) : (
                    transcription.transcript.map((line, i) => (
                        <div
                            key={i}
                            className="rounded-lg p-3 bg-[#0e0e0e] border-[#717171]">
                            <div className="flex items-center gap-2 mb-1">
                                <span
                                    className="text-xs font-mono font-bold tracking-widest"
                                    style={{
                                        color: line.speaker_label === 'SPEAKER_1' || line.speaker_role === 'doctor'
                                            ? '#10b981'
                                            : '#94A3B8'
                                    }}
                                >
                                    {line.speaker_role.toUpperCase()}
                                </span>
                                {line.language && (
                                    <span className="text-xs px-1.5 py-0.5 rounded font-mono bg-[#975d4e]/30 text-[#d3b3ab]">
                                        {line.language.toUpperCase()}
                                    </span>
                                )}
                                <span className="text-xs text-[#475569] font-mono ml-auto">
                                    {line.timestamp_seconds.toFixed(1)}s
                                </span>
                            </div>
                            <p className="text-[#E2E8F0] text-sm leading-relaxed font-lexend">
                                "{line.text}"
                            </p>
                        </div>
                    ))
                )}
                <div ref={bottomRef} />
            </div>
        </div>
    )
}

// ── Extraction Panel ────────────────────────────────────
const ExtractionPanel = ({ isRecording }: { isRecording: boolean }) => {
    const extraction = useRecordingStore((state) => state.extraction)
    const updateExtraction = useRecordingStore((state) => state.updateExtraction)

    const isSessionReady = useRecordingStore((state) => state.sessionReady)

    const fields = [
        { key: 'chief_complaint', label: 'CHIEF COMPLAINT', editable: true },
        { key: 'duration', label: 'DURATION', editable: true },
        { key: 'past_medical_history', label: 'PAST MEDICAL HISTORY', editable: true },
        { key: 'medications', label: 'MEDICATIONS', editable: true },
        { key: 'diagnosis', label: 'DIAGNOSIS', editable: true },
        { key: 'treatment_plan', label: 'TREATMENT PLAN', editable: true },
    ] as const

    return (
        <div className="flex flex-col h-full bg-[#090909]">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[#9d9d9d]">
                <h1 className="font-bold text-white text-2xl font-oxanium tracking-wide">
                    LIVE EXTRACTION
                </h1>
                <div className="flex items-center gap-2">
                    <span className="text-[#8B5CF6] text-xs font-mono">✦ AI</span>
                    {isRecording && (
                        <div className="w-2 h-2 rounded-full bg-[#8B5CF6] animate-pulse" />
                    )}
                </div>
            </div>

            {/* Fields */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">

                {/* Editable fields */}
                {fields.map(({ key, label, editable }) => {
                    const value = extraction[key] as string | null
                    return (
                        <div
                            key={key}
                            className="rounded-lg p-3 bg-[#0e0e0e] border-[#717171]">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-mono text-[#dadada] tracking-widest">
                                    {label}
                                </span>
                                {value && (
                                    <span className="ml-auto text-[#10B981]" style={{ fontSize: 8 }}>●</span>
                                )}
                            </div>
                            {/* Editable when recording is done */}
                            {!isRecording && editable ? (
                                <textarea
                                    className="w-full bg-transparent text-sm text-[#F1F5F9]
                             font-lexend resize-none outline-none
                             placeholder-[#b7b7b7] min-h-[28px]"
                                    value={value || ''}
                                    placeholder="Not detected"
                                    onChange={(e) => updateExtraction({ [key]: e.target.value })}
                                    rows={2}
                                />
                            ) : (
                                <p className="text-sm font-lexend"
                                    style={{ color: value ? '#F1F5F9' : '#334155' }}>
                                    {value || 'Waiting for context...'}
                                </p>
                            )}
                        </div>
                    )
                })}

                {/* Symptoms tags */}
                <div className="rounded-lg p-3 bg-[#0e0e0e] border-[#717171]">
                    <span className="text-xs font-mono text-[#dadada] tracking-widest block mb-2">
                        ASSOCIATED SYMPTOMS
                    </span>
                    <div className="flex flex-wrap gap-2">
                        {extraction.associated_symptoms.length > 0
                            ? extraction.associated_symptoms.map((s, i) => (
                                <span key={i} className="text-xs px-2 py-1 rounded-full font-lexend bg-[#334155] text-[#E2E8F0]">
                                    {s}
                                </span>
                            ))
                            : <span className="text-sm text-[#b7b7b7] font-lexend">Detecting...</span>
                        }
                    </div>
                </div>

                {/* Sentiment + Keywords */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg p-3 bg-[#0e0e0e] border-[#717171]">
                        <span className="text-xs font-mono text-[#b7b7b7] tracking-widest block mb-1">
                            SENTIMENT
                        </span>
                        <p className="text-lg font-bold text-[#b7b7b7] font-oxanium">
                            {extraction.sentiment}
                        </p>
                    </div>
                    <div className="rounded-lg p-3 bg-[#0e0e0e] border-[#717171]">
                        <span className="text-xs font-mono text-[#b7b7b7] tracking-widest block mb-1">
                            STATUS
                        </span>
                        <p className="text-lg font-bold font-oxanium"
                            style={{ color: isRecording ? '#10B981' : '#F59E0B' }}>
                            {isRecording ? 'Live' : 'Review'}
                        </p>
                    </div>
                </div>

                {/* Save button — only show after recording */}
                {!isRecording && (
                    <button
                        className={`w-full py-3 rounded-xl font-semibold font-outfit
                       text-white transition-all duration-200 mt-2 ${!isSessionReady ? "bg-[#2b7fff]" : "bg-[#1f1f1f]"}`}>
                        ✓ Approve & Save Report
                    </button>
                )}
            </div>
        </div>
    )
}

// -- start screen ---------------
const StartScreen = () => {
    const setHasStarted = useRecordingStore((state) => state.setHasStarted)
    const setSessionReady = useRecordingStore((state) => state.setSessionReady)

    const handleStart = () => {
        setHasStarted(true)
        setSessionReady(true)
        // isRecording will be set to true by the Visualizer
        // when user clicks Start Recording inside it
    }

    return (
        <div className="w-full min-h-screen bg-[#080708] flex flex-col
                    items-center justify-center gap-8 font-oxanium">

            {/* Image */}
            <div className="rounded-full flex items-center
                      justify-center text-4xl">
                <Image src='/mic.png' alt='Mic Icon' width={128} height={128} />
            </div>

            {/* Text */}
            <div className="text-center flex flex-col gap-3">
                <h1 className="text-white text-4xl font-bold font-oxanium
                       tracking-wide">
                    Ready to Record?
                </h1>
                <p className="text-[#9d9d9d] font-lexend text-lg max-w-md">
                    Start a new session to begin live transcription
                    and AI-powered extraction.
                </p>
            </div>

            {/* Domain badges */}
            <div className="flex gap-3">
                <span className="px-4 py-2 rounded-full text-sm font-outfit font-semibold bg-teal-500/20 border-teal-500/30">
                    Healthcare
                </span>
                <span className="px-4 py-2 rounded-full text-sm font-outfit font-semibold bg-amber-500/20 border-amber-500/30">
                    Finance
                </span>
            </div>

            {/* Start button */}
            <button
                onClick={handleStart}
                className="px-8 py-4 rounded-xl text-white font-semibold
                   text-lg font-outfit transition-all duration-200
                   hover:scale-105 active:scale-95 bg-blue-500">
                Start New Session
            </button>

            <p className="text-[#6b6b6b] text-sm font-mono">
                Make sure your microphone is connected
            </p>
        </div>
    )
}

// ── Main Page ───────────────────────────────────────────
const VoiceRecordingPage = () => {
    const isRecording = useRecordingStore((state) => state.isRecording)
    const hasStarted = useRecordingStore((state) => state.hasStarted)

    const sessionReady = useRecordingStore((state) => state.sessionReady)

    const showVisualizer = sessionReady || isRecording
    const showReviewLayout = hasStarted && !isRecording && !sessionReady

    const isPreSession = !hasStarted                    // show start screen
    const isInSession = hasStarted && isRecording      // show 3 columns
    const isPostSession = hasStarted && !isRecording  // show 3 columns with "Review" status

    if (isPreSession) return <StartScreen />

    return (
        <div className="w-full bg-[#080708] min-h-screen flex flex-col">
            <div className="w-full h-full flex gap-3 items-stretch justify-center p-4">

                {/* LEFT — Transcript */}
                <div
                    className="h-[90vh] bg-[#0f0e10] rounded-2xl overflow-hidden
                     transition-all duration-500 ease-in-out"
                    style={{
                        width: showReviewLayout ? '48%' : '25%'
                    }}
                >
                    <TranscriptPanel isRecording={isRecording} />
                </div>

                {/* CENTER — Visualizer */}
                <div
                    className="h-[90vh] bg-[#070807] rounded-2xl flex flex-col
                     items-center justify-center overflow-hidden
                     transition-all duration-500 ease-in-out"
                    style={{
                        width: showVisualizer ? '50%' : '0%',
                        opacity: showVisualizer ? 1 : 0,
                        pointerEvents: showVisualizer ? 'auto' : 'none',
                    }}
                >
                    <Visualizer showButton={true} />
                </div>

                {/* RIGHT — Extraction */}
                <div
                    className="h-[90vh] bg-[#0f0e10] rounded-2xl overflow-hidden
                     transition-all duration-500 ease-in-out"
                    style={{
                        width: showReviewLayout ? '48%' : '25%'
                    }}
                >
                    <ExtractionPanel isRecording={isRecording} />
                </div>

            </div>
        </div>
    )
}

export default VoiceRecordingPage
