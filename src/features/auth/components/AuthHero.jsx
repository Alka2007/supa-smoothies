const AuthHero = ({ title, subtitle }) => {
  return (
    <div className="auth-panel auth-panel--hero">
      <p className="eyebrow">Supa Smoothies</p>
      <h1>{title}</h1>
      <p className="auth-copy">{subtitle}</p>

      <div className="auth-feature-list">
        <div>
          <strong>Save your recipes</strong>
          <span>Create and edit smoothie ideas behind a protected route.</span>
        </div>
        <div>
          <strong>Stay synced</strong>
          <span>Your auth account is mirrored into the `users` table.</span>
        </div>
        <div>
          <strong>Keep the vibe</strong>
          <span>Same mint palette, softer cards, cleaner dashboard flow.</span>
        </div>
      </div>
    </div>
  );
};

export default AuthHero;
