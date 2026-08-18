import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../ui/Button'
import './SearchBar.css'

interface SearchBarProps {
  onSubmit?: (query: string) => void
  id?: string
  label?: string
  placeholder?: string
}

function SearchBar({
  onSubmit,
  id = 'movie-search',
  label = 'Search for a movie',
  placeholder = 'Enter a movie title...',
}: SearchBarProps) {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const trimmedQuery = query.trim()

    if (trimmedQuery === '') {
      return
    }

    const encodedQuery = encodeURIComponent(trimmedQuery)
    navigate(`/search?q=${encodedQuery}`)
    onSubmit?.(trimmedQuery)
  }

  return (
    <form className="search-bar" onSubmit={handleSubmit} role="search">
      <label className="search-bar__label" htmlFor={id}>
        {label}
      </label>
      <div className="search-bar__controls">
        <input
          id={id}
          className="search-bar__input"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={placeholder}
          autoComplete="off"
        />
        <Button type="submit" className="search-bar__button" disabled={query.trim() === ''}>
          Search
        </Button>
      </div>
    </form>
  )
}

export default SearchBar
