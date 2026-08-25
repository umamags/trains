import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './TrackVisualization.css'

function TrackVisualization({ chapters, highlightedStation, setHighlightedStation }) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const mainChapters = chapters.filter(ch => ch.id <= 8)
  const otherChapters = chapters.filter(ch => ch.id > 8)

  if (isMobile) {
    return <MobileTrackView chapters={chapters} />
  }

  return <DesktopTrackView chapters={mainChapters} otherChapters={otherChapters} highlightedStation={highlightedStation} setHighlightedStation={setHighlightedStation} />
}

function DesktopTrackView({ chapters, otherChapters, highlightedStation, setHighlightedStation }) {
  const svgWidth = 1200
  const svgHeight = 600
  const trackPath = `M 50 200 Q 300 100, 550 150 T 1100 250`

  const positions = chapters.map((_, index) => {
    const t = index / (chapters.length - 1)
    const x = 50 + (1050 * t) + (Math.sin(t * Math.PI) * 100)
    const y = 200 - (Math.sin(t * Math.PI) * 80)
    return { x, y }
  })

  const trackImages = [
    { src: '/trains/Appendix/images/train-tracks-1.jpeg', alt: 'Train tracks curving through landscape' },
    { src: '/trains/Appendix/images/train-tracks-2.webp', alt: 'Train tracks through forest tunnel' }
  ]

  return (
    <div className="track-container">
      <svg
        width="100%"
        height={svgHeight}
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        preserveAspectRatio="xMidYMid meet"
        className="track-svg"
      >
        <defs>
          <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="2" dy="2" stdDeviation="3" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* Landscape background */}
        <rect width={svgWidth} height={svgHeight} fill="#e8f4f8" />

        {/* Hills */}
        <path d={`M 0 400 Q 200 250, 400 350 T 800 320 T 1200 380 L 1200 600 L 0 600`} fill="#a8d08d" opacity="0.6" />
        <path d={`M 0 450 Q 300 350, 600 400 T 1200 420 L 1200 600 L 0 600`} fill="#7fb97f" opacity="0.5" />

        {/* Trees on the left */}
        <g>
          <ellipse cx="100" cy="380" rx="15" ry="30" fill="#5a8c3a" />
          <rect x="98" y="410" width="4" height="25" fill="#6b5344" />

          <ellipse cx="180" cy="400" rx="12" ry="25" fill="#5a8c3a" />
          <rect x="178" y="425" width="4" height="20" fill="#6b5344" />

          <ellipse cx="250" cy="370" rx="18" ry="35" fill="#5a8c3a" />
          <rect x="248" y="405" width="4" height="30" fill="#6b5344" />
        </g>

        {/* Trees on the right */}
        <g>
          <ellipse cx="1050" cy="360" rx="16" ry="32" fill="#5a8c3a" />
          <rect x="1048" y="392" width="4" height="28" fill="#6b5344" />

          <ellipse cx="1120" cy="390" rx="14" ry="28" fill="#5a8c3a" />
          <rect x="1118" y="418" width="4" height="24" fill="#6b5344" />

          <ellipse cx="950" cy="375" rx="15" ry="30" fill="#5a8c3a" />
          <rect x="948" y="405" width="4" height="26" fill="#6b5344" />
        </g>

        {/* Railway track */}
        <g filter="url(#shadow)">
          {/* Outer rail */}
          <path
            d={trackPath}
            fill="none"
            stroke="#8b7355"
            strokeWidth="8"
            strokeLinecap="round"
          />
          {/* Inner rail */}
          <path
            d={trackPath}
            fill="none"
            stroke="#8b7355"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray="0"
            opacity="0.7"
            transform="translate(20 0)"
          />

          {/* Sleepers */}
          {[...Array(30)].map((_, i) => {
            const t = i / 29
            const x = 50 + (1050 * t) + (Math.sin(t * Math.PI) * 100)
            const y = 200 - (Math.sin(t * Math.PI) * 80)
            const angle = Math.atan2(
              -Math.sin(t * Math.PI) * 80,
              1050 / 29 + Math.cos(t * Math.PI) * 100
            )

            return (
              <rect
                key={`sleeper-${i}`}
                x={x - 18}
                y={y - 2}
                width="36"
                height="4"
                fill="#c9a876"
                transform={`rotate(${(angle * 180) / Math.PI} ${x} ${y})`}
                opacity="0.8"
              />
            )
          })}
        </g>

        {/* Other Chapters Icons (Engines & Jobs) */}
        {otherChapters && otherChapters.map((chapter, index) => {
          const xPos = 200 + (index * 150)
          const yPos = 50
          const iconMap = { 9: '🚂', 10: '👷' }
          const icon = iconMap[chapter.id] || '📖'

          return (
            <Link
              key={`other-chapter-${chapter.id}`}
              to={`/trains/chapters/${chapter.id}`}
              className="other-chapter-svg-link"
              style={{ pointerEvents: 'auto' }}
            >
              <g
                className="other-chapter-icon-group"
                style={{ cursor: 'pointer' }}
              >
                {/* Icon background circle */}
                <circle
                  cx={xPos}
                  cy={yPos}
                  r="24"
                  fill="#ffffff"
                  stroke="#0066cc"
                  strokeWidth="2"
                  filter="url(#shadow)"
                  className="other-chapter-icon-bg"
                  style={{ transition: 'all 0.3s ease' }}
                />
                {/* Icon text */}
                <text
                  x={xPos}
                  y={yPos + 8}
                  textAnchor="middle"
                  fontSize="28"
                  style={{ pointerEvents: 'none' }}
                >
                  {icon}
                </text>
                {/* Title below icon */}
                <text
                  x={xPos}
                  y={yPos + 50}
                  textAnchor="middle"
                  fontSize="12"
                  fontWeight="600"
                  fill="#0066cc"
                  style={{ pointerEvents: 'none' }}
                >
                  {chapter.title}
                </text>
              </g>
            </Link>
          )
        })}

        {/* Stations */}
        {chapters.map((chapter, index) => {
          const { x, y } = positions[index]
          const isHighlighted = highlightedStation === chapter.id
          const showFlagAbove = index % 2 === 0

          return (
            <Link
              key={`station-${chapter.id}`}
              to={`/trains/chapters/${chapter.id}`}
              className="station-link"
              style={{ pointerEvents: 'auto' }}
            >
              <g
                className="station-group"
                onMouseEnter={() => setHighlightedStation(chapter.id)}
                onMouseLeave={() => setHighlightedStation(null)}
              >
                {/* Title flag above or below */}
                <g className="title-flag">
                  {showFlagAbove ? (
                    <>
                      {/* Flag above */}
                      <rect
                        x={x - 65}
                        y={y - 80}
                        width="130"
                        height="35"
                        fill="#ffffff"
                        stroke={isHighlighted ? '#d63031' : '#0066cc'}
                        strokeWidth={isHighlighted ? 3 : 2}
                        rx="4"
                        filter="url(#shadow)"
                        className="flag-rect"
                      />
                      {/* Pole connecting flag to station */}
                      <line
                        x1={x}
                        y1={y - 45}
                        x2={x}
                        y2={y - 22}
                        stroke={isHighlighted ? '#d63031' : '#0066cc'}
                        strokeWidth="2"
                      />
                    </>
                  ) : (
                    <>
                      {/* Flag below */}
                      <rect
                        x={x - 65}
                        y={y + 45}
                        width="130"
                        height="35"
                        fill="#ffffff"
                        stroke={isHighlighted ? '#d63031' : '#0066cc'}
                        strokeWidth={isHighlighted ? 3 : 2}
                        rx="4"
                        filter="url(#shadow)"
                        className="flag-rect"
                      />
                      {/* Pole connecting flag to station */}
                      <line
                        x1={x}
                        y1={y + 22}
                        x2={x}
                        y2={y + 45}
                        stroke={isHighlighted ? '#d63031' : '#0066cc'}
                        strokeWidth="2"
                      />
                    </>
                  )}

                  {/* Title text on flag - clickable */}
                  <text
                    x={x}
                    y={showFlagAbove ? y - 60 : y + 72}
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight="600"
                    fill={isHighlighted ? '#d63031' : '#0066cc'}
                    className="flag-title"
                    style={{
                      cursor: 'pointer',
                      textDecoration: isHighlighted ? 'underline' : 'none',
                    }}
                  >
                    {chapter.title.length > 20
                      ? chapter.title.substring(0, 17) + '...'
                      : chapter.title}
                  </text>
                </g>

                {/* Station circle background */}
                <circle
                  cx={x}
                  cy={y}
                  r={isHighlighted ? 28 : 22}
                  fill={isHighlighted ? '#ff6b6b' : '#ffffff'}
                  stroke={isHighlighted ? '#d63031' : '#0066cc'}
                  strokeWidth={isHighlighted ? 4 : 2}
                  className="station-marker"
                  filter="url(#shadow)"
                  style={{ cursor: 'pointer' }}
                />

                {/* Station number */}
                <text
                  x={x}
                  y={y + 7}
                  textAnchor="middle"
                  fontSize="16"
                  fontWeight="bold"
                  fill={isHighlighted ? '#ffffff' : '#0066cc'}
                  className="station-number"
                  style={{ pointerEvents: 'none' }}
                >
                  {chapter.id}
                </text>
              </g>
            </Link>
          )
        })}
      </svg>

      {/* Track Images Gallery */}
      <div className="track-images-gallery">
        {trackImages.map((image, index) => (
          <div key={`track-image-${index}`} className="track-image-item">
            <img
              src={image.src}
              alt={image.alt}
              className="track-image"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

function MobileTrackView({ chapters }) {
  return (
    <div className="mobile-track-container">
      <div className="mobile-track-intro">
        <p className="mobile-track-description">Follow the journey through 8 chapters along the tracks</p>
      </div>
      <div className="mobile-stations-list">
        {chapters.map(chapter => (
          <Link
            to={`/trains/chapters/${chapter.id}`}
            key={chapter.id}
            className="mobile-station-card"
          >
            <div className="mobile-station-header">
              <div className="mobile-station-number">Station {chapter.id}</div>
              <div className="mobile-station-title">{chapter.title}</div>
            </div>
            <div className="mobile-station-meta">{chapter.wordCount} words</div>
            <button className="mobile-read-btn">Read Chapter</button>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default TrackVisualization
