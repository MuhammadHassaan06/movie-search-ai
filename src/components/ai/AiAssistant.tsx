import Button from '../ui/Button'
import useAiRecommendation from '../../hooks/useAiRecommendation'
import './AiAssistant.css'

function AiAssistant() {
  const {
    query,
    loading,
    error,
    recommendation,
    setQuery,
    submit,
    reset,
  } = useAiRecommendation()

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    void submit()
  }

  return (
    <section className="ai-assistant" aria-labelledby="ai-assistant-heading">
      <div className="ai-assistant__intro">
        <p className="ai-assistant__eyebrow">Powered by Gemini</p>
        <h2 id="ai-assistant-heading" className="ai-assistant__heading">
          AI Movie Assistant
        </h2>
        <p className="ai-assistant__description">
          Describe the kind of movie you want, and get a thoughtful pick for
          your next watch.
        </p>
      </div>

      <form className="ai-assistant__form" onSubmit={handleSubmit}>
        <label className="ai-assistant__label" htmlFor="ai-movie-query">
          What are you in the mood to watch?
        </label>
        <textarea
          id="ai-movie-query"
          className="ai-assistant__input"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="I want a funny sci-fi movie for the weekend."
          rows={3}
          disabled={loading}
        />
        <div className="ai-assistant__actions">
          <Button type="submit" disabled={loading || query.trim() === ''}>
            {loading ? 'Getting recommendation...' : 'Ask AI'}
          </Button>
          {recommendation && (
            <Button type="button" variant="secondary" onClick={reset} disabled={loading}>
              Clear
            </Button>
          )}
        </div>
      </form>

      <div className="ai-assistant__status" aria-live="polite" aria-atomic="true">
        {loading && <p role="status">Getting recommendation...</p>}
      </div>

      {error && (
        <p className="ai-assistant__error" role="alert">
          Sorry, we could not get a recommendation right now. Please try again.
        </p>
      )}

      {recommendation ? (
        <article className="ai-assistant__result" aria-labelledby="ai-result-heading">
          <p className="ai-assistant__result-label">Your recommendation</p>
          <h3 id="ai-result-heading" className="ai-assistant__result-title">
            {recommendation.recommendation}
          </h3>
          <div className="ai-assistant__result-section">
            <h4>Why it matches</h4>
            <p>{recommendation.reason}</p>
          </div>
          <div className="ai-assistant__result-section">
            <h4>Genres</h4>
            <ul className="ai-assistant__tags" aria-label="Genres">
              {recommendation.genres.map((genre) => (
                <li key={genre}>{genre}</li>
              ))}
            </ul>
          </div>
          <div className="ai-assistant__result-section">
            <h4>You might also like</h4>
            <ul className="ai-assistant__alternatives">
              {recommendation.alternatives.map((alternative) => (
                <li key={alternative}>{alternative}</li>
              ))}
            </ul>
          </div>
        </article>
      ) : (
        <div className="ai-assistant__guidance">
          <h3>Not sure what to watch?</h3>
          <p>Try a mood, genre, era, or a few movies you already love.</p>
        </div>
      )}
    </section>
  )
}

export default AiAssistant