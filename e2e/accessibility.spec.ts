import { expect, type Page, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

async function expectNoSeriousAccessibilityViolations(page: Page) {
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .analyze()

  expect(results.violations).toEqual([])
}

test('home page has no serious WCAG 2.1 AA violations', async ({ page }) => {
  await page.goto('/')

  await expectNoSeriousAccessibilityViolations(page)
})

test('AI recommendation result has no serious WCAG 2.1 AA violations', async ({ page }) => {
  await page.route('**/api/ai/recommend', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        recommendation: 'Galaxy Quest',
        reason: 'It combines science fiction with light comedy and an easygoing adventure.',
        genres: ['Science Fiction', 'Comedy'],
        alternatives: ['Men in Black', "The Hitchhiker's Guide to the Galaxy"],
      }),
    })
  })

  await page.goto('/')
  await page.getByLabel('What are you in the mood to watch?').fill('A funny science fiction movie')
  await page.getByRole('button', { name: 'Ask AI' }).click()
  await expect(page.getByRole('heading', { name: 'Galaxy Quest' })).toBeVisible()

  await expectNoSeriousAccessibilityViolations(page)
})

test('movie search results have no serious WCAG 2.1 AA violations', async ({ page }) => {
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
  await page.getByRole('searchbox', { name: 'Search for a movie on home page' }).press('Enter')
  await expect(page.getByRole('link', { name: 'View details for Inception' })).toBeVisible()

  await expectNoSeriousAccessibilityViolations(page)
})