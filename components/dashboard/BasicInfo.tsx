
type BasicInfoProps = {
    totalSessions: number;
    averageDuration: number;
    satisfactionScore: number;
    totalPatients: number;
};

const BasicInfo = ({ totalSessions, averageDuration, satisfactionScore, totalPatients }: BasicInfoProps) => {
    const basicInfo = [
        {
            title: "TOTAL SESSIONS",
            value: totalSessions,
            change: "46%"
        },
        {
            title: "AVERAGE DURATION",
            value: averageDuration,
            change: "3.1%"
        },
        {
            title: "SATISFACTION SCORE",
            value: satisfactionScore,
            change: "Good"
        }, {
            title: "TOTAL PATIENTS",
            value: totalPatients,
            change: "17%"
        }
    ]
    return (
        <div className="w-full h-full flex items-center justify-center  gap-8 p-4">
            {
                basicInfo.map((info, index) => (
                    <div key={index} className="relative h-full w-1/4 bg-[#0f0e10] rounded-2xl flex flex-col justify-around shadow-[5px_5px_10px_6px_rgba(0,0,0,0.35)]">
                        <h1 className='text-2xl font-semibold text-white m-4'>{info.title}</h1>
                        <h1 className='text-6xl font-semibold text-white m-4'>{info.value}</h1>
                        <div className='absolute bottom-8 right-4 rounded-xl bg-green-700 text-green-300 border-green-300 border font-semibold h-8 w-16 flex items-center justify-center'>
                            {info.change}
                        </div>
                    </div>
                ))
            }
        </div>
    )
}

export default BasicInfo
