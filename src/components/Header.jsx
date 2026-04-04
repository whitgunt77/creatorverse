import { Link } from 'react-router-dom';
import BrandIcon from './BrandIcon';
import Logo from '../assets/logo.svg';

function Header() {
  return (
    <header className="site-header top-nav">
      <div className="site-header__brand">
        <Link to="/" className="brand-mark">
              <img src={Logo} alt='Creatorverse' className='site-logo' />
        </Link>
        <p>Save your favorite internet people in one bright little universe.</p>
      </div>

      <nav className="site-header__nav" aria-label="Primary">
        <Link to="/">Home</Link>
        <Link to="/new" role="button">
          + Add Creator
        </Link>
      </nav>
    </header>
  );
}

export default Header;
