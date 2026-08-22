import { test, expect } from '@playwright/test'

const recommendation = {
  recommendation: 'Galaxy Quest',
  reason: 'It combines science fiction with light comedy and an easygoing adventure.',
  genres: ['Science Fiction', 'Comedy'],
  alternatives: ['Men in Black', "The Hitchhiker's Guide to the Galaxy"],
}

test('gets a mocked AI movie recommendation', async ({ page }) => {
  await page.route('**/api/ai/recommend', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(recommendation),
    })
  })

  await page.goto('/')
  await page.getByLabel('What are you in the mood to watch?').fill('A funny sci-fi movie for the weekend')
  await page.getByRole('button', { name: 'Ask AI' }).click()

  await expect(page.getByRole('heading', { name: 'Galaxy Quest' })).toBeVisible()
  await expect(page.getByText(recommendation.reason)).toBeVisible()
  await expect(page.getByText('Science Fiction', { exact: true })).toBeVisible()
  await expect(page.getByText('Comedy', { exact: true })).toBeVisible()
  await expect(page.getByText('Men in Black')).toBeVisible()
  await expect(page.getByText("The Hitchhiker's Guide to the Galaxy")).toBeVisible()
})

test('shows a friendly message when the AI service fails', async ({ page }) => {
  await page.route('**/api/ai/recommend', async (route) => {
    await route.fulfill({
      status: 502,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'Sensitive upstream failure details' }),
    })
  })

  await page.goto('/')
  await page.getByLabel('What are you in the mood to watch?').fill('A quiet mystery')
  await page.getByRole('button', { name: 'Ask AI' }).click()

  await expect(page.getByRole('alert')).toHaveText(
    'Sorry, we could not get a recommendation right now. Please try again.',
  )
  await expect(page.getByText('Sensitive upstream failure details')).toHaveCount(0)
  await expect(page.getByText('Error:')).toHaveCount(0)
})