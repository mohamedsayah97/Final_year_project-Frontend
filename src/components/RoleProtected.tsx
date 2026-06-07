// import React from 'react';
// import { Navigate } from 'react-router-dom';
// import { useAppSelector } from '../redux/hooks';

// interface RoleProtectedProps {
//   roles: string[];
//   children: React.ReactElement;
// }

// const RoleProtected: React.FC<RoleProtectedProps> = ({ roles, children }) => {
//   const { isAuthenticated, user } = useAppSelector((state) => state.login);
//   const userRole = user?.role || localStorage.getItem('userRole');

//   if (!isAuthenticated) {
//     return <Navigate to="/login" replace />;
//   }

//   if (!userRole || !roles.includes(userRole)) {
//     return <Navigate to="/" replace />;
//   }

//   return children;
// };

// export default RoleProtected;


// RoleProtected.tsx - Version corrigée
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../redux/hooks';

interface RoleProtectedProps {
  roles: string[];
  children: React.ReactElement;
}

const RoleProtected: React.FC<RoleProtectedProps> = ({ roles, children }) => {
  const { isAuthenticated, status, user } = useAppSelector((state) => state.login);
  
  // Récupérer le rôle depuis localStorage si Redux n'est pas à jour
  const localUserRole = localStorage.getItem('userRole');
  const userRole = user?.role || localUserRole;
  
  console.log('RoleProtected - isAuthenticated:', isAuthenticated);
  console.log('RoleProtected - userRole:', userRole);
  console.log('RoleProtected - roles requis:', roles);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-4xl text-purple-600 mb-4"></i>
          <p>Vérification des droits...</p>
        </div>
      </div>
    );
  }

  // Vérifier le token dans localStorage comme fallback
  const hasToken = !!localStorage.getItem('token');
  const isActuallyAuthenticated = isAuthenticated || hasToken;

  if (!isActuallyAuthenticated) {
    console.log('RoleProtected: Non authentifié, redirection vers login');
    return <Navigate to="/login" replace />;
  }

  if (!userRole || !roles.includes(userRole)) {
    console.log(`RoleProtected: Accès refusé - rôle="${userRole}"`);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8 bg-white rounded-lg shadow-lg">
          <i className="fas fa-ban text-6xl text-red-500 mb-4"></i>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Accès non autorisé</h2>
          <p className="text-gray-600 mb-4">
            Vous n'avez pas les droits nécessaires pour accéder à cette page.
          </p>
          <p className="text-sm text-gray-500">
            Rôle requis: {roles.join(', ')}<br />
            Votre rôle: {userRole || 'Non défini'}
          </p>
        </div>
      </div>
    );
  }

  return children;
};

export default RoleProtected;