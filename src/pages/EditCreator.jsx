import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import CreatorForm from '../components/CreatorForm';
import Notice from '../components/Notice';
import { hasSupabaseConfig, supabase } from '../client';
import {
  buildCreatorPayload,
  readImageFileAsDataUrl,
  validateCreatorForm,
} from '../creatorFormUtils';

const initialForm = {
  name: '',
  url: '',
  description: '',
  imageURL: '',
  category: '',
  tags: '',
  youtube_url: '',
  instagram_url: '',
  tiktok_url: '',
  twitter_url: '',
  twitch_url: '',
};

function EditCreator() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [errors, setErrors] = useState({});

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
        setForm({
          name: data.name ?? '',
          url: data.url ?? '',
          description: data.description ?? '',
          imageURL: data.imageURL ?? '',
          category: data.category ?? '',
          tags: data.tags ?? '',
          youtube_url: data.youtube_url ?? '',
          instagram_url: data.instagram_url ?? '',
          tiktok_url: data.tiktok_url ?? '',
          twitter_url: data.twitter_url ?? '',
          twitch_url: data.twitch_url ?? '',
        });
        setImagePreview(data.imageURL ?? '');
      }

      setLoading(false);
    }

    fetchCreator();
  }, [id]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
    setErrors((previous) => ({ ...previous, [name]: '' }));

    if (name === 'imageURL') {
      setImagePreview('');
    }
  }

  async function handleImageFileChange(event) {
    const file = event.target.files?.[0];

    if (!file) {
      setImagePreview(form.imageURL ?? '');
      return;
    }

    try {
      const preview = await readImageFileAsDataUrl(file);
      setImagePreview(preview);
      setForm((previous) => ({ ...previous, imageURL: '' }));
      setErrors((previous) => ({ ...previous, imageURL: '' }));
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  function handleTagPick(tag) {
    setForm((previous) => {
      const currentTags = previous.tags
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean);
      const nextTags = [...new Set([...currentTags, tag])].join(', ');

      return { ...previous, tags: nextTags };
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!hasSupabaseConfig) {
      setErrorMessage('Add your Supabase environment variables before editing creators.');
      return;
    }

    const validationErrors = validateCreatorForm(form);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    setErrorMessage('');

    const { error } = await supabase
      .from('creators')
      .update(buildCreatorPayload(form, { imageURL: imagePreview || form.imageURL }))
      .eq('id', id);

    if (error) {
      setErrorMessage(error.message);
      setSubmitting(false);
      return;
    }

    navigate(`/creator/${id}`, {
      state: {
        flash: {
          tone: 'success',
          title: 'Creator updated',
          message: `${form.name.trim()} has been updated.`,
        },
      },
    });
  }

  async function handleDelete() {
    if (!hasSupabaseConfig) {
      setErrorMessage('Add your Supabase environment variables before deleting creators.');
      return;
    }

    const confirmed = window.confirm('Are you sure you want to delete this creator?');
    if (!confirmed) {
      return;
    }

    const { error } = await supabase.from('creators').delete().eq('id', id);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    navigate('/', {
      state: {
        flash: {
          tone: 'success',
          title: 'Creator deleted',
          message: `${form.name.trim()} was removed from your board.`,
        },
      },
    });
  }

  if (loading) {
    return <p aria-busy="true">Loading creator...</p>;
  }

  return (
    <section className="page-stack">
      {errorMessage && (
        <Notice title="Unable to update creator" tone="danger">
          {errorMessage}
        </Notice>
      )}

      {!hasSupabaseConfig ? (
        <Notice title="Supabase is not configured yet" tone="warning">
          Add your environment variables before editing creator records.
        </Notice>
      ) : (
        <CreatorForm
          form={form}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onImageFileChange={handleImageFileChange}
          onTagPick={handleTagPick}
          submitting={submitting}
          variant="edit"
          errors={errors}
          imagePreview={imagePreview || form.imageURL}
          submitLabel="Save Changes"
          title="Edit creator"
          description="Update the details below, or remove the creator from the directory entirely."
          extraActions={
            <>
              <Link to={`/creator/${id}`} role="button" className="secondary outline">
                Cancel
              </Link>
              <button type="button" className="contrast outline" onClick={handleDelete}>
                Delete
              </button>
            </>
          }
        />
      )}
    </section>
  );
}

export default EditCreator;
