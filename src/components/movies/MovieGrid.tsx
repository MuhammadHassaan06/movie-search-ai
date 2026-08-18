import type { Movie } from '../../types/movie'
import MovieCard from './MovieCard'
import './MovieGrid.css'

interface MovieGridProps {
  movies: Movie[]
}

function MovieGrid({ movies }: MovieGridProps) {
  return (
    <div className="movie-grid" aria-live="polite">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  )
}

export default MovieGrid
