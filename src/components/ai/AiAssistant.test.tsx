import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import AiAssistant from './AiAssistant'
import { getAiRecommendation } from '../../services/api/aiApi'

vi.mock('../../services/api/aiApi', () => ({
  getAiRecommendation: vi.fn(),
}))

const getAiRecommendationMock = vi.mocked(getAiRecommendation)
const recommendation = {
  recommendation: 'Interstellar',
  reason: 'It combines wonder, humor, and a moving family story.',
  genres: ['Science Fiction', 'Drama'],
  alternatives: ['Arrival', 'The Martian'],
}

describe('AiAssistant', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders accessible controls and initial guidance', () => {
    render(<AiAssistant />)

    expect(screen.getByRole('heading', { name: 'AI Movie Assistant' })).toBeInTheDocument()
    expect(screen.getByLabelText('What are you in the mood to watch?')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Ask AI' })).toBeDisabled()
    expect(screen.getByRole('heading', { name: 'Not sure what to watch?' })).toBeInTheDocument()
  })

  it('submits preferences and displays the structured recommendation', async () => {
    const user = userEvent.setup()
    getAiRecommendationMock.mockResolvedValue(recommendation)
    render(<AiAssistant />)

    await user.type(
      screen.getByLabelText('What are you in the mood to watch?'),
      '  funny sci-fi for the weekend  ',
    )
    await user.click(screen.getByRole('button', { name: 'Ask AI' }))

    expect(getAiRecommendationMock).toHaveBeenCalledWith('funny sci-fi for the weekend')
    expect(await screen.findByRole('heading', { name: 'Interstellar' })).toBeInTheDocument()
    expect(screen.getByText(recommendation.reason)).toBeInTheDocument()
    expect(screen.getByText('Science Fiction')).toBeInTheDocument()
    expect(screen.getByText('Drama')).toBeInTheDocument()
    expect(screen.getByText('Arrival')).toBeInTheDocument()
    expect(screen.getByText('The Martian')).toBeInTheDocument()
  })

  it('shows loading state and prevents duplicate submissions', async () => {
    const user = userEvent.setup()
    let resolveRequest: ((value: typeof recommendation) => void) | undefined
    getAiRecommendationMock.mockImplementation(
      () => new Promise((resolve) => { resolveRequest = resolve }),
    )
    render(<AiAssistant />)

    await user.type(screen.getByLabelText('What are you in the mood to watch?'), 'a mystery')
    const button = screen.getByRole('button', { name: 'Ask AI' })
    await user.click(button)
    expect(screen.getByRole('status')).toHaveTextContent('Getting recommendation...')
    expect(button).toBeDisabled()
    expect(getAiRecommendationMock).toHaveBeenCalledOnce()

    resolveRequest?.(recommendation)
    expect(await screen.findByRole('heading', { name: 'Interstellar' })).toBeInTheDocument()
  })

  it('shows a friendly error and does not submit empty input', async () => {
    const user = userEvent.setup()
    getAiRecommendationMock.mockRejectedValue(new Error('raw backend failure'))
    render(<AiAssistant />)

    const input = screen.getByLabelText('What are you in the mood to watch?')
    await user.type(input, '   ')
    expect(screen.getByRole('button', { name: 'Ask AI' })).toBeDisabled()
    expect(getAiRecommendationMock).not.toHaveBeenCalled()

    await user.clear(input)
    await user.type(input, 'a cozy mystery')
    await user.click(screen.getByRole('button', { name: 'Ask AI' }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Sorry, we could not get a recommendation right now. Please try again.',
    )
    expect(screen.queryByText('raw backend failure')).not.toBeInTheDocument()
  })
})