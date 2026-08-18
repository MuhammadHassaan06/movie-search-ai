import { useSearchParams } from 'react-router-dom'
import MovieGrid from '../../components/movies/MovieGrid'
import EmptyState from '../../components/ui/EmptyState'
import ErrorMessage from '../../components/ui/ErrorMessage'
import LoadingState from '../../components/ui/LoadingState'
import useMovieSearch from '../../hooks/useMovieSearch'
import './SearchResultsPage.css'

function SearchResultsPage() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') ?? ''
  const { movies, loading, error, retry } = useMovieSearch(query)

  if (loading) {
    return <LoadingState message={`Searching for “${query}”...`} />
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={retry} />
  }

  if (query.trim() === '') {
    return (
      <EmptyState
        title="Search for a movie"
        message="Use the search bar to find movies by title."
      />
    )
  }

  if (movies.length === 0) {
    return (
      <EmptyState
        title="No movies found"
        message={`No movies matched “${query}”. Try a different title.`}
      />
    )
  }

  return (
    <section className="search-results-page">
      <header className="search-results-page__header">
        <h1 className="search-results-page__title">Search results</h1>
        <p className="search-results-page__summary">Showing results for “{query}”</p>
      </header>
      <MovieGrid movies={movies} />
    </section>
  )
}

export default SearchResultsPage
