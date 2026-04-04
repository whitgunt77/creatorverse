import { Link } from 'react-router-dom';
import { parseTags } from '../creatorTags';
import FavoriteToggle from './FavoriteToggle';
import SocialIcon from './SocialIcon';
import { pickSocialLinks } from '../socialLinks';

function Card({ creator, onToggleFavorite, favoriteBusy = false }) {
  const { id, name, url, description, imageURL, category, tags, favorite } = creator;
  const socialLinks = pickSocialLinks(creator).slice(0, 3);
  const allLinks = [
    ...(url ? [{ key: 'website', label: 'Website', url, icon: 'link' }] : []),
    ...socialLinks,
  ].slice(0, 4);
  const parsedTags = parseTags(tags || '').slice(0, 3);
  const totalTags = parseTags(tags || '').length;
  const platformCount = new Set(socialLinks.map((item) => item.icon)).size;
  const detailStats = [
    `${allLinks.length} link${allLinks.length === 1 ? '' : 's'}`,
    `${platformCount} platform${platformCount === 1 ? '' : 's'}`,
    `${totalTags} tag${totalTags === 1 ? '' : 's'}`,
  ];

  return (
    <article className="creator-card">
      {imageURL ? (
        <img className="creator-card__image" src={imageURL} alt={name} />
      ) : (
        <div className="creator-card__image creator-card__image--placeholder">
          <span>{name?.slice(0, 1) || '?'}</span>
        </div>
      )}

      <div className="creator-card__body">
        <header className="creator-card__header">
          <FavoriteToggle
            active={Boolean(favorite)}
            busy={favoriteBusy}
            compact
            onToggle={() => onToggleFavorite?.(creator)}
          />
          <p className="creator-card__eyebrow">Creator profile</p>
          <h3>{name}</h3>
          {category && <p className="creator-card__category">{category}</p>}
        </header>

        <p className="creator-card__description">{description}</p>

        {parsedTags.length > 0 && (
          <div className="creator-card__tags">
            {parsedTags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        )}

        <div className="creator-card__stats">
          {detailStats.map((stat) => (
            <span key={stat}>{stat}</span>
          ))}
        </div>

        {allLinks.length > 0 && (
          <div className="creator-card__socials">
            {allLinks.map((social) => (
              <a
                key={social.key}
                href={social.url}
                target="_blank"
                rel="noreferrer"
                aria-label={social.label}
                className="social-icon-button"
                style={social.color ? { '--platform-color': social.color } : undefined}
              >
                <SocialIcon type={social.icon} />
              </a>
            ))}
          </div>
        )}

        <footer className="creator-card__actions">
          <Link to={`/creator/${id}`} role="button" className="outline">
            View
          </Link>
          <Link to={`/edit/${id}`} role="button" className="secondary outline">
            Edit
          </Link>
        </footer>
      </div>
    </article>
  );
}

export default Card;
