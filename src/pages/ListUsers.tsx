import React, { useEffect, useState } from 'react';
import { instance } from '../config/axios';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../redux/hooks';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  role: string;
  registrationDate: string;
}

const ListUsers = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.login);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [roleFilter, setRoleFilter] = useState('');

  // Récupérer l'ID de l'utilisateur connecté depuis localStorage
  const currentUserId = localStorage.getItem('userId');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await instance.get('/user/all');
      setUsers(response.data);
    } catch (error: any) {
      console.error('Error fetching users', error);
      if (error.response?.status === 401) {
        setError('You must be logged in to view users');
      } else if (error.response?.status === 403) {
        setError('You do not have permissions to view this page');
      } else {
        setError('Unable to load the users list');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete user "${name}"?`)) {
      setIsDeleting(id);
      try {
        await instance.delete(`/user/${id}`);
        await fetchUsers();
        alert('User deleted successfully');
      } catch (error: any) {
        console.error('Erreur lors de la suppression', error);
        if (error.response?.status === 403) {
          alert('You do not have permission to delete this user');
        } else {
          alert('Error deleting the user');
        }
      } finally {
        setIsDeleting(null);
      }
    }
  };

  const handleUpdateRole = async (id: string, newRole: string) => {
    if (window.confirm(`Do you want to change this user's role?`)) {
      try {
        await instance.put(`/user/update-role/${id}`, { role: newRole });
        await fetchUsers();
        alert('Role updated successfully');
      } catch (error: any) {
        console.error('Error updating the role', error);
        alert('Error updating the role');
      }
    }
  };

  // Filtrer les utilisateurs : exclure l'admin connecté ET ne pas afficher les autres admins
  const filteredUsers = users.filter(userItem => {
    // Exclure l'utilisateur connecté lui-même
    if (userItem.id === currentUserId) {
      return false;
    }
    
    // Exclure tous les utilisateurs avec le rôle 'admin'
    if (userItem.role === 'admin') {
      return false;
    }
    
    // Appliquer les filtres de recherche
    const matchesSearch = searchTerm === '' || 
      userItem.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userItem.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userItem.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === '' || userItem.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const getRoleBadge = (role: string) => {
    switch(role) {
      case 'admin':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">👑 Admin</span>;
      case 'RH':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">👥 HR</span>;
      case 'financier':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">💰 Finance</span>;
      case 'stock_manager':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">📦 Stock Manager</span>;
      case 'park_manager':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">🚗 Fleet Manager</span>;
      default:
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">{role}</span>;
    }
  };

  const roleOptions = [
    { value: 'RH', label: '👥 RH', icon: '👥' },
    { value: 'financier', label: '💰 Finance', icon: '💰' },
    { value: 'stock_manager', label: '📦 Stock Manager', icon: '📦' },
    { value: 'park_manager', label: '🚗 Park Manager', icon: '🚗' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                <i className="fas fa-users text-blue-600"></i>
                User Management
              </h1>
              <p className="text-gray-600">Manage your system users (sub-users)</p>
            </div>
            <button
              onClick={() => navigate('/add-user')}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 flex items-center gap-2 shadow-md"
            >
              <i className="fas fa-user-plus"></i>
              Add User
            </button>
          </div>
        </div>

        {/* Filtres */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <input
                type="text"
                placeholder="Search by first name, last name or email..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <div className="w-full md:w-64">
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                value={roleFilter}
                onChange={(e) => {
                  setRoleFilter(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="">All roles</option>
                <option value="RH">👥 RH</option>
                <option value="financier">💰 Finance</option>
                <option value="stock_manager">📦 Stock Manager</option>
                <option value="park_manager">🚗 Park Manager</option>
              </select>
            </div>
          </div>
        </div>

        {/* État de chargement */}
        {isLoading && (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <i className="fas fa-spinner fa-spin text-4xl text-blue-600 mb-4"></i>
              <p className="text-gray-600">Loading users...</p>
            </div>
          </div>
        )}

        {/* Message d'erreur */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <i className="fas fa-exclamation-circle mr-2"></i>
                <span>{error}</span>
              </div>
              <button
                onClick={fetchUsers}
                className="text-red-700 hover:text-red-900 font-semibold"
              >
                Réessayer
              </button>
            </div>
          </div>
        )}

        {/* Message quand aucun sous-utilisateur */}
        {!isLoading && !error && filteredUsers.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <i className="fas fa-users-slash text-6xl text-gray-300 mb-4"></i>
            <p className="text-gray-500 text-lg mb-2">No sub-users found</p>
            <p className="text-gray-400 text-sm mb-4">
              Administrators are not shown in this list.
            </p>
            <button
              onClick={() => navigate('/add-user')}
              className="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
            >
              Add sub-user
            </button>
          </div>
        )}

        {/* Liste des utilisateurs */}
        {!isLoading && !error && filteredUsers.length > 0 && (
          <>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Phone
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Registration Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentUsers.map((userItem) => (
                      <tr key={userItem.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold">
                              {userItem.firstName.charAt(0)}{userItem.lastName.charAt(0)}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {userItem.firstName} {userItem.lastName}
                              </div>
                              <div className="text-sm text-gray-500">
                                {userItem.address.split(',')[0]}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{userItem.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{userItem.phoneNumber}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            {getRoleBadge(userItem.role)}
                            <select
                              className="text-xs border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                              value={userItem.role}
                              onChange={(e) => handleUpdateRole(userItem.id, e.target.value)}
                            >
                              {roleOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>
                                  {opt.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {new Date(userItem.registrationDate).toLocaleDateString('en-US')}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-3">
                            {/* ✅ Bouton Modifier */}
                            <button
                              onClick={() => navigate(`/update-user/${userItem.id}`)}
                              className="text-blue-600 hover:text-blue-900 transition-colors"
                              title="Edit"
                            >
                              <i className="fas fa-edit text-lg"></i>
                            </button>
                            {/* Bouton Supprimer */}
                            <button
                              onClick={() => handleDelete(userItem.id, `${userItem.firstName} ${userItem.lastName}`)}
                              disabled={isDeleting === userItem.id}
                              className="text-red-600 hover:text-red-900 transition-colors disabled:opacity-50"
                              title="Delete"
                            >
                              {isDeleting === userItem.id ? (
                                <i className="fas fa-spinner fa-spin text-lg"></i>
                              ) : (
                                <i className="fas fa-trash-alt text-lg"></i>
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-6">
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <i className="fas fa-chevron-left"></i>
                  </button>
                  <span className="px-4 py-1 text-gray-600">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 rounded border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <i className="fas fa-chevron-right"></i>
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ListUsers;