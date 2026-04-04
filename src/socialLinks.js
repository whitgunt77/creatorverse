export const socialFields = [
  {
    key: 'youtube_url',
    label: 'YouTube',
    placeholder: 'https://youtube.com/@creator',
    icon: 'youtube',
    color: '#ff3d5a',
  },
  {
    key: 'instagram_url',
    label: 'Instagram',
    placeholder: 'https://instagram.com/creator',
    icon: 'instagram',
    color: '#d946ef',
  },
  {
    key: 'tiktok_url',
    label: 'TikTok',
    placeholder: 'https://tiktok.com/@creator',
    icon: 'tiktok',
    color: '#111827',
  },
  {
    key: 'twitter_url',
    label: 'X / Twitter',
    placeholder: 'https://x.com/creator',
    icon: 'x',
    color: '#0f172a',
  },
  {
    key: 'twitch_url',
    label: 'Twitch',
    placeholder: 'https://twitch.tv/creator',
    icon: 'twitch',
    color: '#7c3aed',
  },
];

export function pickSocialLinks(creator) {
  return socialFields
    .map(({ key, label, icon, color }) => ({
      key,
      label,
      icon,
      color,
      url: creator?.[key]?.trim() || '',
    }))
    .filter((item) => item.url);
}
