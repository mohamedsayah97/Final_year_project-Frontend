// import React, { useState } from 'react';
// import { Outlet } from 'react-router-dom';
// import { useAppSelector } from '../redux/hooks';
// import Navbar from '../components/Navbar';
// import Sidebar from './SideBar';

// const Connected = () => {
//   const { isAuthenticated } = useAppSelector((state) => state.login);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);

//   const toggleSidebar = () => {
//     setIsSidebarOpen(!isSidebarOpen);
//   };

//   if (!isAuthenticated) {
//     return null;
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Navbar onToggleSidebar={toggleSidebar} />
//       <div className="flex">
//         <Sidebar isOpen={isSidebarOpen} />
//         <main className="flex-1 p-6 mt-16 transition-all duration-300">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// };

// export default Connected;

// Connected.tsx - Version corrigée
import React, { useEffect, useState } from 'react';
import { Outlet, Navigate, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { checkAuthStatus } from '../redux/features/loginSlice';
import Navbar from '../components/Navbar';
import Sidebar from './SideBar';

const Connected = () => {
  const { isAuthenticated, status, user } = useAppSelector((state) => state.login);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Vérifier l'authentification au chargement
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    
    console.log('Connected - Token présent:', !!token);
    console.log('Connected - userRole:', userRole);
    console.log('Connected - Redux isAuthenticated:', isAuthenticated);
    
    // Si token présent mais Redux dit non authentifié, restaurer l'état
    if (token && !isAuthenticated) {
      console.log('Connected: Restauration de l\'état d\'authentification');
      dispatch(checkAuthStatus());
    }
    
    // Si pas de token, rediriger vers login
    if (!token && !isAuthenticated) {
      console.log('Connected: Pas de token, redirection vers login');
      navigate('/login');
    }
  }, [dispatch, isAuthenticated, navigate]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Afficher un loader pendant le chargement
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-4xl text-purple-600 mb-4"></i>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  // Vérifier le token dans localStorage comme fallback
  const hasToken = !!localStorage.getItem('token');
  const isActuallyAuthenticated = isAuthenticated || hasToken;

  if (!isActuallyAuthenticated) {
    console.log('Connected: Non authentifié, redirection vers login');
    return <Navigate to="/login" replace />;
  }

  // Rendre le layout
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onToggleSidebar={toggleSidebar} />
      <div className="flex">
        <Sidebar isOpen={isSidebarOpen} />
        <main className="flex-1 p-6 mt-16 transition-all duration-300">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Connected;