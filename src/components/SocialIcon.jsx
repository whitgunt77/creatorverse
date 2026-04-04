function SocialIcon({ type }) {
  const sharedProps = {
    width: 16,
    height: 16,
    viewBox: '0 0 24 24',
    fill: 'none',
    xmlns: 'http://www.w3.org/2000/svg',
    'aria-hidden': 'true',
  };

  if (type === 'link') {
  return (
    <svg {...sharedProps} viewBox="0 0 24 24" fill="currentColor">
      <path d="M3.9 12C3.9 10.3 5.3 8.9 7 8.9H10V7H7C4.2 7 2 9.2 2 12C2 14.8 4.2 17 7 17H10V15.1H7C5.3 15.1 3.9 13.7 3.9 12ZM14 7V8.9H17C18.7 8.9 20.1 10.3 20.1 12C20.1 13.7 18.7 15.1 17 15.1H14V17H17C19.8 17 22 14.8 22 12C22 9.2 19.8 7 17 7H14ZM8 13H16V11H8V13Z"/>
    </svg>
  );
}

  if (type === 'youtube') {
  return (
    <svg {...sharedProps} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23 7.5C23 5.6 21.4 4 19.5 4H4.5C2.6 4 1 5.6 1 7.5V16.5C1 18.4 2.6 20 4.5 20H19.5C21.4 20 23 18.4 23 16.5V7.5ZM10 15.5V8.5L16 12L10 15.5Z"/>
    </svg>
  );
}

  if (type === 'instagram') {
  return (
    <svg {...sharedProps} viewBox="0 0 24 24" fill="currentColor">
      <path d="M7.75 2C4.57 2 2 4.57 2 7.75V16.25C2 19.43 4.57 22 7.75 22H16.25C19.43 22 22 19.43 22 16.25V7.75C22 4.57 19.43 2 16.25 2H7.75ZM12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7ZM17.5 6.5C17.78 6.5 18 6.72 18 7C18 7.28 17.78 7.5 17.5 7.5C17.22 7.5 17 7.28 17 7C17 6.72 17.22 6.5 17.5 6.5Z"/>
    </svg>
  );
}

  if (type === 'tiktok') {
  return (
    <svg {...sharedProps} viewBox="0 0 24 24" fill="currentColor">
      <path d="M14 3V10.2C13.4 9.9 12.7 9.7 12 9.7C9.8 9.7 8 11.5 8 13.7C8 15.9 9.8 17.7 12 17.7C14.2 17.7 16 15.9 16 13.7V7.5C17 8.4 18.3 9 19.7 9V6.3C17.9 6.3 16.2 5 15.5 3H14Z"/>
    </svg>
  );
}

  if (type === 'x') {
  return (
    <svg {...sharedProps} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2H21L14 10L22 22H16L11 15L5 22H2L9 13L2 2H8L12 8L18 2Z"/>
    </svg>
  );
}

if (type === 'twitch') {
  return (
    <svg {...sharedProps} viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 2L1.5 6V20H6V22H8L10 20H13L17.5 15.5V2H3ZM16 14L13.5 16.5H10.5L8.5 18.5V16.5H5V3.5H16V14ZM13.5 6H15V11H13.5V6ZM9.5 6H11V11H9.5V6Z"/>
    </svg>
  );
}

  if (type === 'star') {
    return (
      <svg {...sharedProps}>
        <path
          d="M12 4.8L14.6 9.7L20 10.5L16.1 14.2L17 19.5L12 16.8L7 19.5L7.9 14.2L4 10.5L9.4 9.7L12 4.8Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (type === 'star-fill') {
    return (
      <svg {...sharedProps}>
        <path
          d="M12 4.8L14.6 9.7L20 10.5L16.1 14.2L17 19.5L12 16.8L7 19.5L7.9 14.2L4 10.5L9.4 9.7L12 4.8Z"
          fill="var(--brand-berry)"
        />
      </svg>
    );
  }

  return (
    <svg {...sharedProps}>
      <path d="M8 7.5H16L15 10.5H18V16.5H13.8L11 19V16.5H8V7.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

export default SocialIcon;
