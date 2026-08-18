import type { Movie, MovieDetails } from '../../types/movie'

const OMDB_BASE_URL = 'https://www.omdbapi.com/'

interface OmdbSearchResponse {
  Response: 'True' | 'False'
  Search?: OmdbSearchResult[]
  totalResults?: string
  Error?: string
}

interface OmdbSearchResult {
  Title: string
  Year: string
  imdbID: string
  Type: string
  Poster: string
}

interface OmdbMovieResponse {
  Response: 'True' | 'False'
  Title?: string
  Year?: string
  imdbID?: string
  Poster?: string
  Plot?: string
  Director?: string
  Runtime?: string
  imdbRating?: string
  Error?: string
}

export class MovieApiError extends Error {
  readonly originalCause?: unknown

  constructor(message: string, originalCause?: unknown) {
    super(message)
    this.name = 'MovieApiError'
    this.originalCause = originalCause
  }
}

function getApiKey(): string {
  const apiKey = import.meta.env.VITE_OMDB_API_KEY

  if (typeof apiKey !== 'string' || apiKey.trim() === '') {
    throw new MovieApiError('OMDb API key is not configured.')
  }

  return apiKey.trim()
}

function buildUrl(params: Record<string, string>): string {
  const url = new URL(OMDB_BASE_URL)

  url.searchParams.set('apikey', getApiKey())

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value)
  }

  return url.toString()
}

async function fetchOmdb<T>(url: string): Promise<T> {
  let response: Response

  try {
    response = await fetch(url)
  } catch (error) {
    throw new MovieApiError(
      'Network error. Please check your connection and try again.',
      error,
    )
  }

  if (!response.ok) {
    throw new MovieApiError(`Request failed with status ${response.status}.`)
  }

  try {
    return (await response.json()) as T
  } catch (error) {
    throw new MovieApiError('Invalid response from OMDb API.', error)
  }
}

function mapValue(value: string | undefined): string {
  if (!value || value === 'N/A') {
    return ''
  }

  return value
}

function mapPoster(poster: string | undefined): string {
  return mapValue(poster)
}

function mapSearchResult(result: OmdbSearchResult): Movie {
  return {
    id: result.imdbID,
    title: result.Title,
    year: result.Year,
    type: mapValue(result.Type),
    posterUrl: mapPoster(result.Poster),
  }
}

function mapMovieDetails(data: OmdbMovieResponse): MovieDetails {
  return {
    id: data.imdbID ?? '',
    title: data.Title ?? '',
    year: data.Year ?? '',
    posterUrl: mapPoster(data.Poster),
    plot: mapValue(data.Plot),
    director: mapValue(data.Director),
    runtime: mapValue(data.Runtime),
    rating: mapValue(data.imdbRating),
  }
}

function assertOmdbSuccess(
  response: { Response: 'True' | 'False'; Error?: string },
  fallbackMessage: string,
): void {
  if (response.Response === 'False') {
    throw new MovieApiError(response.Error ?? fallbackMessage)
  }
}

export async function searchMovies(query: string): Promise<Movie[]> {
  const trimmedQuery = query.trim()

  if (trimmedQuery === '') {
    return []
  }

  const url = buildUrl({
    s: trimmedQuery,
    type: 'movie',
  })

  const data = await fetchOmdb<OmdbSearchResponse>(url)

  assertOmdbSuccess(data, 'No movies found.')

  return (data.Search ?? []).map(mapSearchResult)
}

export async function getMovieById(id: string): Promise<MovieDetails> {
  const trimmedId = id.trim()

  if (trimmedId === '') {
    throw new MovieApiError('Movie ID is required.')
  }

  const url = buildUrl({
    i: trimmedId,
    plot: 'full',
  })

  const data = await fetchOmdb<OmdbMovieResponse>(url)

  assertOmdbSuccess(data, 'Movie not found.')

  return mapMovieDetails(data)
}
