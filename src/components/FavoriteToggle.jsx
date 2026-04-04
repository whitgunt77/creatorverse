import SocialIcon from './SocialIcon';

function FavoriteToggle({ active = false, busy = false, compact = false, onToggle }) {
  return (
    <button
      type="button"
      className={`favorite-toggle${active ? ' is-active' : ''}${compact ? ' favorite-toggle--compact' : ''}`}
      onClick={onToggle}
      aria-pressed={active}
      aria-label={active ? 'Remove from favorites' : 'Add to favorites'}
      disabled={busy}
    >
      <span className="favorite-toggle__icon" aria-hidden="true">
        <SocialIcon type={active ? 'star-fill' : 'star'} />
      </span>

      {!compact && <span className='favorite-toggle__label'>{active ? 'Favorited' : 'Favorite'}</span>}
    </button>
  );
}

export default FavoriteToggle;
