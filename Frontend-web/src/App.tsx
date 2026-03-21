import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './Dashboard'
import Home from './Home'
import VoiceRecording from './VoiceRecording'

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/dashboard' element={<Dashboard />} />
                <Route path='/home' element={<Home />} />
                <Route path='/voice' element={<VoiceRecording />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
