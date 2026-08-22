import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import EmptyState from './EmptyState'
import ErrorMessage from './ErrorMessage'
import LoadingState from './LoadingState'

describe('UI states', () => {
  it('renders an empty state message', () => {
    render(<EmptyState title="No results" message="Try another title." />)

    expect(screen.getByRole('heading', { name: 'No results' })).toBeInTheDocument()
    expect(screen.getByText('Try another title.')).toBeInTheDocument()
  })

  it('announces loading status', () => {
    render(<LoadingState message="Searching movies..." />)

    expect(screen.getByRole('status')).toHaveTextContent('Searching movies...')
  })

  it('announces errors and supports retry', async () => {
    const user = userEvent.setup()
    const retry = vi.fn()

    render(<ErrorMessage message="Search failed." onRetry={retry} />)
    expect(screen.getByRole('alert')).toHaveTextContent('Search failed.')

    await user.click(screen.getByRole('button', { name: 'Retry' }))
    expect(retry).toHaveBeenCalledOnce()
  })
})