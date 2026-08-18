import { Link, useLocation, useParams } from 'react-router-dom'
import MovieDetailsPanel from '../../components/movies/MovieDetailsPanel'
import EmptyState from '../../components/ui/EmptyState'
import ErrorMessage from '../../components/ui/ErrorMessage'
import LoadingState from '../../components/ui/LoadingState'
import useMovieDetails from '../../hooks/useMovieDetails'
import './MovieDetailsPage.css'

function MovieDetailsPage() {
  const { id } = useParams()
  const location = useLocation()
  const movieId = id ?? ''
  const { movie, loading, error, retry } = useMovieDetails(movieId)

  if (!movieId.trim()) {
    return (
      <EmptyState
        title="Movie details unavailable"
        message="No movie ID was provided for this page."
      />
    )
  }

  if (loading) {
    return <LoadingState message="Loading movie details..." />
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={retry} />
  }

  if (!movie) {
    return (
      <EmptyState
        title="Movie not found"
        message="We could not find the selected movie."
      />
    )
  }

  const backToSearch =
    location.state && typeof location.state === 'object' && 'from' in location.state
      ? String((location.state as { from?: string }).from ?? '/search')
      : '/search'

  return (
    <section className="movie-details-page">
      <Link to={backToSearch} className="movie-details-page__back-link">
        ← Back to search results
      </Link>
      <MovieDetailsPanel movie={movie} />
    </section>
  )
}

export default MovieDetailsPage
