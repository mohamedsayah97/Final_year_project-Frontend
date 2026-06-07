// components/WorkerDashboard.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { instance } from '../config/axios';

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
  createdAt?: string;
  updatedAt?: string;
}

interface WorkerStats {
  total: number;
  active: number;
  inactive: number;
  totalSalary: number;
  averageSalary: number;
  byDepartment: { [key: string]: number };
  byContractType: { [key: string]: number };
}

const WorkerDashboard = () => {
  const navigate = useNavigate();
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [recentWorkers, setRecentWorkers] = useState<Worker[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<WorkerStats>({
    total: 0,
    active: 0,
    inactive: 0,
    totalSalary: 0,
    averageSalary: 0,
    byDepartment: {},
    byContractType: {}
  });

  // Récupérer tous les workers
  const fetchWorkers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await instance.get('/workers/all');
      const allWorkers = response.data;
      setWorkers(allWorkers);
      
      // Récupérer les 6 workers les plus récents
      const recent = [...allWorkers].slice(0, 6);
      setRecentWorkers(recent);
      
      // Calculer les statistiques
      const activeCount = allWorkers.filter((w: Worker) => w.status === 'active').length;
      const inactiveCount = allWorkers.filter((w: Worker) => w.status === 'inactive').length;
      const totalSalary = allWorkers.reduce((sum: number, w: Worker) => sum + w.salary, 0);
      const averageSalary = allWorkers.length > 0 ? totalSalary / allWorkers.length : 0;
      
      // Compter par département
      const byDepartment: { [key: string]: number } = {};
      allWorkers.forEach((w: Worker) => {
        byDepartment[w.department] = (byDepartment[w.department] || 0) + 1;
      });
      
      // Compter par type de contrat
      const byContractType: { [key: string]: number } = {};
      allWorkers.forEach((w: Worker) => {
        byContractType[w.contractType] = (byContractType[w.contractType] || 0) + 1;
      });
      
      const newStats: WorkerStats = {
        total: allWorkers.length,
        active: activeCount,
        inactive: inactiveCount,
        totalSalary: totalSalary,
        averageSalary: averageSalary,
        byDepartment: byDepartment,
        byContractType: byContractType
      };
      
      setStats(newStats);
      
    } catch (error: any) {
      console.error('Erreur lors de la récupération des workers', error);
      if (error.response?.status === 401) {
        setError('Vous devez être connecté pour voir les employés');
      } else {
        setError('Impossible de charger les données des employés');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkers();
  }, []);

  const handleEdit = (id: string) => {
    navigate(`/update-worker/${id}`);
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer l'employé "${name}" ?`)) {
      try {
        await instance.delete(`/workers/${id}`);
        await fetchWorkers();
        alert('Employé supprimé avec succès');
      } catch (error: any) {
        console.error('Erreur lors de la suppression', error);
        if (error.response?.status === 401) {
          alert('Vous n\'avez pas les droits pour supprimer cet employé');
        } else {
          alert('Erreur lors de la suppression de l\'employé');
        }
      }
    }
  };

  // Fonction pour formater le salaire
  const formatSalary = (salary: number) => {
    return new Intl.NumberFormat('fr-TN', { style: 'currency', currency: 'TND' }).format(salary);
  };

  // Fonction pour obtenir la couleur du contrat
  const getContractColor = (contractType: string) => {
    switch(contractType) {
      case 'CDI': return 'bg-green-100 text-green-700';
      case 'CDD': return 'bg-blue-100 text-blue-700';
      case 'Stage': return 'bg-purple-100 text-purple-700';
      case 'Freelance': return 'bg-orange-100 text-orange-700';
      case 'Intérim': return 'bg-yellow-100 text-yellow-700';
      case 'Alternance': return 'bg-cyan-100 text-cyan-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  // Fonction pour obtenir l'icône du contrat
  const getContractIcon = (contractType: string) => {
    switch(contractType) {
      case 'CDI': return '📄';
      case 'CDD': return '📅';
      case 'Stage': return '🎓';
      case 'Freelance': return '💼';
      case 'Intérim': return '🔄';
      case 'Alternance': return '📚';
      default: return '📋';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-4xl text-indigo-600 mb-4"></i>
          <p className="text-gray-600">Chargement des employés...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      {/* En-tête du dashboard worker */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <i className="fas fa-users-gear text-indigo-600"></i>
              Dashboard RH / Employés
            </h2>
            <p className="text-gray-600 mt-1">Gérez vos ressources humaines</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/workers')}
              className="bg-white hover:bg-gray-50 text-gray-700 font-semibold py-2 px-4 rounded-lg transition duration-200 flex items-center gap-2 shadow-md border border-gray-200"
            >
              <i className="fas fa-list"></i>
              Voir tous
            </button>
            <button
              onClick={() => navigate('/add-worker')}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 flex items-center gap-2 shadow-md"
            >
              <i className="fas fa-user-plus"></i>
              Ajouter un employé
            </button>
          </div>
        </div>
      </div>

      {/* Cartes de statistiques workers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <i className="fas fa-users text-indigo-600"></i>
            </div>
            <span className="text-2xl font-bold text-gray-800">{stats.total}</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Total employés</h3>
        </div>

        <div className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow border-l-4 border-green-500">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <i className="fas fa-user-check text-green-600"></i>
            </div>
            <span className="text-2xl font-bold text-green-600">{stats.active}</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Actifs</h3>
        </div>

        <div className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow border-l-4 border-gray-500">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-gray-100 rounded-lg">
              <i className="fas fa-user-slash text-gray-600"></i>
            </div>
            <span className="text-2xl font-bold text-gray-600">{stats.inactive}</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Inactifs</h3>
        </div>

        <div className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow border-l-4 border-yellow-500">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <i className="fas fa-coins text-yellow-600"></i>
            </div>
            <span className="text-xl font-bold text-yellow-600">{formatSalary(stats.totalSalary)}</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Masse salariale</h3>
        </div>

        <div className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow border-l-4 border-purple-500">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <i className="fas fa-chart-line text-purple-600"></i>
            </div>
            <span className="text-xl font-bold text-purple-600">{formatSalary(stats.averageSalary)}</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Salaire moyen</h3>
        </div>
      </div>

      {/* Section des employés récents */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <i className="fas fa-user-plus"></i>
                Nouveaux employés ({recentWorkers.length})
              </h3>
              <p className="text-indigo-100 text-xs mt-1">Les derniers employés intégrés</p>
            </div>
            {recentWorkers.length === 6 && stats.total > 6 && (
              <button
                onClick={() => navigate('/workers')}
                className="bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-lg transition-colors text-sm font-semibold"
              >
                Voir tous
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="m-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <i className="fas fa-exclamation-circle"></i>
                <span className="text-sm">{error}</span>
              </div>
              <button
                onClick={fetchWorkers}
                className="text-red-700 hover:text-red-900 font-semibold text-sm"
              >
                Réessayer
              </button>
            </div>
          </div>
        )}

        {!error && recentWorkers.length === 0 && (
          <div className="p-8 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <i className="fas fa-user-plus text-3xl text-gray-400"></i>
            </div>
            <p className="text-gray-500">Aucun employé pour le moment</p>
            <button
              onClick={() => navigate('/add-worker')}
              className="mt-3 text-indigo-600 hover:text-indigo-700 font-semibold text-sm"
            >
              Ajouter votre premier employé
            </button>
          </div>
        )}

        {!error && recentWorkers.length > 0 && (
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentWorkers.map((worker) => (
                <div
                  key={worker.id}
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-all duration-300"
                >
                  {/* Header */}
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-3 text-white">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-lg font-bold backdrop-blur-sm">
                          {worker.firstName.charAt(0)}{worker.lastName.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-bold text-sm">
                            {worker.firstName} {worker.lastName}
                          </h4>
                          <p className="text-white/80 text-xs">{worker.jobTitle}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getContractColor(worker.contractType)}`}>
                        {getContractIcon(worker.contractType)} {worker.contractType}
                      </span>
                    </div>
                  </div>

                  {/* Détails */}
                  <div className="p-3 space-y-1 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <i className="fas fa-envelope w-3 text-gray-400"></i>
                      <span className="text-xs truncate">{worker.email}</span>
                    </div>
                    {worker.phoneNumber && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <i className="fas fa-phone w-3 text-gray-400"></i>
                        <span className="text-xs">{worker.phoneNumber}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-gray-600">
                      <i className="fas fa-building w-3 text-gray-400"></i>
                      <span className="text-xs">{worker.department}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <i className="fas fa-map-marker-alt w-3 text-gray-400"></i>
                      <span className="text-xs">{worker.city}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <i className="fas fa-calendar-alt w-3 text-gray-400"></i>
                      <span className="text-xs">Embauché: {new Date(worker.hireDate).toLocaleDateString('fr-FR')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <i className="fas fa-coins w-3 text-gray-400"></i>
                      <span className="text-xs font-semibold">{formatSalary(worker.salary)}</span>
                    </div>
                    {worker.hasCompanyCar && (
                      <div className="flex items-center gap-2 text-green-600">
                        <i className="fas fa-car w-3"></i>
                        <span className="text-xs">Voiture de fonction</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="p-3 pt-0 flex gap-2">
                    <button
                      onClick={() => handleEdit(worker.id)}
                      className="flex-1 px-2 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1"
                    >
                      <i className="fas fa-edit text-xs"></i>
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(worker.id, `${worker.firstName} ${worker.lastName}`)}
                      className="flex-1 px-2 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1"
                    >
                      <i className="fas fa-trash-alt text-xs"></i>
                      Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Section récapitulative - Départements et Contrats */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Répartition par département */}
        <div className="bg-white rounded-xl shadow-lg p-4">
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <i className="fas fa-building text-indigo-600"></i>
            Répartition par département
          </h3>
          <div className="space-y-2">
            {Object.entries(stats.byDepartment).map(([dept, count]) => {
              const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;
              return (
                <div key={dept}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">{dept}</span>
                    <span className="font-semibold text-gray-600">{count} ({percentage.toFixed(1)}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div 
                      className="h-full rounded-full bg-indigo-500 transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Répartition par type de contrat */}
        <div className="bg-white rounded-xl shadow-lg p-4">
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <i className="fas fa-file-contract text-indigo-600"></i>
            Types de contrat
          </h3>
          <div className="space-y-2">
            {Object.entries(stats.byContractType).map(([contract, count]) => {
              const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;
              return (
                <div key={contract}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="flex items-center gap-1">
                      <span>{getContractIcon(contract)}</span>
                      <span className="text-gray-700">{contract}</span>
                    </span>
                    <span className="font-semibold text-gray-600">{count} ({percentage.toFixed(1)}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div 
                      className="h-full rounded-full bg-purple-500 transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerDashboard;