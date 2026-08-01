import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom'
import Home from './pages/Home'
import ChapterDetail from './pages/ChapterDetail'
import Footer from './components/Footer'
import './App.css'

function Layout() {
  return (
    <>
      <Outlet />
      <Footer />
    </>
  )
}

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/trains/" element={<Home />} />
          <Route path="/trains/chapters/:id" element={<ChapterDetail />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
