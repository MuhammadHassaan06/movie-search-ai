import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import Button from './Button'

describe('Button', () => {
  it('renders children and handles clicks', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()

    render(<Button onClick={handleClick}>Save</Button>)
    await user.click(screen.getByRole('button', { name: 'Save' }))

    expect(handleClick).toHaveBeenCalledOnce()
  })

  it('does not allow clicks while disabled', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()

    render(<Button disabled onClick={handleClick}>Save</Button>)
    const button = screen.getByRole('button', { name: 'Save' })
    await user.click(button)

    expect(button).toBeDisabled()
    expect(handleClick).not.toHaveBeenCalled()
  })
})