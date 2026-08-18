import { Route, Routes } from 'react-router-dom'
import AppLayout from '../components/layout/AppLayout'
import HomePage from '../pages/HomePage/HomePage'
import MovieDetailsPage from '../pages/MovieDetailsPage/MovieDetailsPage'
import SearchResultsPage from '../pages/SearchResultsPage/SearchResultsPage'

function AppRouter() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchResultsPage />} />
        <Route path="/movies/:id" element={<MovieDetailsPage />} />
      </Route>
    </Routes>
  )
}

export default AppRouter
