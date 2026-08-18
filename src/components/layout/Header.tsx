import SearchBar from '../search/SearchBar'
import './Header.css'

function Header() {
  return (
    <header className="header">
      <div className="header__inner">
        <a className="header__brand" href="/">
          Movie Search
        </a>
        <div className="header__search">
          <SearchBar
            id="header-movie-search"
            label="Search for a movie in header"
          />
        </div>
      </div>
    </header>
  )
}

export default Header
