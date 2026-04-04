function Notice({ title, children, tone = 'info' }) {
  return (
    <article className={`notice notice--${tone}`}>
      <h3>{title}</h3>
      <p>{children}</p>
    </article>
  );
}

export default Notice;
