import React, { useEffect, useState } from 'react';
import { instance } from '../config/axios';
import { useNavigate } from 'react-router-dom';

interface Worker {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  city: string;
  jobTitle: string;
  department: string;
  hireDate: string;
  contractType: string;
  salary: number;
  hasCompanyCar: boolean;
  status: string;
}

const ListeWorker = () => {
  const navigate = useNavigate();
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [workersPerPage] = useState(10);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [departmentFilter, setDepartmentFilter] = useState('');

  useEffect(() => {
    fetchWorkers();
  }, []);

  const fetchWorkers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await instance.get('/workers/all');
      setWorkers(response.data);
    } catch (error: any) {
      console.error('Erreur lors de la récupération des employés', error);
      setError('Impossible de charger la liste des employés');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string, fullName: string) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer l'employé "${fullName}" ?`)) {
      setIsDeleting(id);
      try {
        await instance.delete(`/workers/${id}`);
        await fetchWorkers();
        alert('Employé supprimé avec succès');
      } catch (error: any) {
        console.error('Erreur lors de la suppression', error);
        alert('Erreur lors de la suppression de l\'employé');
      } finally {
        setIsDeleting(null);
      }
    }
  };

  const filteredWorkers = workers.filter(worker =>
    (searchTerm === '' || 
      worker.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      worker.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      worker.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      worker.jobTitle.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (departmentFilter === '' || worker.department === departmentFilter)
  );

  const indexOfLastWorker = currentPage * workersPerPage;
  const indexOfFirstWorker = indexOfLastWorker - workersPerPage;
  const currentWorkers = filteredWorkers.slice(indexOfFirstWorker, indexOfLastWorker);
  const totalPages = Math.ceil(filteredWorkers.length / workersPerPage);

  const formatSalary = (salary: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(salary);
  };

  const getContractIcon = (contract: string) => {
    const icons: { [key: string]: string } = {
      CDI: '📄',
      CDD: '⏱️',
      Stage: '🎓',
      Freelance: '💼',
      Intérim: '🤝',
      Alternance: '🔄',
    };
    return icons[contract] || '📋';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-100 p-6">
      <div className="max-w-7xl mx-auto">
        
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                <i className="fas fa-users text-blue-600"></i>
                Liste des Employés
              </h1>
              <p className="text-gray-600">Gérez tous les employés de votre entreprise</p>
            </div>
            <button
              onClick={() => navigate('/add-worker')}
              className="bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 flex items-center gap-2 shadow-md"
            >
              <i className="fas fa-user-plus"></i>
              Ajouter un employé
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <input
                type="text"
                placeholder="Rechercher par nom, email ou poste..."
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
                value={departmentFilter}
                onChange={(e) => {
                  setDepartmentFilter(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="">Tous les départements</option>
                <option value="IT">💻 IT</option>
                <option value="HR">👥 HR</option>
                <option value="Sales">📈 Sales</option>
                <option value="Marketing">📢 Marketing</option>
                <option value="Finance">💰 Finance</option>
              </select>
            </div>
          </div>
        </div>

        {isLoading && (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <i className="fas fa-spinner fa-spin text-4xl text-blue-600 mb-4"></i>
              <p className="text-gray-600">Chargement des employés...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <i className="fas fa-exclamation-circle mr-2"></i>
                <span>{error}</span>
              </div>
              <button onClick={fetchWorkers} className="text-red-700 hover:text-red-900 font-semibold">
                Réessayer
              </button>
            </div>
          </div>
        )}

        {!isLoading && !error && (
          <>
            {filteredWorkers.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <i className="fas fa-users text-6xl text-gray-300 mb-4"></i>
                {searchTerm || departmentFilter ? (
                  <>
                    <p className="text-gray-500 text-lg mb-2">Aucun employé ne correspond à votre recherche</p>
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setDepartmentFilter('');
                      }}
                      className="text-blue-600 hover:text-blue-700 font-semibold"
                    >
                      Effacer les filtres
                    </button>
                  </>
                ) : (
                  <>
                    <p className="text-gray-500 text-lg mb-2">Aucun employé n'a été trouvé</p>
                    <button
                      onClick={() => navigate('/add-worker')}
                      className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg"
                    >
                      Ajouter votre premier employé
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
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employé</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Poste</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Département</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contrat</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salaire</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {currentWorkers.map((worker) => (
                          <tr key={worker.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-r from-blue-500 to-sky-500 rounded-full flex items-center justify-center text-white font-semibold">
                                  {worker.firstName.charAt(0)}{worker.lastName.charAt(0)}
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {worker.firstName} {worker.lastName}
                                  </div>
                                  <div className="text-sm text-gray-500">{worker.city}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{worker.email}</div>
                              {worker.phoneNumber && (
                                <div className="text-sm text-gray-500">{worker.phoneNumber}</div>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{worker.jobTitle}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{worker.department}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900 flex items-center gap-1">
                                <span>{getContractIcon(worker.contractType)}</span>
                                <span>{worker.contractType}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-semibold text-green-600">
                                {formatSalary(worker.salary)}
                              </div>
                              {worker.hasCompanyCar && (
                                <div className="text-xs text-gray-500">🚗 Voiture de fonction</div>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-3">
                                <button
                                  onClick={() => navigate(`/update-worker/${worker.id}`)}
                                  className="text-blue-600 hover:text-blue-900 transition-colors"
                                  title="Modifier"
                                >
                                  <i className="fas fa-edit text-lg"></i>
                                </button>
                                <button
                                  onClick={() => handleDelete(worker.id, `${worker.firstName} ${worker.lastName}`)}
                                  disabled={isDeleting === worker.id}
                                  className="text-red-600 hover:text-red-900 transition-colors disabled:opacity-50"
                                >
                                  {isDeleting === worker.id ? (
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
                        Page {currentPage} sur {totalPages}
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
          </>
        )}
      </div>
    </div>
  );
};

export default ListeWorker;