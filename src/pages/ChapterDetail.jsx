import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import './ChapterDetail.css'

function ChapterDetail() {
  const { id } = useParams()
  const [chapter, setChapter] = useState(null)
  const [chapters, setChapters] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/trains/data/chapters.json')
      .then(res => res.json())
      .then(data => {
        setChapters(data.chapters)
        const foundChapter = data.chapters.find(ch => ch.id === parseInt(id))
        setChapter(foundChapter)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error loading chapters:', err)
        setLoading(false)
      })
  }, [id])

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  if (!chapter) {
    return <div className="error">Chapter not found</div>
  }

  const currentIndex = chapters.findIndex(ch => ch.id === parseInt(id))
  const prevChapter = currentIndex > 0 ? chapters[currentIndex - 1] : null
  const nextChapter = currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : null

  return (
    <div className="chapter-container">
      <Link to="/trains/" className="back-link">&larr; Back to Chapters</Link>

      <div className="chapter-header">
        <div className="chapter-number">Chapter {chapter.id}</div>
        <h1>{chapter.title}</h1>
        <p className="word-count">{chapter.wordCount} words</p>
      </div>

      <div className="chapter-content">
        <ReactMarkdown>{chapter.content}</ReactMarkdown>
      </div>

      <div className="chapter-navigation">
        <div className="nav-left">
          {prevChapter && (
            <Link to={`/trains/chapters/${prevChapter.id}`} className="nav-btn">
              ← Previous Chapter
            </Link>
          )}
        </div>
        <div className="nav-center">
          <Link to="/trains/" className="home-link">All Chapters</Link>
        </div>
        <div className="nav-right">
          {nextChapter && (
            <Link to={`/trains/chapters/${nextChapter.id}`} className="nav-btn">
              Next Chapter →
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

export default ChapterDetail
