import { Link } from 'react-router-dom';

function EmptyState({ title, body, actionLabel = 'Add Creator' }) {
  return (
    <article className="empty-state">
      <p className="section-kicker">Fresh start</p>
      <h2>{title}</h2>
      <p>{body}</p>
      <Link to="/new" role="button">
        {actionLabel}
      </Link>
    </article>
  );
}

export default EmptyState;
