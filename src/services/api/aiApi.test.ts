import { afterEach, describe, expect, it, vi } from 'vitest'
import { getAiRecommendation } from './aiApi'

const recommendation = {
  recommendation: 'Interstellar',
  reason: 'A thoughtful science-fiction adventure with emotional depth.',
  genres: ['Science Fiction', 'Drama'],
  alternatives: ['Arrival', 'The Martian'],
}

describe('getAiRecommendation', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('posts the query and returns a valid recommendation', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch')
      .mockResolvedValue(new Response(JSON.stringify(recommendation), { status: 200 }))

    await expect(getAiRecommendation('funny sci-fi')).resolves.toEqual(recommendation)
    expect(fetchMock).toHaveBeenCalledWith('/api/ai/recommend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: 'funny sci-fi' }),
    })
  })

  it('surfaces a safe server error for non-OK responses', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ error: 'Please provide a movie request.' }), { status: 400 }),
    )

    await expect(getAiRecommendation('')).rejects.toThrow('Please provide a movie request.')
  })

  it('rejects malformed successful responses', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ recommendation: 'Interstellar' }), { status: 200 }),
    )

    await expect(getAiRecommendation('science fiction')).rejects.toThrow(
      'The recommendation service returned an invalid response.',
    )
  })

  it('converts network failures into a useful error', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('offline'))

    await expect(getAiRecommendation('comedy')).rejects.toThrow(
      'Network error. Please check your connection and try again.',
    )
  })
})