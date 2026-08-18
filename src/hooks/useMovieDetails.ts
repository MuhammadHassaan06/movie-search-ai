import { useCallback, useEffect, useRef, useState } from 'react'
import { getMovieById } from '../services/api/movieApi'
import type { MovieDetails } from '../types/movie'

interface UseMovieDetailsResult {
  movie: MovieDetails | null
  loading: boolean
  error: string | null
  retry: () => void
}

function useMovieDetails(movieId: string): UseMovieDetailsResult {
  const [movie, setMovie] = useState<MovieDetails | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [retryKey, setRetryKey] = useState(0)
  const requestIdRef = useRef(0)

  const retry = useCallback(() => {
    setRetryKey((current) => current + 1)
  }, [])

  useEffect(() => {
    const trimmedId = movieId.trim()

    if (trimmedId === '') {
      return undefined
    }

    let isCancelled = false
    const currentRequestId = ++requestIdRef.current

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true)
     
    setError(null)

    void getMovieById(trimmedId)
      .then((movieDetails) => {
        if (isCancelled || currentRequestId !== requestIdRef.current) {
          return
        }

        setMovie(movieDetails)
      })
      .catch((caughtError: unknown) => {
        if (isCancelled || currentRequestId !== requestIdRef.current) {
          return
        }

        const message =
          caughtError instanceof Error
            ? caughtError.message
            : 'Something went wrong while loading the movie details.'

        setError(message)
        setMovie(null)
      })
      .finally(() => {
        if (!isCancelled && currentRequestId === requestIdRef.current) {
          setLoading(false)
        }
      })

    return () => {
      isCancelled = true
    }
  }, [movieId, retryKey])

  return { movie, loading, error, retry }
}

export default useMovieDetails
