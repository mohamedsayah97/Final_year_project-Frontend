import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { logoutUser } from '../redux/features/loginSlice';

interface NavbarProps {
  onToggleSidebar?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.login);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Récupérer l'email depuis localStorage si user n'est pas dans le state
  const userEmail = user?.email || localStorage.getItem('userEmail') || 'Utilisateur';
  const displayName = userEmail.split('@')[0]; // Prendre la partie avant @

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/login');
    setIsMobileMenuOpen(false);
    setShowUserMenu(false);
  };

  const handleToggleSidebar = () => {
    if (onToggleSidebar) {
      onToggleSidebar();
    }
    setShowUserMenu(false);
  };

  // Fermer le menu utilisateur quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = () => {
      setShowUserMenu(false);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <nav className="bg-white shadow-lg fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Site title */}
          <div className="flex items-center">
            <div className="flex items-center space-x-2">
              <svg 
                className="h-8 w-8 text-blue-600" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M13 10V3L4 14h7v7l9-11h-7z" 
                />
              </svg>
              <span className="text-xl font-bold text-gray-800">
                <NavLink to="/" end>
                  OptiManage
                </NavLink>
              </span>
            </div>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            {!isAuthenticated ? (
              // Afficher Login et Sign Up si non connecté
              <>
                <NavLink 
                  to="/login" 
                  className={({ isActive }) => 
                    `px-4 py-2 transition-colors duration-200 ${
                      isActive 
                        ? 'text-blue-600 font-semibold' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`
                  }
                >
                  Login
                </NavLink>
                <NavLink 
                  to="/register"
                  className={({ isActive }) => 
                    `px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 ${
                      isActive ? 'bg-blue-700' : ''
                    }`
                  }
                >
                  Sign Up
                </NavLink>
              </>
            ) : (
              // Afficher le nom d'utilisateur si connecté
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowUserMenu(!showUserMenu);
                  }}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-gray-700 font-medium">{displayName}</span>
                  <svg 
                    className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`}
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 border border-gray-100 z-10">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm text-gray-500">Logged in as</p>
                      <p className="text-sm font-medium text-gray-800 truncate">{userEmail}</p>
                    </div>
                    <NavLink
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <span className="mr-2">👤</span>
                      My profile
                    </NavLink>
                    {/* Changement ici: Dashboard devient Sidebar avec icône différente */}
                    <button
                      onClick={handleToggleSidebar}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <span className="mr-2">📋</span>
                      <NavLink to="/sidebar" className="text-sm text-gray-700 hover:text-gray-900">
                      Sidebar
                      </NavLink>
                    </button>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                    >
                      <span className="mr-2">🚪</span>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
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
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {!isAuthenticated ? (
                // Mobile - non connecté
                <>
                  <NavLink
                    to="/login"
                    className={({ isActive }) =>
                      `block px-3 py-2 rounded-md text-base font-medium ${
                        isActive
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`
                    }
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </NavLink>
                  <NavLink
                    to="/register"
                    className={({ isActive }) =>
                      `block px-3 py-2 rounded-md text-base font-medium text-center ${
                        isActive
                          ? 'bg-blue-700 text-white'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`
                    }
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign Up
                  </NavLink>
                </>
              ) : (
                // Mobile - connecté
                <>
                  <div className="px-3 py-2 flex items-center space-x-3 border-b border-gray-100">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {displayName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{displayName}</p>
                      <p className="text-xs text-gray-500 truncate">{userEmail}</p>
                    </div>
                  </div>
                  <NavLink
                    to="/profile"
                    className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md text-base font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="mr-2">👤</span>
                    My profile
                  </NavLink>
                  <button
                    onClick={() => {
                      handleToggleSidebar();
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md text-base font-medium"
                  >
                    <span className="mr-2">📋</span>
                    Sidebar
                  </button>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-md text-base font-medium"
                  >
                    <span className="mr-2">🚪</span>
                    Déconnexion
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;