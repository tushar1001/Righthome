import { Route, Routes } from 'react-router'
import DynamicChatbot from './components/DynamicChatbot'
import LandingPage from './components/LandingPage'
import DynamicDetailedProperty from './components/DynamicDetailedProperty'

function App() {
  return (
    <div className='w-full'>
        <Routes>
          <Route path="/" element={<LandingPage/>} />
          <Route path='/dynamic-chatbot' element={<DynamicChatbot/>} />
          <Route path="/properties/:id" element={<DynamicDetailedProperty/>} />
        </Routes>
    </div>
  )
}

export default App
