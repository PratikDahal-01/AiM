import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './routes/Home'
import FindDoctor from './routes/FindDoctor'
import LabTests from './routes/LabTests'
import Medicine from './routes/Medicine'
import DoctorRegistration from './routes/DoctorRegistration'



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/doctor' element={<FindDoctor />} />
        <Route path='/lab-tests' element={<LabTests />} />
        <Route path='/medicine' element={<Medicine />} />
        <Route path='/register' element={<DoctorRegistration />} />
      </Routes>
    </Router>
  )
}

export default App