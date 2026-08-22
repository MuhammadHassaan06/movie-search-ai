import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, useLocation } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import SearchBar from './SearchBar'

function LocationDisplay() {
  const location = useLocation()
  return <output>{location.pathname}{location.search}</output>
}

describe('SearchBar', () => {
  it('accepts a title and navigates with the trimmed query', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    render(
      <MemoryRouter>
        <SearchBar onSubmit={onSubmit} />
        <LocationDisplay />
      </MemoryRouter>,
    )

    const input = screen.getByRole('searchbox', { name: 'Search for a movie' })
    await user.type(input, '  The Matrix  ')
    await user.click(screen.getByRole('button', { name: 'Search' }))

    expect(onSubmit).toHaveBeenCalledWith('The Matrix')
    expect(screen.getByRole('status')).toHaveTextContent('/search?q=The%20Matrix')
  })

  it('keeps search disabled for empty or whitespace input', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    render(
      <MemoryRouter>
        <SearchBar onSubmit={onSubmit} />
      </MemoryRouter>,
    )

    const input = screen.getByRole('searchbox', { name: 'Search for a movie' })
    const button = screen.getByRole('button', { name: 'Search' })
    expect(button).toBeDisabled()

    await user.type(input, '   ')
    expect(button).toBeDisabled()
    expect(onSubmit).not.toHaveBeenCalled()
  })
})