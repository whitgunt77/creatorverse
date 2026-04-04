import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

function AddCreator() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [imagePreview, setImagePreview] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [errors, setErrors] = useState({});

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
      setImagePreview('');
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
      setErrorMessage('Add your Supabase environment variables before submitting creators.');
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
      .insert([
        {
          ...buildCreatorPayload(form, { imageURL: imagePreview || form.imageURL }),
          favorite: false,
        },
      ]);

    if (error) {
      setErrorMessage(error.message);
      setSubmitting(false);
      return;
    }

    navigate('/', {
      state: {
        flash: {
          tone: 'success',
          title: 'Creator added',
          message: `${form.name.trim()} is now on your board.`,
        },
      },
    });
  }

  return (
    <section className="page-stack">
      {errorMessage && (
        <Notice title="Unable to add creator" tone="danger">
          {errorMessage}
        </Notice>
      )}

      <CreatorForm
        form={form}
        onChange={handleChange}
        onSubmit={handleSubmit}
        onImageFileChange={handleImageFileChange}
        onTagPick={handleTagPick}
        submitting={submitting}
        errors={errors}
        imagePreview={imagePreview || form.imageURL}
        variant="add"
        submitLabel="Add Creator"
        title="Add a new creator"
        description="Capture the creator's name, share link, and a quick description so the directory stays useful."
      />
    </section>
  );
}

export default AddCreator;
