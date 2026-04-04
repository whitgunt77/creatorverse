import { categoryOptions, normalizeTags } from './creatorTags';
import { socialFields } from './socialLinks';

function isValidUrl(value) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

export function readImageFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      resolve(typeof reader.result === 'string' ? reader.result : '');
    };

    reader.onerror = () => {
      reject(new Error('Unable to read the selected image.'));
    };

    reader.readAsDataURL(file);
  });
}

export function validateCreatorForm(form) {
  const errors = {};

  if (!form.name.trim()) {
    errors.name = 'Add a creator name.';
  }

  if (!form.url.trim()) {
    errors.url = 'Add a website URL.';
  } else if (!isValidUrl(form.url.trim())) {
    errors.url = 'Use a valid full URL starting with http:// or https://';
  }

  if (!form.description.trim()) {
    errors.description = 'Add a short description.';
  }

  if (form.imageURL.trim() && !isValidUrl(form.imageURL.trim())) {
    errors.imageURL = 'Use a valid image URL.';
  }

  if (form.category && !categoryOptions.includes(form.category)) {
    errors.category = 'Pick a category from the list.';
  }

  socialFields.forEach((field) => {
    const value = form[field.key]?.trim();

    if (value && !isValidUrl(value)) {
      errors[field.key] = `Use a valid ${field.label} URL.`;
    }
  });

  return errors;
}

export function buildCreatorPayload(form, options = {}) {
  const resolvedImageURL = options.imageURL ?? form.imageURL.trim();

  return {
    name: form.name.trim(),
    url: form.url.trim(),
    description: form.description.trim(),
    imageURL: resolvedImageURL.trim() || null,
    category: form.category || null,
    tags: normalizeTags(form.tags).join(', ') || null,
    youtube_url: form.youtube_url.trim() || null,
    instagram_url: form.instagram_url.trim() || null,
    tiktok_url: form.tiktok_url.trim() || null,
    twitter_url: form.twitter_url.trim() || null,
    twitch_url: form.twitch_url.trim() || null,
  };
}
