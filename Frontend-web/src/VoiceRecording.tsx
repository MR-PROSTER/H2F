import Sidebar from "./components/Common/Sidebar"
import VoiceRecordingPage from "./components/VoiceRecording/VoiceRecordingPage"

const VoiceRecording = () => {
    return (
        <div className="bg-[#0a0a0a] min-h-screen px-2 flex">
            <Sidebar />
            <VoiceRecordingPage />
        </div>
    )
}

export default VoiceRecording
