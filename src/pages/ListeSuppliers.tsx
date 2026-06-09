import React, { useEffect, useState, useCallback } from "react";
import { instance } from "../config/axios";
import { useNavigate } from "react-router-dom";

interface Supplier {
  id: string;
  supplier_name: string;
  email: string;
  phone?: string;
  address?: string;
  registration_number: string;
  created_at?: string;
  updated_at?: string;
}

interface ApiError {
  response?: {
    status?: number;
    data?: unknown;
  };
  message?: string;
}

const ListeSuppliers = () => {
  const navigate = useNavigate();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [suppliersPerPage] = useState(10);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // ✅ Déclarer fetchSuppliers AVANT le useEffect
  const fetchSuppliers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await instance.get("/supplier/all");
      setSuppliers(response.data);
    } catch (err: unknown) {
      const error = err as ApiError;
      console.error("Erreur lors de la récupération des fournisseurs", error);
      setError("Impossible de charger la liste des fournisseurs");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ✅ useEffect APRÈS la déclaration
  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  const handleDelete = useCallback(
    async (id: string, name: string) => {
      if (
        window.confirm(
          `Êtes-vous sûr de vouloir supprimer le fournisseur "${name}" ?`,
        )
      ) {
        setIsDeleting(id);
        try {
          await instance.delete(`/supplier/${id}`);
          await fetchSuppliers();
          alert("Fournisseur supprimé avec succès");
        } catch (err: unknown) {
          const error = err as ApiError;
          console.error("Erreur lors de la suppression", error);
          if (error.response?.status === 404) {
            alert("Fournisseur non trouvé");
          } else {
            alert("Erreur lors de la suppression du fournisseur");
          }
        } finally {
          setIsDeleting(null);
        }
      }
    },
    [fetchSuppliers],
  );

  const filteredSuppliers = suppliers.filter(
    (supplier) =>
      searchTerm === "" ||
      supplier.supplier_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (supplier.phone && supplier.phone.includes(searchTerm)) ||
      supplier.registration_number
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
  );

  const indexOfLastSupplier = currentPage * suppliersPerPage;
  const indexOfFirstSupplier = indexOfLastSupplier - suppliersPerPage;
  const currentSuppliers = filteredSuppliers.slice(
    indexOfFirstSupplier,
    indexOfLastSupplier,
  );
  const totalPages = Math.ceil(filteredSuppliers.length / suppliersPerPage);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
      setCurrentPage(1);
    },
    [],
  );

  const clearSearch = useCallback(() => {
    setSearchTerm("");
    setCurrentPage(1);
  }, []);

  const paginate = useCallback((pageNumber: number) => {
    setCurrentPage(pageNumber);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                <i className="fas fa-truck text-amber-600"></i>
                Liste des Fournisseurs
              </h1>
              <p className="text-gray-600">Gérez tous vos fournisseurs</p>
            </div>
            <button
              onClick={() => navigate("/add-supplier")}
              className="bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 flex items-center gap-2 shadow-md"
            >
              <i className="fas fa-plus"></i>
              Ajouter un fournisseur
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="relative">
            <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            <input
              type="text"
              placeholder="Rechercher par nom, email, téléphone ou numéro d'enregistrement..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <i className="fas fa-times"></i>
              </button>
            )}
          </div>
        </div>

        {isLoading && (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <i className="fas fa-spinner fa-spin text-4xl text-amber-600 mb-4"></i>
              <p className="text-gray-600">Chargement des fournisseurs...</p>
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
              <button
                onClick={fetchSuppliers}
                className="text-red-700 hover:text-red-900 font-semibold"
              >
                Réessayer
              </button>
            </div>
          </div>
        )}

        {!isLoading && !error && (
          <>
            {filteredSuppliers.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <i className="fas fa-truck text-6xl text-gray-300 mb-4"></i>
                {searchTerm ? (
                  <>
                    <p className="text-gray-500 text-lg mb-2">
                      Aucun fournisseur ne correspond à votre recherche
                    </p>
                    <button
                      onClick={clearSearch}
                      className="text-amber-600 hover:text-amber-700 font-semibold"
                    >
                      Effacer la recherche
                    </button>
                  </>
                ) : (
                  <>
                    <p className="text-gray-500 text-lg mb-2">
                      Aucun fournisseur n'a été trouvé
                    </p>
                    <button
                      onClick={() => navigate("/add-supplier")}
                      className="mt-4 bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
                    >
                      Ajouter votre premier fournisseur
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
                            Nom
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
                            N° Enregistrement
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {currentSuppliers.map((supplier) => (
                          <tr
                            key={supplier.id}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full flex items-center justify-center text-white font-semibold">
                                  {supplier.supplier_name
                                    .charAt(0)
                                    .toUpperCase()}
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {supplier.supplier_name}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {supplier.email}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">
                                {supplier.phone || (
                                  <span className="text-gray-400 italic">
                                    Non renseigné
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div
                                className="text-sm text-gray-500 max-w-xs truncate"
                                title={supplier.address}
                              >
                                {supplier.address || (
                                  <span className="text-gray-400 italic">
                                    Non renseigné
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900 font-mono">
                                {supplier.registration_number}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-3">
                                <button
                                  onClick={() =>
                                    navigate(`/update-supplier/${supplier.id}`)
                                  }
                                  className="text-blue-600 hover:text-blue-900 transition-colors"
                                  title="Modifier"
                                >
                                  <i className="fas fa-edit text-lg"></i>
                                </button>
                                <button
                                  onClick={() =>
                                    handleDelete(
                                      supplier.id,
                                      supplier.supplier_name,
                                    )
                                  }
                                  disabled={isDeleting === supplier.id}
                                  className="text-red-600 hover:text-red-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                  title="Supprimer"
                                >
                                  {isDeleting === supplier.id ? (
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
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
                    <div className="text-sm text-gray-500">
                      Affichage de {indexOfFirstSupplier + 1} à{" "}
                      {Math.min(indexOfLastSupplier, filteredSuppliers.length)}{" "}
                      sur {filteredSuppliers.length} fournisseurs
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
                        {Array.from(
                          { length: Math.min(totalPages, 5) },
                          (_, i) => {
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
                                    ? "bg-amber-600 text-white"
                                    : "border border-gray-300 text-gray-600 hover:bg-gray-50"
                                }`}
                              >
                                {pageNumber}
                              </button>
                            );
                          },
                        )}
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

                {filteredSuppliers.length > 0 && (
                  <div className="mt-4 text-center">
                    <p className="text-sm text-gray-500">
                      Total des fournisseurs :{" "}
                      <span className="font-semibold text-gray-700">
                        {filteredSuppliers.length}
                      </span>
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

export default ListeSuppliers;
