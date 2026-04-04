export const categoryOptions = [
  'Comedy',
  'Performing Arts & Entertainment',
  'Music',
  'Art',
  'Gaming',
  'Lifestyle',
  'Education',
  'Fashion',
  'Tech',
  'Fitness',
];

export const suggestedTags = [
  'creator economy',
  'behind the scenes',
  'storytime',
  'tutorial',
  'vlog',
  'live',
  'funny',
  'editorial',
];

export function parseTags(value) {
  return value
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export function normalizeTags(value) {
  return [...new Set(parseTags(value))];
}
