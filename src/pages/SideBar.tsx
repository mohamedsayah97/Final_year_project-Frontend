import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAppSelector } from '../redux/hooks';

interface SidebarProps {
  isOpen?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen = true }) => {
  const { user } = useAppSelector((state) => state.login);

  const userEmail = user?.email || localStorage.getItem('userEmail') || 'Utilisateur';
  const displayName = userEmail.split('@')[0];

  // Récupérer le rôle de l'utilisateur connecté
  const userRole = user?.role || localStorage.getItem('userRole');

  // Menu items avec Dashboard ajouté en premier
  const menuItems = [
    { path: '/dashboard', name: 'Dashboard', icon: '📊', roles: ['admin'] },
    { path: '/customers', name: 'Customers', icon: '👥', roles: ['admin', 'financier'] },
    { path: '/invoices', name: 'Invoices', icon: '📄', roles: ['admin', 'financier'] },
    { path: '/list-products', name: 'Products', icon: '📦', roles: ['admin', 'stock_manager'] },
    { path: '/all-suppliers', name: 'Suppliers', icon: '🚚', roles: ['admin', 'stock_manager'] },
    { path: '/liste-vehicules', name: 'Vehicles', icon: '🚗', roles: ['admin', 'park_manager'] },
    { path: '/workers', name: 'Workers', icon: '👷', roles: ['admin', 'RH'] },
    { path: '/users', name: 'Users', icon: '👥', roles: ['admin'] },
  ];

  // Filtrer les menus selon le rôle de l'utilisateur
  const filteredMenuItems = menuItems.filter(item => {
    // Si l'utilisateur est admin, il voit tout
    if (userRole === 'admin') return true;
    // Sinon, vérifier si son rôle est dans la liste des rôles autorisés
    return item.roles.includes(userRole);
  });

  return (
    <div
      className={`sticky self-start top-16 h-[calc(100vh-4rem)] bg-gradient-to-b from-gray-900 to-gray-800 text-white transition-all duration-300 ${
        isOpen ? 'w-64' : 'w-20'
      }`}
    >
      {/* Profile Section */}
      <div className={`p-4 border-b border-gray-700 mt-2 ${!isOpen ? 'text-center' : ''}`}>
        <div className={`flex items-center ${!isOpen ? 'justify-center' : 'space-x-3'}`}>
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
            {displayName.charAt(0).toUpperCase()}
          </div>
          {isOpen && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate text-white">{displayName}</p>
              <p className="text-xs text-gray-400 truncate">{userEmail}</p>
              <p className="text-xs text-blue-400 mt-1">
                {userRole === 'admin' && '👑 Administrateur'}
                {userRole === 'RH' && '👥 RH'}
                {userRole === 'financier' && '💰 Financier'}
                {userRole === 'stock_manager' && '📦 Stock Manager'}
                {userRole === 'park_manager' && '🚗 Park Manager'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1">
          {filteredMenuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 rounded-lg mx-2 transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  } ${!isOpen ? 'justify-center' : 'space-x-3'}`
                }
                title={!isOpen ? item.name : ''}
              >
                <span className="text-xl">{item.icon}</span>
                {isOpen && <span className="font-medium">{item.name}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;