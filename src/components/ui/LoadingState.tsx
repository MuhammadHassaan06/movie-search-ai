import './EmptyState.css'

interface LoadingStateProps {
  message?: string
}

function LoadingState({ message = 'Loading...' }: LoadingStateProps) {
  return (
    <section className="empty-state loading-state" role="status" aria-live="polite">
      <h2 className="empty-state__title">Loading</h2>
      <p className="empty-state__message">{message}</p>
    </section>
  )
}

export default LoadingState
