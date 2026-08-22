import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import MovieCard from './MovieCard'
import MovieGrid from './MovieGrid'
import MoviePoster from './MoviePoster'
import type { Movie } from '../../types/movie'

const movie: Movie = {
  id: 'tt0133093',
  title: 'The Matrix',
  year: '1999',
  type: 'movie',
  posterUrl: 'https://example.com/matrix.jpg',
}

describe('MoviePoster', () => {
  it('renders a poster with a descriptive alt text', () => {
    render(<MoviePoster posterUrl={movie.posterUrl} title={movie.title} />)

    expect(screen.getByRole('img', { name: 'The Matrix movie poster' })).toHaveAttribute(
      'src',
      movie.posterUrl,
    )
  })

  it('shows an accessible placeholder when the poster fails', () => {
    render(<MoviePoster posterUrl={movie.posterUrl} title={movie.title} />)
    fireEvent.error(screen.getByRole('img', { name: 'The Matrix movie poster' }))

    expect(screen.getByRole('img', { name: 'The Matrix poster unavailable' })).toHaveTextContent(
      'No poster available',
    )
  })
})

describe('MovieCard and MovieGrid', () => {
  it('renders movie details and links to the movie page', () => {
    render(
      <MemoryRouter>
        <MovieCard movie={movie} />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: 'The Matrix' })).toBeInTheDocument()
    expect(screen.getByText('1999')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'View details for The Matrix' })).toHaveAttribute(
      'href',
      '/movies/tt0133093',
    )
  })

  it('renders every movie in the grid', () => {
    const secondMovie = { ...movie, id: 'tt0068646', title: 'The Godfather' }
    render(
      <MemoryRouter>
        <MovieGrid movies={[movie, secondMovie]} />
      </MemoryRouter>,
    )

    expect(screen.getByRole('link', { name: 'View details for The Matrix' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'View details for The Godfather' })).toBeInTheDocument()
  })
})