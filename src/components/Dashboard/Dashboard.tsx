const Dashboard = () => {
    return (
        <div className='w-full h-full bg-black flex flex-col'>
            <div className='w-full h-24 bg-[#121212] '></div>
            <div className='w-full h-full bg-[#121212] grid grid-cols-4 grid-rows-5 gap-4 p-4'>
                <div className='col-span-1 row-span-1 bg-[#1a1a1a] rounded-xl'></div>
                <div className='col-span-1 row-span-1 bg-[#1a1a1a] rounded-xl'></div>
                <div className='col-span-1 row-span-1 bg-[#1a1a1a] rounded-xl'></div>
                <div className='col-span-1 row-span-1 bg-[#1a1a1a] rounded-xl'></div>
                <div className='col-span-2 row-span-2 bg-[#1a1a1a] rounded-2xl'></div>
                <div className='col-span-2 row-span-2 bg-[#1a1a1a] rounded-2xl'></div>
                <div className='col-span-2 row-span-2 bg-[#1a1a1a] rounded-2xl'></div>
                <div className='col-span-2 row-span-2 bg-[#1a1a1a] rounded-2xl'></div>
            </div>
        </div>
    )
}

export default Dashboard
