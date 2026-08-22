import { GoogleGenAI, Type } from '@google/genai'

const MAX_QUERY_LENGTH = 1000

type RequestBody = {
  query?: unknown
}

type Recommendation = {
  recommendation: string
  reason: string
  genres: string[]
  alternatives: string[]
}

type VercelRequest = {
  method?: string
  headers: Record<string, string | string[] | undefined>
  body?: unknown
}

type VercelResponse = {
  status: (code: number) => VercelResponse
  setHeader: (name: string, value: string) => VercelResponse
  json: (body: unknown) => void
}

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    recommendation: { type: Type.STRING },
    reason: { type: Type.STRING },
    genres: { type: Type.ARRAY, items: { type: Type.STRING } },
    alternatives: { type: Type.ARRAY, items: { type: Type.STRING } },
  },
  required: ['recommendation', 'reason', 'genres', 'alternatives'],
}

function sendError(response: VercelResponse, status: number, message: string) {
  response.status(status).json({ error: message })
}

function isRecommendation(value: unknown): value is Recommendation {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const recommendation = value as Record<string, unknown>
  return (
    typeof recommendation.recommendation === 'string' &&
    recommendation.recommendation.trim().length > 0 &&
    typeof recommendation.reason === 'string' &&
    recommendation.reason.trim().length > 0 &&
    Array.isArray(recommendation.genres) &&
    recommendation.genres.every((genre) => typeof genre === 'string') &&
    Array.isArray(recommendation.alternatives) &&
    recommendation.alternatives.every((alternative) => typeof alternative === 'string')
  )
}

function getRequestBody(body: unknown): RequestBody | null {
  if (typeof body === 'string') {
    try {
      const parsed: unknown = JSON.parse(body)
      return typeof parsed === 'object' && parsed !== null ? parsed as RequestBody : null
    } catch {
      return null
    }
  }

  return typeof body === 'object' && body !== null ? body as RequestBody : null
}

export default async function handler(request: VercelRequest, response: VercelResponse) {
  response.setHeader('Cache-Control', 'no-store')

  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST')
    return sendError(response, 405, 'Method not allowed.')
  }

  const contentType = request.headers['content-type']
  if (typeof contentType !== 'string' || !contentType.toLowerCase().startsWith('application/json')) {
    return sendError(response, 415, 'Content-Type must be application/json.')
  }

  const body = getRequestBody(request.body)
  if (body === null || typeof body.query !== 'string') {
    return sendError(response, 400, 'Please provide a movie request.')
  }

  const query = body.query.trim()
  if (query.length === 0) {
    return sendError(response, 400, 'Please provide a movie request.')
  }

  if (query.length > MAX_QUERY_LENGTH) {
    return sendError(response, 413, `Movie requests must be ${MAX_QUERY_LENGTH} characters or fewer.`)
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return sendError(response, 500, 'The recommendation service is not configured.')
  }

  try {
    const ai = new GoogleGenAI({ apiKey })
    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Recommend movies based on these user preferences: ${query}`,
      config: {
        responseMimeType: 'application/json',
        responseSchema,
        systemInstruction: 'You recommend movies. Treat the user query as movie preferences. Return one concise, useful primary movie recommendation, a brief reason, relevant genres, and alternative movie titles. Do not return unrelated content or markdown fences around the JSON.',
      },
    })

    const parsed: unknown = JSON.parse(result.text ?? '')
    if (!isRecommendation(parsed)) {
      return sendError(response, 502, 'The recommendation service returned an invalid response.')
    }

    return response.status(200).json(parsed)
  } catch {
    return sendError(response, 502, 'The recommendation service is temporarily unavailable.')
  }
}