import SocialIcon from './SocialIcon';
import IconLight from '../assets/icon-only-light.svg';

function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__brand">
        <img
            src={IconLight}
            alt="Creatorverse"
            className="site-footer__logo"
        />
        <div>
          <p className='site-footer__title'>Creatorverse</p>
          <p className='site-footer__tagline'>Keep creators, categories, and socials in one bright board built for repeat browsing.</p>
        </div>
      </div>

      <div className="site-footer__socials">
        <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className='footer-social'>
          <SocialIcon type="instagram" />
        </a>
        <a href="https://tiktok.com" target="_blank" rel="noreferrer" aria-label="TikTok" className='footer-social'>
          <SocialIcon type="tiktok" />
        </a>
        <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube" className='footer-social'>
          <SocialIcon type="youtube" />
        </a>
        <a href="https://x.com" target="_blank" rel="noreferrer" aria-label="X" className='footer-social'>
          <SocialIcon type="x" />
        </a>
      </div>

      <div className="site-footer__meta">
        <p>Copyright © 2026 Creatorverse.</p>
        <p>Made for saving the internet people you do not want to forget.</p>
      </div>
    </footer>
  );
}

export default Footer;
