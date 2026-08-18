import './EmptyState.css'

interface ErrorMessageProps {
  message: string
  retryLabel?: string
  onRetry?: () => void
}

function ErrorMessage({ message, retryLabel = 'Retry', onRetry }: ErrorMessageProps) {
  return (
    <section className="empty-state error-message" role="alert" aria-live="assertive">
      <h2 className="empty-state__title">Something went wrong</h2>
      <p className="empty-state__message">{message}</p>
      {onRetry ? (
        <button type="button" className="error-message__action" onClick={onRetry}>
          {retryLabel}
        </button>
      ) : null}
    </section>
  )
}

export default ErrorMessage
