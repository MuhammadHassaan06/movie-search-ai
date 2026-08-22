# Production Deployment and Operations

## Production Overview

- **Production URL:** https://movie-search-ai.vercel.app/
- **Hosting provider:** Vercel
- **Frontend:** Vite and React static production build
- **Server-side function:** `POST /api/ai/recommend`
- **AI provider:** Gemini through the server-side Vercel function

The application provides movie search through OMDb, movie detail pages, and an AI Movie Assistant for preference-based recommendations.

## Required Environment Variables

Configure these variables in the Vercel project environment. Never include actual secret values in this document or in source control.

- `VITE_OMDB_API_KEY`
  - Used by the existing client-side OMDb integration.
- `GEMINI_API_KEY`
  - Used only by the server-side `/api/ai/recommend` function.
  - Must remain server-side and must never use a `VITE_` prefix.

## Pre-deployment Checklist

- [ ] Review the working tree for unintended changes.
- [ ] Configure `VITE_OMDB_API_KEY` and `GEMINI_API_KEY` in the deployment environment.
- [ ] Run unit and component tests successfully.
- [ ] Run Playwright E2E tests successfully.
- [ ] Run accessibility checks successfully.
- [ ] Verify the production build successfully.
- [ ] Verify lint passes.
- [ ] Review Lighthouse results.
- [ ] Confirm no secrets are committed.
- [ ] Confirm `.env` remains ignored.
- [ ] Confirm the SPA rewrite configuration is present in `vercel.json`.

## Deployment Procedure

This project uses an intentional CLI production deployment workflow. GitHub automatic deployment is not assumed or required.

1. Install dependencies with `npm install` when needed.
2. Run the production build:

   ```bash
   npm run build
   ```

3. Run lint:

   ```bash
   npm run lint
   ```

4. Run unit and component tests:

   ```bash
   npm run test
   ```

5. Run browser E2E tests:

   ```bash
   npm run test:e2e
   ```

6. Deploy the verified build to Vercel:

   ```bash
   npx vercel --prod
   ```

Ensure the Vercel project has both required environment variables configured before deployment.

## Post-deployment Smoke Tests

After deployment, verify:

- The homepage loads at the production URL.
- Movie search returns results for a known movie title.
- Selecting a result opens the movie details page.
- Direct navigation and browser refresh work for React Router routes such as `/search?q=inception` and a movie details route.
- The AI Movie Assistant returns a recommendation for a valid request.
- `POST /api/ai/recommend` returns HTTP 200 for a valid JSON request containing a non-empty `query` string.
- Invalid API requests fail safely with the expected status and a JSON error response.

## Safe Failure Behavior

The server-side recommendation endpoint handles invalid requests and upstream failures without exposing secrets:

- Non-POST method: HTTP `405`.
- Unsupported or missing JSON Content-Type: HTTP `415`.
- Missing, non-string, or empty query: HTTP `400`.
- Query longer than the configured limit: HTTP `413`.
- Missing server configuration, including `GEMINI_API_KEY`: safe HTTP `500` response.
- Malformed Gemini output or upstream AI failure: safe HTTP `502` response.

The frontend displays a generic friendly AI failure message instead of raw server details. API keys, stack traces, and raw Gemini errors are not intentionally exposed in user-facing responses.

## Monitoring

Current monitoring consists of:

- Vercel deployment status and deployment logs.
- Vercel function logs for serverless endpoint failures.
- Browser-based reproduction and inspection for client-side UI failures.
- Automated unit, accessibility, and E2E tests before release.

A dedicated third-party error-monitoring service is not currently integrated. Adding production error monitoring and alerting is a future improvement.

## Rollback Plan

1. Identify the last known-good production deployment in Vercel deployment history.
2. Promote or redeploy that known-good deployment through Vercel.
3. Verify the homepage, movie search, movie details, route refreshes, and AI endpoint.
4. If the issue is in source control, revert the problematic Git commit and deploy the corrected version through the normal CLI workflow.

Do not invent deployment IDs or assume a project-specific rollback command; use the deployment history associated with the Vercel project.

## Known Operational Risks

- Gemini availability, rate limits, or quota can temporarily affect recommendations.
- OMDb availability or rate limits can affect movie search and details.
- External API behavior and service incidents are outside this application's direct control.
- No dedicated third-party error-monitoring service is currently integrated.
- Client-side OMDb usage requires the configured `VITE_OMDB_API_KEY` and therefore depends on correct deployment configuration.

## Sign-off

- [x] Production build verified.
- [x] Unit and component tests verified.
- [x] Accessibility checks verified.
- [x] Lighthouse results verified.
- [x] Production smoke test verified.
- [x] Environment and secrets reviewed.
- [x] Rollback procedure documented.

**Status: Ready for capstone review**
