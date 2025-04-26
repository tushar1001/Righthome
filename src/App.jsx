import { Route, Routes } from 'react-router'
import DynamicChatbot from './components/DynamicChatbot'
import LandingPage from './components/LandingPage'

function App() {
  return (
    <div className='w-full'>
        <Routes>
          <Route path="/" element={<LandingPage/>} />
          <Route path='/dynamic-chatbot' element={<DynamicChatbot/>} />
        </Routes>
    </div>
  )
}

export default App
