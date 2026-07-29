import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import ChapterDetail from './pages/ChapterDetail'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/trains/" element={<Home />} />
        <Route path="/trains/chapters/:id" element={<ChapterDetail />} />
      </Routes>
    </Router>
  )
}

export default App
