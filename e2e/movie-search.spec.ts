import { test, expect } from '@playwright/test'

test('searches for a movie and shows the mocked result', async ({ page }) => {
  await page.route('https://www.omdbapi.com/**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        Response: 'True',
        Search: [
          {
            Title: 'Inception',
            Year: '2010',
            imdbID: 'tt1375666',
            Type: 'movie',
            Poster: 'N/A',
          },
        ],
        totalResults: '1',
      }),
    })
  })

  await page.goto('/')
  await page.getByRole('searchbox', { name: 'Search for a movie on home page' }).fill('Inception')
  await page
    .getByRole('searchbox', { name: 'Search for a movie on home page' })
    .press('Enter')

  await expect(page).toHaveURL(/\/search\?q=Inception$/)
  await expect(page.getByRole('heading', { name: 'Search results' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'View details for Inception' })).toBeVisible()
  await expect(page.getByText('2010')).toBeVisible()
})