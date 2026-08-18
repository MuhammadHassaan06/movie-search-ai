import { Link } from 'react-router-dom'
import type { Movie } from '../../types/movie'
import MoviePoster from './MoviePoster'
import './MovieCard.css'

interface MovieCardProps {
  movie: Movie
}

function MovieCard({ movie }: MovieCardProps) {
  return (
    <Link to={`/movies/${movie.id}`} className="movie-card" aria-label={`View details for ${movie.title}`}>
      <MoviePoster posterUrl={movie.posterUrl} title={movie.title} />
      <div className="movie-card__content">
        <h3 className="movie-card__title">{movie.title}</h3>
        <div className="movie-card__meta">
          <span>{movie.year}</span>
          {movie.type ? <span>{movie.type}</span> : null}
        </div>
      </div>
    </Link>
  )
}

export default MovieCard
