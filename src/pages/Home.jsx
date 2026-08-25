import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import TrackVisualization from '../components/TrackVisualization'
import './Home.css'

function Home() {
  const [chapters, setChapters] = useState([])
  const [loading, setLoading] = useState(true)
  const [highlightedStation, setHighlightedStation] = useState(null)

  useEffect(() => {
    fetch('/trains/data/chapters.json')
      .then(res => res.json())
      .then(data => {
        setChapters(data.chapters)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error loading chapters:', err)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  return (
    <div className="home-container">
      <div className="header">
        <h1>The Indian Railway Story</h1>
        <p className="subtitle">A journey through complex systems</p>
      </div>

      <TrackVisualization
        chapters={chapters}
        highlightedStation={highlightedStation}
        setHighlightedStation={setHighlightedStation}
      />

      <div className="appendix-section">
        <h2>Appendix: Railway Map</h2>
        <p>Interactive map of the Indian Railway network</p>
        <div className="map-container">
          <iframe src="/trains/data/railway-map.pdf" className="pdf-viewer"></iframe>
        </div>
        <a href="/trains/data/railway-map.pdf" download className="download-btn">
          Download PDF Map
        </a>
      </div>
    </div>
  )
}

export default Home
