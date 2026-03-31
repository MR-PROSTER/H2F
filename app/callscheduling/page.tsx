"use client"
import { ArrowLeft, ArrowRight, Info, Video } from 'lucide-react'
import { useState } from 'react';
import Image from "next/image"

const daysAndSessions = [
    {
        day: "Mon",
        sessions: "12"
    },
    {
        day: "Tue",
        sessions: "13"
    },
    {
        day: "Wed",
        sessions: "15"
    },
    {
        day: "Thur",
        sessions: "17"
    },
    {
        day: "Fri",
        sessions: "11"
    },
    {
        day: "Sat",
        sessions: "3"
    },
    {
        day: "Sun",
        sessions: "0"
    },
]

const ScheduledCallsPage = () => {
    const scheduledCalls = ["Call 1", "Call 2", "Call 3", "Call 4"]
    const [expanded, setExpanded] = useState(false);

    const handleexpanded = () => {
        setExpanded(!expanded)
    }
    return (
        <div className='w-full h-screen flex flex-col font-oxanium bg-black'>
            {/* Hero Section */}
            <div className='w-full h-1/12 flex items-center justify-center gap-4 p-4'>
                {/* Title */}
                <div className='h-full w-1/3 flex items-center justify-start '>
                    <h1 className='text-3xl font-semibold text-white m-4'>SCHEDULED CALLS</h1>
                </div>
                {/* Range Selector */}
                <div className='h-full w-1/3'>
                </div>
                {/* Specific Range and Domain Filter */}
                <div className='h-full w-1/3 flex items-center justify-end gap-4 p-2'>
                    <div className='h-full w-fit bg-[#0f0e10] flex items-center justify-center rounded-xl p-4'>
                        <ArrowLeft size={24} className="text-white font-bold" />
                    </div>
                    <div className='h-full w-fit bg-[#0f0e10] flex items-center justify-center rounded-xl p-4'>
                        <ArrowRight size={24} className="text-white font-bold" />
                    </div>
                </div>
            </div>
            {/* Schedule */}
            <div className='w-full h-2/12 flex items-center justify-center gap-4 p-4'>
                {daysAndSessions.map((das, index) => (
                    <div key={index} className="h-full w-1/7 bg-[#0a0a0a] rounded-2xl">
                        <h1 className='text-3xl font-semibold text-white m-4'>{das.day}</h1>
                        <div className="w-full h-1/2 text-start flex">
                            <h1 className='text-5xl font-semibold text-white m-4'>{das.sessions}</h1>
                            <div className="h-full w-1/2">
                                {/* Dots have to come here... */}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {/* Menu */}
            <div className="w-full h-16 flex items-center justify-evenly gap-4 p-4">
                <div className='h-full w-full flex items-center justify-start gap-4'>
                    <div className='h-full w-fit p-4'>
                        <span className="text-xl font-semibold text-white border-b-4 border-white p-2">Upcoming Sessions</span>
                    </div>
                    <div className='h-full w-fit p-4'>
                        <span className="text-xl font-semibold text-white p-2">Past Logs</span>
                    </div>
                </div>
                <div className="h-full w-full flex items-center justify-end gap-4 p-4">
                    <div className='h-full w-fit p-4 bg-[#0f0e10] flex items-center justify-center rounded-xl'>
                        <h1 className='text-sm font-semibold text-white'>FILTER</h1>
                    </div>
                </div>
            </div>
            {/* Upcoming Sessions */}
            <div className='w-full h-6/12 rounded-2xl flex gap-4 p-4'>
                <div className={`${expanded ? "w-1/2" : "w-full"} h-full rounded-2xl flex flex-col gap-4 p-4 transition-all duration-700`}>
                    {scheduledCalls.map((val, i) => (
                        <div key={i} className="h-1/4 bg-[#0a0a0a] rounded-2xl font-semibold text-2xl text-white flex items-center justify-center gap-4 p-2">
                            {/* Time and Schedule */}
                            <div className="relative h-full w-1/8 flex flex-col items-center justify-center border-r-[#9d9d9d] border-r">
                                <h1 className='text-3xl font-semibold text-white'>09:30 AM</h1>
                                <h3 className="text-lg font-semibold text-[#9d9d9d]">Live Now</h3>
                                <div className="absolute w-2 h-full bg-blue-500 left-0 rounded-r-xl"></div>
                            </div>
                            {/* User Info */}
                            <div className="h-full w-2/8  flex items-center justify-center gap-4 p-2">
                                {/* Profile Pic */}
                                <div className="h-full w-1/3  flex items-center justify-center">
                                    <Image src="/profilepic.png" alt="profile_pic" className="rounded-full" width={64} height={64} />
                                </div>
                                {/* Profile Info */}
                                <div className="h-full w-2/3  flex flex-col items-center justify-center">
                                    <h1 className="text-2xl text-white pt-1 ">Madasu Praneeth</h1>
                                    <div className="text-sm text-[#9d9d9d] pb-1 ">Routine Checkup</div>
                                </div>
                            </div>
                            {/* Reason  */}
                            <div className="h-full w-3/8 flex items-center justify-center gap-4 p-4">
                                <div className="h-full w-full text-sm text-[#dbdbdb]">Routine check on his ankles and flat foot and to schedule an appointment with a dermatologist</div>
                            </div>
                            {/* View More */}
                            <div className="h-full w-1/8 flex items-center justify-center gap-4 p-4">
                                <button className="w-full h-full bg-[#1f1f1f] rounded-xl text-lg flex items-center justify-center gap-2">
                                    <Info />
                                    View More
                                </button>
                            </div>
                            {/* Join Now*/}
                            <div className="h-full w-1/8 flex items-center justify-center gap-4 p-4">
                                <button className="w-full h-full bg-blue-500 rounded-xl text-lg flex items-center justify-center gap-2">
                                    <Video />
                                    Join Now
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                <div className={`h-full ${expanded ? "w-1/2" : "w-0"} flex gap-4 p-4 transition-all duration-700`}>
                    <div className="h-full w-full rounded-2xl bg-[#0f0e10]"></div>
                </div>
            </div>
            {/* Widgets */}
            <div className="w-full h-2/12 rounded-t-xl flex gap-4 px-4">
                <div className="w-full h-full  flex items-center justify-center gap-4 px-4">
                    <div className="w-full h-full rounded-t-xl bg-[#0a0a0a11]"></div>
                </div>
            </div>
        </div>
    )
}

export default ScheduledCallsPage
