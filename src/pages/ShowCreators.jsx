import { useEffect, useMemo, useState } from 'react';
import { categoryOptions, parseTags } from '../creatorTags';
import { useLocation } from 'react-router-dom';
import Card from '../components/Card';
import EmptyState from '../components/EmptyState';
import Notice from '../components/Notice';
import { hasSupabaseConfig, supabase } from '../client';
import { pickSocialLinks } from '../socialLinks';
import LogoStacked from '../assets/stacked-logo.svg';
import IconLogo from '../assets/icon-only-logo.svg';

function ShowCreators() {
  const location = useLocation();
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMode, setFilterMode] = useState('all');
  const [sortMode, setSortMode] = useState('smart');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [activeTag, setActiveTag] = useState('all');
  const [favoriteBusyId, setFavoriteBusyId] = useState(null);
  const availableCategories = useMemo(() => {
    const creatorCategories = creators
      .map((creator) => creator.category?.trim())
      .filter(Boolean);

    return [...new Set([...categoryOptions, ...creatorCategories])];
  }, [creators]);
  const availableTags = useMemo(() => {
    const counts = new Map();

    creators.forEach((creator) => {
      parseTags(creator.tags || '').forEach((tag) => {
        counts.set(tag, (counts.get(tag) || 0) + 1);
      });
    });

    return [...counts.entries()]
      .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
      .slice(0, 8)
      .map(([tag]) => tag);
  }, [creators]);
  const favoriteCount = useMemo(() => creators.filter((creator) => creator.favorite).length, [creators]);
  const imageCount = useMemo(() => creators.filter((creator) => creator.imageURL).length, [creators]);
  const socialsCount = useMemo(
    () => creators.filter((creator) => pickSocialLinks(creator).length > 0).length,
    [creators],
  );
  function scoreCreator(creator) {
    const socialCount = pickSocialLinks(creator).length;
    const tagCount = parseTags(creator.tags || '').length;
    const imageScore = creator.imageURL ? 20 : 0;
    const favoriteScore = creator.favorite ? 1000 : 0;
    const recencyScore = creator.created_at ? new Date(creator.created_at).getTime() / 100000000 : 0;

    return favoriteScore + socialCount * 30 + tagCount * 10 + imageScore + recencyScore;
  }

  const filteredCreators = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    const matchingCreators = creators.filter((creator) => {
      const tagList = parseTags(creator.tags || '');
      const socialText = pickSocialLinks(creator)
        .map((item) => `${item.label} ${item.url}`)
        .join(' ');
      const haystack = [
        creator.name,
        creator.description,
        creator.url,
        creator.category,
        tagList.join(' '),
        socialText,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      if (normalizedSearch && !haystack.includes(normalizedSearch)) {
        return false;
      }

      if (filterMode === 'with-image' && !creator.imageURL) {
        return false;
      }

      if (filterMode === 'with-socials' && pickSocialLinks(creator).length === 0) {
        return false;
      }

      if (filterMode === 'favorites' && !creator.favorite) {
        return false;
      }

      if (categoryFilter !== 'all' && creator.category !== categoryFilter) {
        return false;
      }

      if (activeTag !== 'all' && !tagList.includes(activeTag)) {
        return false;
      }

      return true;
    });

    return [...matchingCreators].sort((left, right) => {
      if (sortMode === 'smart') {
        return scoreCreator(right) - scoreCreator(left);
      }

      if (sortMode === 'name-asc') {
        return left.name.localeCompare(right.name);
      }

      if (sortMode === 'name-desc') {
        return right.name.localeCompare(left.name);
      }

      return new Date(right.created_at ?? 0) - new Date(left.created_at ?? 0);
    });
  }, [activeTag, categoryFilter, creators, filterMode, searchTerm, sortMode]);

  const topCreator = useMemo(() => {
    if (filteredCreators.length === 0) {
      return null;
    }

    return filteredCreators[0];
  }, [filteredCreators]);

  async function handleToggleFavorite(creator) {
    if (!hasSupabaseConfig) {
      setErrorMessage('Add your Supabase environment variables before changing favorites.');
      return;
    }

    const nextFavorite = !creator.favorite;
    setFavoriteBusyId(creator.id);
    setCreators((previous) =>
      previous.map((item) => (item.id === creator.id ? { ...item, favorite: nextFavorite } : item)),
    );

    const { error } = await supabase
      .from('creators')
      .update({ favorite: nextFavorite })
      .eq('id', creator.id);

    if (error) {
      setCreators((previous) =>
        previous.map((item) =>
          item.id === creator.id ? { ...item, favorite: !nextFavorite } : item,
        ),
      );
      setErrorMessage(error.message);
    }

    setFavoriteBusyId(null);
  }

  useEffect(() => {
    async function fetchCreators() {
      if (!hasSupabaseConfig) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('creators')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        setErrorMessage(error.message);
      } else {
        setCreators(data ?? []);
      }

      setLoading(false);
    }

    fetchCreators();
  }, []);

  return (
    <section className="page-stack">
      <header className="hero">
        <img
            src={LogoStacked}
            alt='Creatorverse'
            className='hero-logo'
        />
        <p className="section-kicker">Creator directory</p>
        <h1>Discover the people making the internet more interesting.</h1>
        <p className='kicker-desc'>
          Save your favorite creators, keep their links handy, and build a browsable
          little universe around the channels you love.
        </p>
      </header>

      {!hasSupabaseConfig && (
        <Notice title="Supabase is not configured yet" tone="warning">
          Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to `.env`, then restart
          the dev server.
        </Notice>
      )}

      {errorMessage && (
        <Notice title="We hit a database error" tone="danger">
          {errorMessage}
        </Notice>
      )}

      {location.state?.flash && (
        <Notice title={location.state.flash.title} tone={location.state.flash.tone}>
          {location.state.flash.message}
        </Notice>
      )}

      {loading ? (
        <p aria-busy="true">Loading creators...</p>
      ) : creators.length === 0 ? (
        <EmptyState
          title="No creators yet"
          body="Once your Supabase table is ready, add your first creator and the directory will appear here."
        />
      ) : (
        <section className="home-board">
          <section className="market-intro">
            <div className="market-intro__copy">
              <img
                src={IconLogo}
                alt='Creatorverse'
                className='section-logo section-logo--icon'
            />
              <p className="section-kicker">Playful creatorverse</p>
              <h2>Internet favorites, all in one loud little universe.</h2>
              <p>
                Save the creators you love, build your own bright lineup, and jump
                straight into the profiles worth revisiting.
              </p>
            </div>

            <div className="market-intro__rail">
              <div className="market-intro__stats">
                <article>
                  <strong>{favoriteCount}</strong>
                  <span>favorites saved</span>
                </article>
                <article>
                  <strong>{imageCount}</strong>
                  <span>profiles with images</span>
                </article>
                <article>
                  <strong>{socialsCount}</strong>
                  <span>profiles with socials</span>
                </article>
              </div>

              <div className="market-intro__tags" aria-label="Highlights">
                <span>watchlist energy</span>
                <span>creator crushes</span>
                <span>link dump, but cute</span>
              </div>
            </div>
          </section>

          {topCreator && (
            <section className="board-spotlight">
              <div>
                <p className="section-kicker">Board spotlight</p>
                <h2>{topCreator.name}</h2>
                <p>{topCreator.description}</p>
              </div>
              <div className="board-spotlight__meta">
                <span>{topCreator.favorite ? 'Favorite' : 'Smart pick'}</span>
                <span>{topCreator.category || 'Uncategorized'}</span>
              </div>
            </section>
          )}

          <section className="directory-section">
            <div className="directory-section__header">
              <div>
                <p className="section-kicker">Your board</p>
                <h2>All creators</h2>
              </div>
              <p>{filteredCreators.length} showing</p>
            </div>

            <div className="directory-controls">
              <label className="directory-controls__search">
                Search
                <input
                  type="search"
                  name="search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search creators, descriptions, or socials"
                />
              </label>

              <label>
                Filter
                <select value={filterMode} onChange={(event) => setFilterMode(event.target.value)}>
                  <option value="all">All creators</option>
                  <option value="favorites">Favorites only</option>
                  <option value="with-image">With image</option>
                  <option value="with-socials">With socials</option>
                </select>
              </label>

              <label>
                Category
                <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
                  <option value="all">All categories</option>
                  {availableCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Sort
                <select value={sortMode} onChange={(event) => setSortMode(event.target.value)}>
                  <option value="smart">Smart board</option>
                  <option value="newest">Newest first</option>
                  <option value="name-asc">Name A-Z</option>
                  <option value="name-desc">Name Z-A</option>
                </select>
              </label>
            </div>

            {availableTags.length > 0 && (
              <div className="tag-filter-bar">
                <button
                  type="button"
                  className={activeTag === 'all' ? '' : 'secondary outline'}
                  onClick={() => setActiveTag('all')}
                >
                  All tags
                </button>
                {availableTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    className={activeTag === tag ? '' : 'secondary outline'}
                    onClick={() => setActiveTag(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}

            {filteredCreators.length === 0 ? (
              <EmptyState
                title="No matches found"
                body="Try a different search term, or switch the filter to see more creators."
                actionLabel="Add Creator"
              />
            ) : (
              <div className="creator-board">
                {filteredCreators.map((creator) => (
                  <Card
                    key={creator.id}
                    creator={creator}
                    onToggleFavorite={handleToggleFavorite}
                    favoriteBusy={favoriteBusyId === creator.id}
                  />
                ))}
              </div>
            )}
        </section>
        </section>
      )}
    </section>
  );
}

export default ShowCreators;
