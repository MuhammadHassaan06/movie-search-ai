import type {
  AiRecommendation,
  AiRecommendationRequest,
} from '../../types/ai'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string')
}

function isAiRecommendation(value: unknown): value is AiRecommendation {
  if (!isRecord(value)) {
    return false
  }

  return (
    typeof value.recommendation === 'string' &&
    value.recommendation.trim() !== '' &&
    typeof value.reason === 'string' &&
    value.reason.trim() !== '' &&
    isStringArray(value.genres) &&
    isStringArray(value.alternatives)
  )
}

function getErrorMessage(value: unknown): string | null {
  if (!isRecord(value) || typeof value.error !== 'string') {
    return null
  }

  return value.error.trim() || null
}

export async function getAiRecommendation(
  query: string,
): Promise<AiRecommendation> {
  const requestBody: AiRecommendationRequest = { query }
  let response: Response

  try {
    response = await fetch('/api/ai/recommend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    })
  } catch (error) {
    throw new Error(
      'Network error. Please check your connection and try again.',
      { cause: error },
    )
  }

  let data: unknown
  try {
    data = await response.json()
  } catch (error) {
    throw new Error('The recommendation service returned an invalid response.', {
      cause: error,
    })
  }

  if (!response.ok) {
    throw new Error(
      getErrorMessage(data) ?? 'The recommendation service is unavailable.',
    )
  }

  if (!isAiRecommendation(data)) {
    throw new Error('The recommendation service returned an invalid response.')
  }

  return data
}