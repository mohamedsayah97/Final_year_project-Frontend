import React, { useEffect, useState, useCallback } from "react";
import { instance } from "../config/axios";
import { useNavigate } from "react-router-dom";

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

interface ApiError {
  response?: {
    status?: number;
    data?: unknown;
  };
  message?: string;
}

const ListeCustomer = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [customersPerPage] = useState(10);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState("");

  // ✅ Déclarer fetchCustomers AVANT le useEffect
  const fetchCustomers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await instance.get("/customers/all");
      setCustomers(response.data);
    } catch (err: unknown) {
      const error = err as ApiError;
      console.error("Erreur lors de la récupération des clients", error);
      if (error.response?.status === 401) {
        setError("Vous devez être connecté pour voir les clients");
      } else {
        setError("Impossible de charger la liste des clients");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ✅ useEffect APRÈS la déclaration
  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleDelete = useCallback(
    async (id: string, name: string) => {
      if (
        window.confirm(
          `Êtes-vous sûr de vouloir supprimer le client "${name}" ?`,
        )
      ) {
        setIsDeleting(id);
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
        } finally {
          setIsDeleting(null);
        }
      }
    },
    [fetchCustomers],
  );

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      searchTerm === "" ||
      customer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phoneNumber.includes(searchTerm);

    const matchesType =
      typeFilter === "" || customer.customerType === typeFilter;

    return matchesSearch && matchesType;
  });

  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const currentCustomers = filteredCustomers.slice(
    indexOfFirstCustomer,
    indexOfLastCustomer,
  );
  const totalPages = Math.ceil(filteredCustomers.length / customersPerPage);

  const getCustomerTypeIcon = useCallback((type: string) => {
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

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
      setCurrentPage(1);
    },
    [],
  );

  const handleTypeFilterChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setTypeFilter(e.target.value);
      setCurrentPage(1);
    },
    [],
  );

  const clearFilters = useCallback(() => {
    setSearchTerm("");
    setTypeFilter("");
    setCurrentPage(1);
  }, []);

  // Reste du JSX identique, seulement remplacer les onChange inline par les callbacks
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header - identique */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                <i className="fas fa-users text-purple-600"></i>
                Liste des Clients
              </h1>
              <p className="text-gray-600">Gérez tous vos clients</p>
            </div>
            <button
              onClick={() => navigate("/add-customer")}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 flex items-center gap-2 shadow-md"
            >
              <i className="fas fa-user-plus"></i>
              Ajouter un client
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
                placeholder="Rechercher par nom, email ou téléphone..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            <div className="w-full md:w-64">
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                value={typeFilter}
                onChange={handleTypeFilterChange}
              >
                <option value="">Tous les types</option>
                <option value="regular">🟢 Regular</option>
                <option value="vip">💎 VIP</option>
                <option value="wholesale">📦 Wholesale</option>
                <option value="retail">🛍️ Retail</option>
              </select>
            </div>
          </div>
        </div>

        {/* État de chargement */}
        {isLoading && (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <i className="fas fa-spinner fa-spin text-4xl text-purple-600 mb-4"></i>
              <p className="text-gray-600">Chargement des clients...</p>
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
                onClick={fetchCustomers}
                className="text-red-700 hover:text-red-900 font-semibold"
              >
                Réessayer
              </button>
            </div>
          </div>
        )}

        {/* Liste des clients - identique au reste */}
        {!isLoading && !error && (
          <>
            {filteredCustomers.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <i className="fas fa-users-slash text-6xl text-gray-300 mb-4"></i>
                {searchTerm || typeFilter ? (
                  <>
                    <p className="text-gray-500 text-lg mb-2">
                      Aucun client ne correspond à votre recherche
                    </p>
                    <button
                      onClick={clearFilters}
                      className="text-purple-600 hover:text-purple-700 font-semibold"
                    >
                      Effacer les filtres
                    </button>
                  </>
                ) : (
                  <>
                    <p className="text-gray-500 text-lg mb-2">
                      Aucun client n'a été trouvé
                    </p>
                    <button
                      onClick={() => navigate("/add-customer")}
                      className="mt-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
                    >
                      Ajouter votre premier client
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
                            Client
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Email
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Téléphone
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Adresse
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Type
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {currentCustomers.map((customer) => (
                          <tr
                            key={customer.id}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
                                  {customer.firstName.charAt(0)}
                                  {customer.lastName.charAt(0)}
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {customer.firstName} {customer.lastName}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {customer.address.split(",")[0]}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {customer.email}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">
                                {customer.phoneNumber}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div
                                className="text-sm text-gray-500 max-w-xs truncate"
                                title={customer.address}
                              >
                                {customer.address}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                                {getCustomerTypeIcon(customer.customerType)}{" "}
                                {customer.customerType}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-3">
                                <button
                                  onClick={() =>
                                    navigate(`/update-customer/${customer.id}`)
                                  }
                                  className="text-blue-600 hover:text-blue-900 transition-colors"
                                  title="Modifier"
                                >
                                  <i className="fas fa-edit text-lg"></i>
                                </button>
                                <button
                                  onClick={() =>
                                    handleDelete(
                                      customer.id,
                                      `${customer.firstName} ${customer.lastName}`,
                                    )
                                  }
                                  disabled={isDeleting === customer.id}
                                  className="text-red-600 hover:text-red-900 transition-colors disabled:opacity-50"
                                >
                                  {isDeleting === customer.id ? (
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
                        onClick={() =>
                          setCurrentPage((p) => Math.max(1, p - 1))
                        }
                        disabled={currentPage === 1}
                        className="px-3 py-1 rounded border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                      >
                        <i className="fas fa-chevron-left"></i>
                      </button>
                      <span className="px-4 py-1 text-gray-600">
                        Page {currentPage} sur {totalPages}
                      </span>
                      <button
                        onClick={() =>
                          setCurrentPage((p) => Math.min(totalPages, p + 1))
                        }
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

export default ListeCustomer;
