export type AiRecommendation = {
  recommendation: string
  reason: string
  genres: string[]
  alternatives: string[]
}

export type AiRecommendationRequest = {
  query: string
}