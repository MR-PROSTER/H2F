
const VoiceRecordingPage = () => {
    return (
        <div className=" w-full bg-[#080708] min-h-screen px-2 flex">
            <div className='h-full w-1/4 bg-[#0f0e10] rounded-t-2xl'>
                <h1 className='font-bold text-white text-4xl p-4' style={{ fontFamily: 'syne' }}>LIVE TRANSCRIPT</h1>
            </div>
            <div className='relative h-full w-2/4 bg-[#070807] rounded-2xl flex flex-col items-center justify-center p-4'>
                {/* AUDIO VISUALIZER HERE */}
                <div className='bg-[#0f0e10] w-full h-1/3 rounded-2xl'>
                    <h1 className='font-bold text-white text-4xl p-4 flex items-center justify-center' style={{ fontFamily: 'syne' }}>AUDIO VISUALIZER</h1>
                </div>
                <div className='absolute bg-[#0f0e10] w-full h-2/12 bottom-0'>
                    <h1 className='font-bold text-white text-4xl p-4 flex items-center justify-center' style={{ fontFamily: 'syne' }}>CONTROLS</h1>
                </div>
            </div>
            <div className='h-full w-1/4 bg-[#0f0e10] rounded-t-2xl'>
                <h1 className='font-bold text-white text-4xl p-4' style={{ fontFamily: 'syne' }}>LIVE EXTRACTION</h1>
            </div>
        </div>
    )
}

export default VoiceRecordingPage
