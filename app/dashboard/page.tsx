'use client'
import { ChartBarInteractive } from "@/components/dashboard/LineGraph";
import { DatePickerWithRange } from "@/components/dashboard/DatePicker"
import { SelectDemo } from "@/components/dashboard/DomainFilder";
import { useState } from "react"
import { ChartPieLegend } from "@/components/dashboard/PieGraph";
import { PatientConditionChart } from "@/components/dashboard/PatientCondition";
import { SentimentTrendChart } from "@/components/dashboard/SentimentGraph";

const basicInfo = [
    {
        title: "TOTAL SESSIONS",
        value: "1284",
        change: "46%"
    },
    {
        title: "AVERAGE DURATION",
        value: "18m 24s",
        change: "3.1%"
    },
    {
        title: "SATISFACTION SCORE",
        value: "4.8/5",
        change: "Good"
    }, {
        title: "TOTAL PATIENTS",
        value: "35",
        change: "17%"
    }
]

const DashboardPage = () => {
    const [range, setRange] = useState(7)
    const handleRangeChange = (range: number) => {
        setRange(range);
    }

    return (
        <div className='font-oxanium bg-black'>
            <div className='w-full h-[120vh] flex flex-col'>
                {/* Hero Section */}
                <div className='w-full h-2/24 flex items-center justify-center gap-4 py-4 px-2'>
                    {/* Title */}
                    <div className='h-full w-1/3 flex items-center justify-start p-4'>
                        <h1 className='text-4xl font-semibold text-white' style={{ fontFamily: "Outfit" }}>ANALYTICS DASHBOARD</h1>
                    </div>
                    {/* Range Selector */}
                    <div className='h-full w-1/3 flex items-center justify-center p-2'>
                        <div className="h-8/12 w-2/3 bg-black rounded-2xl border-2 border-white flex">
                            <div className={`h-full w-1/3 border-r-2 border-white rounded-l-xl flex items-center justify-center hover:bg-[#f1f1f1] hover:text-black ${range === 7 ? "bg-[#f1f1f1] text-black" : "text-white"}`}
                                onClick={() => handleRangeChange(7)}>
                                <h1 className='text-md font-semibold m-4'>7 DAYS</h1>
                            </div>
                            <div className={`h-full w-1/3 border-r-2 border-white flex items-center justify-center hover:bg-[#f1f1f1] hover:text-black ${range === 30 ? "bg-[#f1f1f1] text-black" : "text-white"}`}
                                onClick={() => handleRangeChange(30)}>
                                <h1 className='text-md font-semibold m-4'>30 DAYS</h1>
                            </div>
                            <div className={`h-full w-1/3  border-white rounded-r-xl flex items-center justify-center hover:bg-[#f1f1f1] hover:text-black ${range === 90 ? "bg-[#f1f1f1] text-black" : "text-white"}`}
                                onClick={() => handleRangeChange(90)}>
                                <h1 className='text-md font-semibold m-4'>90 DAYS</h1>
                            </div>
                        </div>
                    </div>
                    {/* Specific Range and Domain Filter */}
                    <div className='h-full w-1/3 flex items-center justify-center gap-4 p-2'>
                        <div className='h-full w-1/2  flex items-center justify-center rounded-xl'>
                            <DatePickerWithRange />
                        </div>
                        <div className='h-full w-1/2 flex items-center justify-center rounded-xl'>
                            <SelectDemo />
                        </div>
                    </div>
                </div>
                {/* Basic Info */}
                <div className='w-full h-4/24 flex items-center justify-center gap-8 p-4'>
                    {basicInfo.map((info, index) => {
                        return (
                            <div key={index} className="relative h-full w-1/4 bg-[#0f0e10] rounded-2xl flex flex-col justify-around shadow-[5px_5px_10px_6px_rgba(0,_0,_0,_0.35)]">
                                <h1 className='text-2xl font-semibold text-white m-4'>{info.title}</h1>
                                <h1 className='text-6xl font-semibold text-white m-4'>{info.value}</h1>
                                <div className='absolute bottom-8 right-4 rounded-xl bg-green-700 text-green-300 border-green-300 border font-semibold h-8 w-16 flex items-center justify-center'>
                                    {info.change}
                                </div>
                            </div>
                        )
                    })}
                </div>
                {/* Sessions Per Day and Language Disctribution */}
                <div className=' z-0 w-full h-9/24 flex items-center justify-center gap-4 p-4'>
                    <div className=' z-10 h-full w-2/3 bg-[#0f0e10] rounded-2xl shadow-[5px_5px_10px_6px_rgba(0,_0,_0,_0.35)]'>
                        <ChartBarInteractive />
                    </div>
                    <div className='h-full w-1/3 bg-[#0f0e10] rounded-2xl shadow-[5px_5px_10px_6px_rgba(0,_0,_0,_0.35)]'>
                        <ChartPieLegend />
                    </div>
                </div>
                {/* Sentiment Trend and Payment Distribution */}
                <div className='w-full h-9/24 flex items-center justify-center gap-4 p-4'>
                    <div className='h-full w-1/4 bg-[#0f0e10] rounded-2xl shadow-[5px_5px_10px_6px_rgba(0,_0,_0,_0.35)]'>
                        <PatientConditionChart />
                    </div>
                    <div className='h-full w-3/4 bg-[#0f0e10] rounded-2xl shadow-[5px_5px_10px_6px_rgba(0,_0,_0,_0.35)]'>
                        <SentimentTrendChart />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DashboardPage
