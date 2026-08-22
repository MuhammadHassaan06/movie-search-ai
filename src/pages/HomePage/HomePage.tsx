import SearchBar from '../../components/search/SearchBar'
import EmptyState from '../../components/ui/EmptyState'
import AiAssistant from '../../components/ai/AiAssistant'
import './HomePage.css'

function HomePage() {
  return (
    <div className="home-page">
      <section className="home-page__hero" aria-labelledby="home-heading">
        <h1 id="home-heading" className="home-page__heading">
          Discover your next movie
        </h1>
        <p className="home-page__description">
          Search by title to explore films, compare options, and find something
          worth watching tonight.
        </p>
        <div className="home-page__search">
          <SearchBar
            id="home-movie-search"
            label="Search for a movie on home page"
          />
        </div>
      </section>

      <AiAssistant />

      <EmptyState
        title="Start with a search"
        message="Enter a movie title above to begin exploring results."
      />
    </div>
  )
}

export default HomePage
