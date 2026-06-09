import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { instance } from "../config/axios";

interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  customerType: string;
  registrationDate: string;
}

interface CustomerStats {
  total: number;
  regular: number;
  vip: number;
  wholesale: number;
  retail: number;
  newThisMonth: number;
}

interface ApiError {
  response?: {
    status?: number;
    data?: unknown;
  };
  message?: string;
}

const DashboardCustomer = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [recentCustomers, setRecentCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<CustomerStats>({
    total: 0,
    regular: 0,
    vip: 0,
    wholesale: 0,
    retail: 0,
    newThisMonth: 0,
  });

  // Fonction pour obtenir l'icône du type de client
  const getCustomerTypeIcon = useCallback((type: string): string => {
    switch (type) {
      case "vip":
        return "💎";
      case "wholesale":
        return "📦";
      case "retail":
        return "🛍️";
      default:
        return "🟢";
    }
  }, []);

  // Fonction pour obtenir la couleur du type de client
  const getCustomerTypeColor = useCallback((type: string): string => {
    switch (type) {
      case "vip":
        return "from-yellow-400 to-orange-500";
      case "wholesale":
        return "from-blue-400 to-indigo-500";
      case "retail":
        return "from-green-400 to-emerald-500";
      default:
        return "from-purple-400 to-pink-500";
    }
  }, []);

  // Récupérer tous les clients
  const fetchCustomers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await instance.get("/customers/all");
      const allCustomers = response.data as Customer[];
      setCustomers(allCustomers);

      // Récupérer les 6 clients les plus récents
      const recent = [...allCustomers]
        .sort(
          (a, b) =>
            new Date(b.registrationDate).getTime() -
            new Date(a.registrationDate).getTime(),
        )
        .slice(0, 6);
      setRecentCustomers(recent);

      // Calculer les statistiques
      const newStats: CustomerStats = {
        total: allCustomers.length,
        regular: allCustomers.filter(
          (c: Customer) => c.customerType === "regular",
        ).length,
        vip: allCustomers.filter((c: Customer) => c.customerType === "vip")
          .length,
        wholesale: allCustomers.filter(
          (c: Customer) => c.customerType === "wholesale",
        ).length,
        retail: allCustomers.filter(
          (c: Customer) => c.customerType === "retail",
        ).length,
        newThisMonth: 0,
      };

      // Calculer les nouveaux clients du mois
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      newStats.newThisMonth = allCustomers.filter((c: Customer) => {
        const regDate = new Date(c.registrationDate);
        return regDate >= startOfMonth;
      }).length;

      setStats(newStats);
    } catch (err: unknown) {
      const error = err as ApiError;
      console.error("Erreur lors de la récupération des clients", error);
      if (error.response?.status === 401) {
        setError("Vous devez être connecté pour voir les clients");
      } else {
        setError("Impossible de charger les données des clients");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleEdit = useCallback(
    (id: string) => {
      navigate(`/update-customer/${id}`);
    },
    [navigate],
  );

  const handleDelete = useCallback(
    async (id: string, name: string) => {
      if (
        window.confirm(
          `Êtes-vous sûr de vouloir supprimer le client "${name}" ?`,
        )
      ) {
        try {
          await instance.delete(`/customers/${id}`);
          await fetchCustomers();
          alert("Client supprimé avec succès");
        } catch (err: unknown) {
          const error = err as ApiError;
          console.error("Erreur lors de la suppression", error);
          if (error.response?.status === 401) {
            alert("Vous n'avez pas les droits pour supprimer ce client");
          } else {
            alert("Erreur lors de la suppression du client");
          }
        }
      }
    },
    [fetchCustomers],
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-4xl text-purple-600 mb-4"></i>
          <p className="text-gray-600">Chargement des clients...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      {/* En-tête du dashboard client */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <i className="fas fa-users text-purple-600"></i>
              Dashboard Clients
            </h2>
            <p className="text-gray-600 mt-1">Gérez votre base de clients</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/customers")}
              className="bg-white hover:bg-gray-50 text-gray-700 font-semibold py-2 px-4 rounded-lg transition duration-200 flex items-center gap-2 shadow-md border border-gray-200"
            >
              <i className="fas fa-list"></i>
              Voir tous
            </button>
            <button
              onClick={() => navigate("/add-customer")}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 flex items-center gap-2 shadow-md"
            >
              <i className="fas fa-user-plus"></i>
              Ajouter un client
            </button>
          </div>
        </div>
      </div>

      {/* Cartes de statistiques clients */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <i className="fas fa-users text-purple-600"></i>
            </div>
            <span className="text-2xl font-bold text-gray-800">
              {stats.total}
            </span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Total clients</h3>
        </div>

        <div className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow border-l-4 border-green-500">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <i className="fas fa-user text-green-600"></i>
            </div>
            <span className="text-2xl font-bold text-green-600">
              {stats.regular}
            </span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Regular</h3>
        </div>

        <div className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow border-l-4 border-yellow-500">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <i className="fas fa-gem text-yellow-600"></i>
            </div>
            <span className="text-2xl font-bold text-yellow-600">
              {stats.vip}
            </span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">VIP</h3>
        </div>

        <div className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow border-l-4 border-blue-500">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <i className="fas fa-boxes text-blue-600"></i>
            </div>
            <span className="text-2xl font-bold text-blue-600">
              {stats.wholesale}
            </span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Wholesale</h3>
        </div>

        <div className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow border-l-4 border-emerald-500">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <i className="fas fa-shopping-bag text-emerald-600"></i>
            </div>
            <span className="text-2xl font-bold text-emerald-600">
              {stats.retail}
            </span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Retail</h3>
        </div>

        <div className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow border-l-4 border-orange-500">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-orange-100 rounded-lg">
              <i className="fas fa-calendar-plus text-orange-600"></i>
            </div>
            <span className="text-2xl font-bold text-orange-600">
              {stats.newThisMonth}
            </span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">
            Nouveaux ce mois
          </h3>
        </div>
      </div>

      {/* Section des clients récents */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <i className="fas fa-clock"></i>
                Clients récents ({recentCustomers.length})
              </h3>
              <p className="text-purple-100 text-xs mt-1">
                Les derniers clients inscrits
              </p>
            </div>
            {recentCustomers.length === 6 && stats.total > 6 && (
              <button
                onClick={() => navigate("/customers")}
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
                onClick={fetchCustomers}
                className="text-red-700 hover:text-red-900 font-semibold text-sm"
              >
                Réessayer
              </button>
            </div>
          </div>
        )}

        {!error && recentCustomers.length === 0 && (
          <div className="p-8 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <i className="fas fa-users-slash text-3xl text-gray-400"></i>
            </div>
            <p className="text-gray-500">Aucun client pour le moment</p>
            <button
              onClick={() => navigate("/add-customer")}
              className="mt-3 text-purple-600 hover:text-purple-700 font-semibold text-sm"
            >
              Ajouter votre premier client
            </button>
          </div>
        )}

        {!error && recentCustomers.length > 0 && (
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentCustomers.map((customer) => (
                <div
                  key={customer.id}
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-all duration-300"
                >
                  {/* Header avec dégradé selon le type */}
                  <div
                    className={`bg-gradient-to-r ${getCustomerTypeColor(customer.customerType)} p-3 text-white`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-lg font-bold backdrop-blur-sm">
                          {customer.firstName.charAt(0)}
                          {customer.lastName.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-bold text-sm">
                            {customer.firstName} {customer.lastName}
                          </h4>
                          <p className="text-white/80 text-xs">
                            {getCustomerTypeIcon(customer.customerType)}{" "}
                            {customer.customerType}
                          </p>
                        </div>
                      </div>
                      <span className="text-xl">
                        {getCustomerTypeIcon(customer.customerType)}
                      </span>
                    </div>
                  </div>

                  {/* Détails */}
                  <div className="p-3 space-y-1 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <i className="fas fa-envelope w-3 text-gray-400"></i>
                      <span className="text-xs truncate">{customer.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <i className="fas fa-phone w-3 text-gray-400"></i>
                      <span className="text-xs">{customer.phoneNumber}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <i className="fas fa-calendar-alt w-3 text-gray-400"></i>
                      <span className="text-xs">
                        Inscrit le:{" "}
                        {new Date(customer.registrationDate).toLocaleDateString(
                          "fr-FR",
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-3 pt-0 flex gap-2">
                    <button
                      onClick={() => handleEdit(customer.id)}
                      className="flex-1 px-2 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1"
                    >
                      <i className="fas fa-edit text-xs"></i>
                      Modifier
                    </button>
                    <button
                      onClick={() =>
                        handleDelete(
                          customer.id,
                          `${customer.firstName} ${customer.lastName}`,
                        )
                      }
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
    </div>
  );
};

export default DashboardCustomer;
