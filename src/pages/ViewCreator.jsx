import { useEffect, useState } from 'react';
import { parseTags } from '../creatorTags';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import FavoriteToggle from '../components/FavoriteToggle';
import SocialIcon from '../components/SocialIcon';
import Notice from '../components/Notice';
import { hasSupabaseConfig, supabase } from '../client';
import { pickSocialLinks } from '../socialLinks';

function ViewCreator() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [creator, setCreator] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [favoriteBusy, setFavoriteBusy] = useState(false);

  useEffect(() => {
    async function fetchCreator() {
      if (!hasSupabaseConfig) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase.from('creators').select('*').eq('id', id).single();

      if (error) {
        setErrorMessage(error.message);
      } else {
        setCreator(data);
      }

      setLoading(false);
    }

    fetchCreator();
  }, [id]);

  if (loading) {
    return <p aria-busy="true">Loading creator...</p>;
  }

  if (!hasSupabaseConfig) {
    return (
      <Notice title="Supabase is not configured yet" tone="warning">
        Add your environment variables before trying to view individual creators.
      </Notice>
    );
  }

  if (errorMessage) {
    return (
      <Notice title="Unable to load this creator" tone="danger">
        {errorMessage}
      </Notice>
    );
  }

  if (!creator) {
    return (
      <Notice title="Creator not found" tone="warning">
        This record may have been deleted or the URL may be incorrect.
      </Notice>
    );
  }

  const socialLinks = pickSocialLinks(creator);
  const allLinks = [
    ...(creator.url ? [{ key: 'website', label: 'Website', url: creator.url, icon: 'link' }] : []),
    ...socialLinks,
  ];
  const parsedTags = parseTags(creator.tags || '');
  const platformCount = socialLinks.length;
  const linkCount = allLinks.length;
  const createdAtLabel = creator.created_at
    ? new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }).format(new Date(creator.created_at))
    : 'Unknown';

  async function handleToggleFavorite() {
    if (!hasSupabaseConfig) {
      setErrorMessage('Add your Supabase environment variables before updating favorites.');
      return;
    }

    const nextFavorite = !creator.favorite;
    setFavoriteBusy(true);
    setCreator((previous) => ({ ...previous, favorite: nextFavorite }));

    const { error } = await supabase.from('creators').update({ favorite: nextFavorite }).eq('id', id);

    if (error) {
      setCreator((previous) => ({ ...previous, favorite: !nextFavorite }));
      setErrorMessage(error.message);
    }

    setFavoriteBusy(false);
  }

  return (
    <section className="page-stack">
      {location.state?.flash && (
        <Notice title={location.state.flash.title} tone={location.state.flash.tone}>
          {location.state.flash.message}
        </Notice>
      )}

      <article className="detail-panel">
        {creator.imageURL ? (
          <img className="detail-panel__image" src={creator.imageURL} alt={creator.name} />
        ) : (
          <div className="detail-panel__image detail-panel__image--placeholder">{creator.name}</div>
        )}

        <div className="detail-panel__content">
          <p className="section-kicker">Creator spotlight</p>
          <div className="detail-panel__title-row">
            <h1>{creator.name}</h1>
            <FavoriteToggle
              active={Boolean(creator.favorite)}
              busy={favoriteBusy}
              onToggle={handleToggleFavorite}
            />
          </div>

          <div className="detail-panel__meta-row">
            {creator.category && <p className="detail-panel__category">{creator.category}</p>}
            <span>Added {createdAtLabel}</span>
          </div>

          <section className="detail-section">
            <header className="detail-section__header">
              <p className="section-kicker">About</p>
              <h2>Quick bio</h2>
            </header>
            <p>{creator.description}</p>
          </section>

          <section className="detail-grid">
            <article className="detail-metric-card">
              <p>Links</p>
              <strong>{linkCount}</strong>
              <span>Website plus socials</span>
            </article>
            <article className="detail-metric-card">
              <p>Platforms</p>
              <strong>{platformCount}</strong>
              <span>Social stacks connected</span>
            </article>
            <article className="detail-metric-card">
              <p>Tags</p>
              <strong>{parsedTags.length}</strong>
              <span>Searchable keywords</span>
            </article>
            <article className="detail-metric-card">
              <p>Status</p>
              <strong>{creator.favorite ? 'Favorite' : 'Saved'}</strong>
              <span>{creator.favorite ? 'Pinned to your board' : 'Ready for browsing'}</span>
            </article>
          </section>

          {allLinks.length > 0 && (
            <section className="detail-section">
              <header className="detail-section__header">
                <p className="section-kicker">Links</p>
                <h2>Jump out to their channels</h2>
              </header>
              <div className="social-chip-list">
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
            </section>
          )}

          {parsedTags.length > 0 && (
            <section className="detail-section">
              <header className="detail-section__header">
                <p className="section-kicker">Tags</p>
                <h2>Search-friendly vibes</h2>
              </header>
              <div className="social-chip-list social-chip-list--tags">
                {parsedTags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </section>
          )}

          <div className="form-actions">
            <Link to={`/edit/${creator.id}`} role="button">
              Edit Creator
            </Link>
            <button type="button" className="secondary outline" onClick={() => navigate('/')}>
              Back to Directory
            </button>
          </div>
        </div>
      </article>
    </section>
  );
}

export default ViewCreator;
