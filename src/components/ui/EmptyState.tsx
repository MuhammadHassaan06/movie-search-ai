import './EmptyState.css'

interface EmptyStateProps {
  title: string
  message: string
}

function EmptyState({ title, message }: EmptyStateProps) {
  return (
    <section className="empty-state" aria-labelledby="empty-state-title">
      <h2 id="empty-state-title" className="empty-state__title">
        {title}
      </h2>
      <p className="empty-state__message">{message}</p>
    </section>
  )
}

export default EmptyState
