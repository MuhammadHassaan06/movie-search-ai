export interface Movie {
  id: string
  title: string
  year: string
  type?: string
  posterUrl: string
}

export interface MovieDetails extends Movie {
  plot: string
  director: string
  runtime: string
  rating: string
}
