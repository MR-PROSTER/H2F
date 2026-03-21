import Sidebar from './components/Common/Sidebar';
import HomePage from './components/Home/HomePage';

const Home = () => {
    return (<>
        <div className='bg-[#0a0a0a] min-h-screen px-2 flex'>
            <Sidebar />
            <HomePage />
        </div>
    </>
    )
}

export default Home
