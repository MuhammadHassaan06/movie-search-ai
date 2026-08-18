import { useCallback, useEffect, useRef, useState } from 'react'
import { searchMovies } from '../services/api/movieApi'
import type { Movie } from '../types/movie'

interface UseMovieSearchResult {
  movies: Movie[]
  loading: boolean
  error: string | null
  retry: () => void
}

function useMovieSearch(query: string): UseMovieSearchResult {
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [retryKey, setRetryKey] = useState(0)
  const requestIdRef = useRef(0)

  const retry = useCallback(() => {
    setRetryKey((current) => current + 1)
  }, [])

  useEffect(() => {
    const trimmedQuery = query.trim()

    if (trimmedQuery === '') {
      return undefined
    }

    let isCancelled = false
    const currentRequestId = ++requestIdRef.current

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true)
     
    setError(null)

    void searchMovies(trimmedQuery)
      .then((results) => {
        if (isCancelled || currentRequestId !== requestIdRef.current) {
          return
        }

        setMovies(results)
      })
      .catch((caughtError: unknown) => {
        if (isCancelled || currentRequestId !== requestIdRef.current) {
          return
        }

        const message =
          caughtError instanceof Error
            ? caughtError.message
            : 'Something went wrong while searching for movies.'

        setError(message)
        setMovies([])
      })
      .finally(() => {
        if (!isCancelled && currentRequestId === requestIdRef.current) {
          setLoading(false)
        }
      })

    return () => {
      isCancelled = true
    }
  }, [query, retryKey])

  return { movies, loading, error, retry }
}

export default useMovieSearch
