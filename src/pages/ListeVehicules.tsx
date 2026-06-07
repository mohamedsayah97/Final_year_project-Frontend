import React, { useEffect, useState } from 'react';
import { instance } from '../config/axios';
import { useNavigate } from 'react-router-dom';

interface Vehicle {
  id: string;
  registrationNumber: string;
  make: string;
  model: string;
  year: number;
  vehicleType: string;
  color: string;
  purchaseDate: string;
  assignedDate: string | null;
  currentDriverId: string | null;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

const ListeVehicules = () => {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [vehiclesPerPage] = useState(10);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('');

  // Status options
  const statusOptions = [
    { value: 'available', label: 'Available', icon: '🟢', color: 'text-green-600' },
    { value: 'in-use', label: 'In Use', icon: '🔵', color: 'text-blue-600' },
    { value: 'maintenance', label: 'Under Maintenance', icon: '🟡', color: 'text-yellow-600' },
    { value: 'out-of-service', label: 'Out of Service', icon: '🔴', color: 'text-red-600' },
  ];

  // Vehicle type options
  const vehicleTypeOptions = [
    { value: 'SUV', label: 'SUV', icon: '🚙' },
    { value: 'Berline', label: 'Berline', icon: '🚗' },
    { value: 'Break', label: 'Break', icon: '🚐' },
    { value: 'Citadine', label: 'Citadine', icon: '🚗' },
    { value: 'Utilitaire', label: 'Utilitaire', icon: '🚛' },
    { value: 'Moto', label: 'Moto', icon: '🏍️' },
  ];

  // Récupérer tous les véhicules
  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await instance.get('/vehicules/all');
      setVehicles(response.data);
    } catch (error: any) {
      console.error('Erreur lors de la récupération des véhicules', error);
      setError('Impossible de charger la liste des véhicules');
    } finally {
      setIsLoading(false);
    }
  };

  // Supprimer un véhicule
  const handleDelete = async (id: string, registrationNumber: string) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le véhicule "${registrationNumber}" ?`)) {
      setIsDeleting(id);
      try {
        await instance.delete(`/vehicules/${id}`);
        await fetchVehicles();
        alert('Véhicule supprimé avec succès');
      } catch (error: any) {
        console.error('Erreur lors de la suppression', error);
        if (error.response?.status === 404) {
          alert('Véhicule non trouvé');
        } else {
          alert('Erreur lors de la suppression du véhicule');
        }
      } finally {
        setIsDeleting(null);
      }
    }
  };

  // Obtenir le statut avec son icône
  const getStatusInfo = (status: string) => {
    const option = statusOptions.find(opt => opt.value === status);
    return option || { icon: '⚪', label: status, color: 'text-gray-600' };
  };

  // Obtenir le type de véhicule avec son icône
  const getVehicleTypeIcon = (type: string) => {
    const option = vehicleTypeOptions.find(opt => opt.value === type);
    return option ? option.icon : '🚗';
  };

  // Filtrer les véhicules par recherche et status
  const filteredVehicles = vehicles.filter(vehicle =>
    (searchTerm === '' || 
      vehicle.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (statusFilter === '' || vehicle.status === statusFilter)
  );

  // Pagination
  const indexOfLastVehicle = currentPage * vehiclesPerPage;
  const indexOfFirstVehicle = indexOfLastVehicle - vehiclesPerPage;
  const currentVehicles = filteredVehicles.slice(indexOfFirstVehicle, indexOfLastVehicle);
  const totalPages = Math.ceil(filteredVehicles.length / vehiclesPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                <i className="fas fa-car text-green-600"></i>
                Liste des Véhicules
              </h1>
              <p className="text-gray-600">Gérez tous les véhicules de votre flotte</p>
            </div>
            <button
              onClick={() => navigate('/add-vehicle')}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 flex items-center gap-2 shadow-md"
            >
              <i className="fas fa-plus"></i>
              Ajouter un véhicule
            </button>
          </div>
        </div>

        {/* Barre de recherche et filtre */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <input
                type="text"
                placeholder="Rechercher par immatriculation, marque ou modèle..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <i className="fas fa-times"></i>
                </button>
              )}
            </div>
            
            {/* Filtre par statut */}
            <div className="w-full md:w-64">
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="">Tous les statuts</option>
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.icon} {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* État de chargement */}
        {isLoading && (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <i className="fas fa-spinner fa-spin text-4xl text-green-600 mb-4"></i>
              <p className="text-gray-600">Chargement des véhicules...</p>
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
                onClick={fetchVehicles}
                className="text-red-700 hover:text-red-900 font-semibold"
              >
                Réessayer
              </button>
            </div>
          </div>
        )}

        {/* Liste des véhicules */}
        {!isLoading && !error && (
          <>
            {filteredVehicles.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <i className="fas fa-car text-6xl text-gray-300 mb-4"></i>
                {searchTerm || statusFilter ? (
                  <>
                    <p className="text-gray-500 text-lg mb-2">Aucun véhicule ne correspond à votre recherche</p>
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setStatusFilter('');
                      }}
                      className="text-green-600 hover:text-green-700 font-semibold"
                    >
                      Effacer les filtres
                    </button>
                  </>
                ) : (
                  <>
                    <p className="text-gray-500 text-lg mb-2">Aucun véhicule n'a été trouvé</p>
                    <button
                      onClick={() => navigate('/add-vehicle')}
                      className="mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
                    >
                      Ajouter votre premier véhicule
                    </button>
                  </>
                )}
              </div>
            ) : (
              <>
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Immatriculation
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Marque / Modèle
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Type
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Année
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Couleur
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Statut
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {currentVehicles.map((vehicle) => {
                          const statusInfo = getStatusInfo(vehicle.status);
                          return (
                            <tr key={vehicle.id} className="hover:bg-gray-50 transition-colors">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                  {vehicle.registrationNumber}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-semibold">
                                    {vehicle.make.charAt(0).toUpperCase()}
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900">
                                      {vehicle.make}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      {vehicle.model}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900 flex items-center gap-1">
                                  <span>{getVehicleTypeIcon(vehicle.vehicleType)}</span>
                                  <span>{vehicle.vehicleType}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{vehicle.year}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center gap-2">
                                  <div 
                                    className="w-5 h-5 rounded-full border border-gray-300"
                                    style={{ backgroundColor: vehicle.color.toLowerCase() }}
                                  ></div>
                                  <div className="text-sm text-gray-900">{vehicle.color}</div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`flex items-center gap-1 ${statusInfo.color}`}>
                                  <span>{statusInfo.icon}</span>
                                  <span className="text-sm">{statusInfo.label}</span>
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex space-x-3">
                                  <button
                                    onClick={() => navigate(`/update-vehicle/${vehicle.id}`)}
                                    className="text-blue-600 hover:text-blue-900 transition-colors"
                                    title="Modifier"
                                  >
                                    <i className="fas fa-edit text-lg"></i>
                                  </button>
                                  <button
                                    onClick={() => handleDelete(vehicle.id, vehicle.registrationNumber)}
                                    disabled={isDeleting === vehicle.id}
                                    className="text-red-600 hover:text-red-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    title="Supprimer"
                                  >
                                    {isDeleting === vehicle.id ? (
                                      <i className="fas fa-spinner fa-spin text-lg"></i>
                                    ) : (
                                      <i className="fas fa-trash-alt text-lg"></i>
                                    )}
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
                    <div className="text-sm text-gray-500">
                      Affichage de {indexOfFirstVehicle + 1} à {Math.min(indexOfLastVehicle, filteredVehicles.length)} sur {filteredVehicles.length} véhicules
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1 rounded border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <i className="fas fa-chevron-left"></i>
                      </button>
                      
                      <div className="flex space-x-1">
                        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                          let pageNumber;
                          if (totalPages <= 5) {
                            pageNumber = i + 1;
                          } else if (currentPage <= 3) {
                            pageNumber = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNumber = totalPages - 4 + i;
                          } else {
                            pageNumber = currentPage - 2 + i;
                          }
                          
                          return (
                            <button
                              key={pageNumber}
                              onClick={() => paginate(pageNumber)}
                              className={`px-3 py-1 rounded transition-colors ${
                                currentPage === pageNumber
                                  ? 'bg-green-600 text-white'
                                  : 'border border-gray-300 text-gray-600 hover:bg-gray-50'
                              }`}
                            >
                              {pageNumber}
                            </button>
                          );
                        })}
                      </div>
                      
                      <button
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 rounded border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <i className="fas fa-chevron-right"></i>
                      </button>
                    </div>
                  </div>
                )}

                {/* Statistiques */}
                {filteredVehicles.length > 0 && (
                  <div className="mt-4 text-center">
                    <p className="text-sm text-gray-500">
                      Total des véhicules : <span className="font-semibold text-gray-700">{filteredVehicles.length}</span>
                    </p>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ListeVehicules;