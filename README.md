# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  # Movie Search App

  ## Overview

  Movie Search App is a React and TypeScript application for searching movies using the OMDb API. It presents search results as movie cards and provides dedicated movie detail pages.

  ## Features

  - Movie search
  - OMDb API integration
  - Search results
  - Movie cards
  - Movie details page
  - Loading states
  - Error states
  - Empty states
  - Responsive UI
  - Accessible forms and navigation
  - React Router navigation

  ## Tech Stack

  - React
  - TypeScript
  - Vite
  - React Router
  - CSS
  - OMDb API
  - ESLint

  ## Project Structure

  - `src/components`: Reusable layout, search, movie, and UI components.
  - `src/pages`: Page-level views for the home, search results, and movie details routes.
  - `src/services`: External service integrations, including the OMDb API client.
  - `src/hooks`: Reusable hooks for movie searching and loading movie details.
  - `src/types`: Shared TypeScript types for movie data.
  - `src/utils`: Shared utility functions.

  ## API Configuration

  The application reads the OMDb API key from the `VITE_OMDB_API_KEY` environment variable.

  Create a local `.env` file in the project root:

  ```env
  VITE_OMDB_API_KEY=your_omdb_api_key
  ```

  Configure the key locally and do not commit the `.env` file or expose the actual API key in source control.

  ## Installation and Running

  Install dependencies:

  ```bash
  npm install
  ```

  After creating `.env` and configuring `VITE_OMDB_API_KEY`, start the development server:

  ```bash
  npm run dev
  ```

  ## Production Build

  ```bash
  npm run build
  ```

  ## Code Quality

  The project was verified using:

  ```bash
  npm run lint
  npm run build
  ```

  ## AI-Assisted Development

  AI coding assistance was used during development for project architecture planning, component scaffolding, API integration assistance, routing implementation, hooks implementation, UI/UX improvements, accessibility review, and code review and cleanup. The generated implementation was reviewed, manually tested, and verified with the lint and build commands.

  ## AI Prompts / Development Workflow

  Development followed a prompt-driven workflow:

  1. Project analysis and architecture planning
  2. API service implementation
  3. Layout and search UI
  4. Routing
  5. Search hook and results
  6. Movie cards/grid
  7. Movie details
  8. UI/UX polish
  9. Final code review
  10. Manual testing

  ## Notes

  An OMDb API key is required for the application to perform movie searches.
