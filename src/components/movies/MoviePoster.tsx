import { useState } from 'react'
import './MoviePoster.css'

interface MoviePosterProps {
  posterUrl?: string
  title: string
}

function MoviePoster({ posterUrl, title }: MoviePosterProps) {
  const [hasError, setHasError] = useState(false)

  if (!posterUrl || hasError) {
    return (
      <div
        className="movie-poster movie-poster--placeholder"
        role="img"
        aria-label={`${title} poster unavailable`}
      >
        <span>No poster available</span>
      </div>
    )
  }

  return (
    <img
      className="movie-poster"
      src={posterUrl}
      alt={`${title} movie poster`}
      loading="lazy"
      onError={() => setHasError(true)}
    />
  )
}

export default MoviePoster
