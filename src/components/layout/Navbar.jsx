import { NavLink } from 'react-router-dom';

const Navbar = () => {
  const linkClass = ({ isActive }) =>
    `px-3 py-1.5 rounded hover:text-primary transition-colors ${
      isActive ? 'text-white bg-primary' : ''
    }`;

  return (
    <nav className="container mx-auto px-4 py-3 flex items-center justify-between">
      <NavLink to="/" className="text-xl font-bold text-primary">
        TravelApp
      </NavLink>
      <ul className="flex items-center gap-2">
        <li><NavLink to="/" className={linkClass} end>Home</NavLink></li>
      </ul>
    </nav>
  );
};

export default Navbar;