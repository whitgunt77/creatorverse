import { categoryOptions } from '../creatorTags';
import { suggestedTags } from '../creatorTags';
import { socialFields } from '../socialLinks';
import SocialIcon from './SocialIcon';

function CreatorForm({
  form,
  onChange,
  onSubmit,
  onImageFileChange,
  onTagPick,
  submitting,
  submitLabel,
  title,
  description,
  extraActions = null,
  variant = 'default',
  errors = {},
  imagePreview = '',
}) {
  const panelClassName =
    variant === 'edit'
      ? 'form-panel form-panel--edit'
      : variant === 'add'
        ? 'form-panel form-panel--add'
        : 'form-panel';

  return (
    <article className={panelClassName}>
      <header className="form-panel__header">
        <p className="section-kicker" style={{ color: 'var(--brand-berry)' }}>Creator profile</p>
        <h2>{title}</h2>
        <p>{description}</p>

        {variant === 'edit' && (
          <div className="form-panel__status">
            <span style={{ color: 'var(--brand-berry)', background: 'rgba(255, 45, 149, 0.1)' }}>Live profile</span>
            <span style={{ color: 'var(--brand-berry)', background: 'rgba(255, 45, 149, 0.1)' }}>Edits save instantly to Supabase</span>
          </div>
        )}

        {variant === 'add' && (
          <div className="form-panel__status form-panel__status--add">
            <span>Fresh entry</span>
            <span>Perfect for new creator finds</span>
          </div>
        )}
      </header>

      <form onSubmit={onSubmit} className="creator-form">
        <label>
          Name *
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={onChange}
            placeholder="e.g. Simone Giertz"
            aria-invalid={Boolean(errors.name)}
            required
          />
          {errors.name && <small className="form-field-error">{errors.name}</small>}
        </label>

        <label>
          URL *
          <input
            type="url"
            name="url"
            value={form.url}
            onChange={onChange}
            placeholder="https://youtube.com/..."
            aria-invalid={Boolean(errors.url)}
            required
          />
          {errors.url && <small className="form-field-error">{errors.url}</small>}
        </label>

        <label>
          Description *
          <textarea
            name="description"
            value={form.description}
            onChange={onChange}
            placeholder="What makes this creator worth following?"
            rows={5}
            aria-invalid={Boolean(errors.description)}
            required
          />
          {errors.description && <small className="form-field-error">{errors.description}</small>}
        </label>

        <label>
          Image URL
          <input
            type="url"
            name="imageURL"
            value={form.imageURL}
            onChange={onChange}
            placeholder="https://example.com/creator.jpg"
            aria-invalid={Boolean(errors.imageURL)}
          />
          {errors.imageURL && <small className="form-field-error">{errors.imageURL}</small>}
        </label>

        <label className="form-upload">
          Upload an image
          <input type="file" accept="image/*" onChange={onImageFileChange} />
          <small className="form-field-hint">Upload a JPG, PNG, or WEBP instead of pasting a link.</small>
        </label>

        {imagePreview && (
          <figure className="form-image-preview">
            <img src={imagePreview} alt={`${form.name || 'Creator'} preview`} />
          </figure>
        )}

        <div className="form-meta-grid">
          <label>
            Category
            <select
              name="category"
              value={form.category}
              onChange={onChange}
              aria-invalid={Boolean(errors.category)}
            >
              <option value="">Select a category</option>
              {categoryOptions.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category && <small className="form-field-error">{errors.category}</small>}
          </label>

          <label>
            Tags
            <input
              type="text"
              name="tags"
              value={form.tags}
              onChange={onChange}
              placeholder="funny, stand-up, podcast"
            />
            <small className="form-field-hint">Separate tags with commas.</small>
          </label>
        </div>

        <div className="tag-suggestions">
          <p className="tag-suggestions__title">Quick tags</p>
          <div className="tag-filter-bar">
            {suggestedTags.map((tag) => (
              <button
                key={tag}
                type="button"
                className="secondary outline"
                onClick={() => onTagPick?.(tag)}
                style={{ color: 'var(--brand-berry)', background: 'rgba(255, 45, 149, 0.2)' }}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <section className="social-fields">
          <header className="social-fields__header">
            <p className="section-kicker">Social links</p>
            <h3>Drop in the platforms they post on.</h3>
          </header>

          <div className="social-fields__grid">
            {socialFields.map((field) => (
              <label key={field.key} className="social-field-label">
                <span className="social-field-label__title">
                  <span
                    className="social-field-label__icon"
                    style={{ '--platform-color': field.color }}
                  >
                    <SocialIcon type={field.icon} />
                  </span>
                  {field.label}
                </span>
                <input
                  type="url"
                  name={field.key}
                  value={form[field.key]}
                  onChange={onChange}
                  placeholder={field.placeholder}
                  aria-invalid={Boolean(errors[field.key])}
                />
                {errors[field.key] && <small className="form-field-error">{errors[field.key]}</small>}
              </label>
            ))}
          </div>
        </section>

        <div className="form-actions">
          <button type="submit" aria-busy={submitting} disabled={submitting}>
            {submitting ? 'Saving...' : submitLabel}
          </button>
          {extraActions}
        </div>
      </form>
    </article>
  );
}

export default CreatorForm;
