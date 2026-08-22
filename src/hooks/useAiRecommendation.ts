import { useCallback, useState } from 'react'
import { getAiRecommendation } from '../services/api/aiApi'
import type { AiRecommendation } from '../types/ai'

interface UseAiRecommendationResult {
  query: string
  loading: boolean
  error: string | null
  recommendation: AiRecommendation | null
  setQuery: (query: string) => void
  submit: () => Promise<void>
  reset: () => void
}

function useAiRecommendation(): UseAiRecommendationResult {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [recommendation, setRecommendation] = useState<AiRecommendation | null>(null)

  const submit = useCallback(async () => {
    const trimmedQuery = query.trim()

    if (loading || trimmedQuery === '') {
      return
    }

    setLoading(true)
    setError(null)

    try {
      const result = await getAiRecommendation(trimmedQuery)
      setRecommendation(result)
    } catch (caughtError: unknown) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : 'Sorry, we could not get a recommendation right now. Please try again.',
      )
    } finally {
      setLoading(false)
    }
  }, [loading, query])

  const reset = useCallback(() => {
    setQuery('')
    setError(null)
    setRecommendation(null)
  }, [])

  return { query, loading, error, recommendation, setQuery, submit, reset }
}

export default useAiRecommendation