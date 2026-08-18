import MoviePoster from './MoviePoster'
import type { MovieDetails } from '../../types/movie'
import './MovieDetailsPanel.css'

interface MovieDetailsPanelProps {
  movie: MovieDetails
}

function MovieDetailsPanel({ movie }: MovieDetailsPanelProps) {
  return (
    <article className="movie-details-panel">
      <div className="movie-details-panel__poster-wrap">
        <MoviePoster posterUrl={movie.posterUrl} title={movie.title} />
      </div>

      <div className="movie-details-panel__content">
        <header className="movie-details-panel__header">
          <h1 className="movie-details-panel__title">{movie.title}</h1>
          <div className="movie-details-panel__meta">
            <span>{movie.year}</span>
            {movie.runtime ? <span>{movie.runtime}</span> : null}
            {movie.rating ? <span>IMDb {movie.rating}</span> : null}
          </div>
        </header>

        <div className="movie-details-panel__info">
          <p>
            <strong>Plot:</strong> {movie.plot || 'No plot summary available.'}
          </p>
          <p>
            <strong>Director:</strong> {movie.director || 'Unknown'}
          </p>
          <p>
            <strong>Runtime:</strong> {movie.runtime || 'Unknown'}
          </p>
          <p>
            <strong>IMDb rating:</strong> {movie.rating || 'N/A'}
          </p>
        </div>
      </div>
    </article>
  )
}

export default MovieDetailsPanel
