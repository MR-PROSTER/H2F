import { Bell, BriefcaseMedical, ChevronRight, CircleDollarSign, HatGlasses, Info, Search } from 'lucide-react'
import { useState } from 'react'

const HomePage = () => {
    const [selected, setSelected] = useState(false);
    const [choice, setChoice] = useState<'healthcare' | 'finance' | null>(null);
    const [lang, setLang] = useState<'english' | 'kannada' | 'hindi' | 'telugu' | null>(null);
    return (
        <div className=' w-full h-screen flex flex-col p-2'>
            <nav className='h-16 w-full flex items-center justify-center'>
                <div className='w-full h-full p-2'>
                    <div className='w-1/2 h-full rounded-2xl flex items-center bg-[#080708] border border-[#19171a]'>
                        <Search size={24} className='text-white m-4' />
                        <h3 className='font-medium text-gray-500'>search or press ctrl + k</h3>
                    </div>
                </div>
                <div className='w-full h-full flex items-center justify-end'>
                    <div className="border w-fit rounded-full mx-4 ">
                        <Bell size={24} className="text-white m-2" />
                    </div>
                    <div className='border w-fit rounded-full mx-4 bg-white'>
                        <HatGlasses size={24} className='text-black m-2' />
                    </div>
                </div>
            </nav>
            <div className='h-full w-full rounded-2xl flex flex-col items-center'>
                <div className='h-full w-full flex items-center justify-center p-16'>
                    <div className='h-full w-full border border-gray-500 bg-[#0f0e10] rounded-3xl flex flex-col items-center justify-center'>
                        <div className='w-full h-1/6 flex flex-col items-center justify-center mt-4' style={{ fontFamily: 'Syne' }}>
                            <h1 className='font-bold text-white text-5xl m-2'>Set up your <span className={`${choice == 'healthcare' ? "text-teal-500" : choice == 'finance' ? "text-amber-500" : "text-gray-500"}`}>Workspace</span></h1>
                            <h4 className='font-semibold text-amber-50 text-3xl m-2 font-syne'>IDRP adapts its AI model, terminology and report structure to match your domain.</h4>
                        </div>
                        <div className='w-full h-4/6 flex items-center justify-evenly p-16 gap-4 '>
                            <div className={`relative h-full w-1/2  rounded-2xl  p-16  flex flex-col items-start justify-start border border-teal-500/30 ${choice == 'healthcare' ? 'bg-teal-500/20' : 'bg-teal-500/5'} hover:border-sky-500/70 hover:shadow-[0_0_30px_rgba(14,165,233,0.1)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1`} onClick={() => { setChoice("healthcare"); setSelected(true) }}>
                                <div className='w-fit h-fit bg-[#0a0a0a] p-4 rounded-2xl ml-3'>
                                    <BriefcaseMedical size={50} className='text-teal-500 transition-transform duration-200 ease-in-out hover:scale-[1.08]' />
                                </div>
                                <div className='h-full w-full p-4 z-2'>
                                    <h1 className='text-white font-bold text-6xl' style={{ fontFamily: "syne" }}>Healthcare</h1>
                                    <h5 className='mt-2 mb-4 text-gray-500'>Doctors · Hospitals · Clinics</h5>
                                    <h4 className='text-gray-200 font-medium text-xl mt-4'>AI transcribes your patient conversations in various languages. Medical reports generated automatically.</h4>
                                </div>
                                <div className='h-full w-full'>
                                    <button className='p-2 w-fit h-fit bg-[#0a0a0a] text-white m-2 rounded-lg text-md border-teal-500/50 border' onClick={() => { setLang('english'); }}>English</button>
                                    <button className='p-2 w-fit h-fit bg-[#0a0a0a] text-white m-2 rounded-lg text-md border-teal-500/50 border' onClick={() => { setLang('kannada'); }}>Kannada</button>
                                    <button className='p-2 w-fit h-fit bg-[#0a0a0a] text-white m-2 rounded-lg text-md border-teal-500/50 border' onClick={() => { setLang('hindi'); }}>Hindi</button>
                                    <button className='p-2 w-fit h-fit bg-[#0a0a0a] text-white m-2 rounded-lg text-md border-teal-500/50 border' onClick={() => { setLang('telugu'); }}>Telugu</button>
                                </div>
                                <div className='absolute bottom-0 right-0 z-1'>
                                    {/* <BriefcaseMedical size={300} className='text-[#191919]' /> */}
                                </div>
                            </div>
                            <div className={`relative h-full w-1/2  rounded-2xl  p-16  flex flex-col items-start justify-start border border-amber-500/30 ${choice == 'finance' ? 'bg-amber-500/20' : 'bg-amber-500/5'} hover:border-amber-500/70 hover:shadow-[0_0_30px_rgba(245,158,11,0.1)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1`}
                                onClick={() => { setChoice("finance"); setSelected(true) }}>
                                <div className='w-fit h-fit bg-[#0a0a0a] p-4 rounded-2xl ml-3'>
                                    <CircleDollarSign size={50} className='text-amber-500 transition-transform duration-200 ease-in-out hover:scale-[1.08]' />
                                </div>
                                <div className='h-full w-full p-4 z-2'>
                                    <h1 className='text-white font-bold text-6xl' style={{ fontFamily: "syne" }}>Finance</h1>
                                    <h5 className='mt-2 mb-4 text-gray-500'>Banks · NBFCs · Loan Recovery</h5>
                                    <h4 className='text-gray-200 font-medium text-xl mt-4'>AI conducts loan follow-up
                                        calls automatically. Payment data extracted.
                                        No human agent required.</h4>
                                </div>
                                <div className='h-full w-full'>
                                    <button className='p-2 w-fit h-fit bg-[#0a0a0a] text-white m-2 rounded-lg text-md border-amber-500/50 border' onClick={() => { setLang('english'); }}>English</button>
                                    <button className='p-2 w-fit h-fit bg-[#0a0a0a] text-white m-2 rounded-lg text-md border-amber-500/50 border' onClick={() => { setLang('kannada'); }}>Kannada</button>
                                    <button className='p-2 w-fit h-fit bg-[#0a0a0a] text-white m-2 rounded-lg text-md border-amber-500/50 border' onClick={() => { setLang('hindi'); }}>Hindi</button>
                                    <button className='p-2 w-fit h-fit bg-[#0a0a0a] text-white m-2 rounded-lg text-md border-amber-500/50 border' onClick={() => { setLang('telugu'); }}>Telugu</button>
                                </div>
                                <div className='absolute bottom-0 right-0 z-1'>
                                    {/* <CircleDollarSign size={300} className='text-[#191919]' /> */}
                                </div>
                            </div>
                        </div>
                        <div className='relative w-full h-1/6 flex flex-col items-center justify-between'>
                            <h1 className='absolute text-white font-medium text-lg -translate-y-10'>Your selection can be changed anytime
                                in Settings → Workspace</h1>
                            <div className='flex items-center justify-center gap-8'>
                                <div>
                                    <Info size={24} className='text-white' />
                                </div>
                                <div>
                                    <h3 className='text-white font-medium font-inter'>Domain settings affect the AI Terminology and entity extraction models.</h3>
                                </div>
                                <div>
                                    <h1 className='text-2xl text-white'>Need Help?</h1>
                                </div>
                                <div className={`flex items-center justify-center w-fit h-fit ${selected ? 'bg-blue-500' : 'bg-gray-500'} transition-all duration-300 p-4 rounded-2xl`}>
                                    <h4 className='text-white text-xl font-semibold'>Continue</h4>
                                    <ChevronRight size={24} className='text-white' />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default HomePage
