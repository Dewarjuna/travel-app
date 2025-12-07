import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../ui/Toast';

const Navbar = () => {
  const { isAuthenticated, user, logout, isAdmin } = useAuth(); // Add isAdmin here
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const linkClass = ({ isActive }) =>
    `px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
      isActive
        ? 'bg-blue-600 text-white shadow-sm'
        : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
    }`;
    
  const handleLogout = async () => {
    try {
      await logout();
      addToast('Logged out successfully', 'success');
      navigate('/');
      setIsMobileMenuOpen(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm" aria-label="Main navigation">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <NavLink
            to="/"
            className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors"
            aria-label="DewaTravel"
          >
            DewaTravel
          </NavLink>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center gap-1">
            <li>
              <NavLink to="/" className={linkClass} end onClick={closeMobileMenu}>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/activities" className={linkClass} onClick={closeMobileMenu}>
                Activities
              </NavLink>
            </li>

            {isAuthenticated ? (
              <>
                <li>
                  <NavLink to="/cart" className={linkClass} onClick={closeMobileMenu}>
                    Cart
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/transactions" className={linkClass} onClick={closeMobileMenu}>
                    Orders
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/profile" className={linkClass} onClick={closeMobileMenu}>
                    Profile
                  </NavLink>
                </li>
                
                {/* Admin */}
                {isAdmin && (
                  <li>
                    <NavLink to="/admin" className={linkClass} onClick={closeMobileMenu}>
                      Admin
                    </NavLink>
                  </li>
                )}
                
                <li>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 rounded-lg font-medium text-red-600 hover:bg-red-50 transition-all duration-200"
                    aria-label="Logout"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <NavLink
                    to="/login"
                    className="px-4 py-2 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-all duration-200"
                    onClick={closeMobileMenu}
                  >
                    Login
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/register"
                    className="px-4 py-2 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-md transition-all duration-200"
                    onClick={closeMobileMenu}
                  >
                    Register
                  </NavLink>
                </li>
              </>
            )}
          </ul>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            aria-label="Toggle mobile menu"
            aria-expanded={isMobileMenuOpen}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <ul className="flex flex-col gap-2">
              <li>
                <NavLink to="/" className={linkClass} end onClick={closeMobileMenu}>
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink to="/activities" className={linkClass} onClick={closeMobileMenu}>
                  Activities
                </NavLink>
              </li>

              {isAuthenticated ? (
                <>
                  <li>
                    <NavLink to="/cart" className={linkClass} onClick={closeMobileMenu}>
                      Cart
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/transactions" className={linkClass} onClick={closeMobileMenu}>
                      Orders
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/profile" className={linkClass} onClick={closeMobileMenu}>
                      Profile
                    </NavLink>
                  </li>
                  
                  {/* Admin button */}
                  {isAdmin && (
                    <li>
                      <NavLink to="/admin" className={linkClass} onClick={closeMobileMenu}>
                        Admin
                      </NavLink>
                    </li>
                  )}
                  
                  <li>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 rounded-lg font-medium text-red-600 hover:bg-red-50 transition-all duration-200"
                    >
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <NavLink
                      to="/login"
                      className="block px-4 py-2 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-all duration-200"
                      onClick={closeMobileMenu}
                    >
                      Login
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/register"
                      className="block px-4 py-2 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-all duration-200"
                      onClick={closeMobileMenu}
                    >
                      Register
                    </NavLink>
                  </li>
                </>
              )}
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;