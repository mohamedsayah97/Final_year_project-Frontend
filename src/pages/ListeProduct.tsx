import React, { useEffect, useState } from 'react';
import { instance } from '../config/axios';
import { useNavigate } from 'react-router-dom';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  location: string;
  createdAt?: string;
  updatedAt?: string;
}

const ListeProduct = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await instance.get('/products/all');
      setProducts(response.data);
    } catch (error: any) {
      console.error('Erreur lors de la récupération des produits', error);
      if (error.response?.status === 401) {
        setError('Vous devez être connecté pour voir les produits');
      } else {
        setError('Impossible de charger la liste des produits');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le produit "${name}" ?`)) {
      setIsDeleting(id);
      try {
        await instance.delete(`/products/${id}`);
        await fetchProducts();
        alert('Produit supprimé avec succès');
      } catch (error: any) {
        console.error('Erreur lors de la suppression', error);
        if (error.response?.status === 401) {
          alert('Vous n\'avez pas les droits pour supprimer ce produit');
        } else {
          alert('Erreur lors de la suppression du produit');
        }
      } finally {
        setIsDeleting(null);
      }
    }
  };

  // Filtrer les produits par recherche et prix
  const filteredProducts = products.filter(product => {
    const matchesSearch = searchTerm === '' || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesMinPrice = minPrice === '' || product.price >= parseFloat(minPrice);
    const matchesMaxPrice = maxPrice === '' || product.price <= parseFloat(maxPrice);
    
    return matchesSearch && matchesMinPrice && matchesMaxPrice;
  });

  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                <i className="fas fa-boxes text-purple-600"></i>
                Liste des Produits
              </h1>
              <p className="text-gray-600">Gérez tous les produits de votre inventaire</p>
            </div>
            <button
              onClick={() => navigate('/add-product')}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 flex items-center gap-2 shadow-md"
            >
              <i className="fas fa-plus"></i>
              Ajouter un produit
            </button>
          </div>
        </div>

        {/* Filtres */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative col-span-2">
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <input
                type="text"
                placeholder="Rechercher par nom, description ou emplacement..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <div>
              <input
                type="number"
                placeholder="Prix min (€)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                value={minPrice}
                onChange={(e) => {
                  setMinPrice(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <div>
              <input
                type="number"
                placeholder="Prix max (€)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                value={maxPrice}
                onChange={(e) => {
                  setMaxPrice(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>
          {(searchTerm || minPrice || maxPrice) && (
            <div className="mt-3 text-right">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setMinPrice('');
                  setMaxPrice('');
                  setCurrentPage(1);
                }}
                className="text-sm text-purple-600 hover:text-purple-700"
              >
                Effacer les filtres
              </button>
            </div>
          )}
        </div>

        {/* État de chargement */}
        {isLoading && (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <i className="fas fa-spinner fa-spin text-4xl text-purple-600 mb-4"></i>
              <p className="text-gray-600">Chargement des produits...</p>
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
                onClick={fetchProducts}
                className="text-red-700 hover:text-red-900 font-semibold"
              >
                Réessayer
              </button>
            </div>
          </div>
        )}

        {/* Liste des produits */}
        {!isLoading && !error && (
          <>
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <i className="fas fa-box-open text-6xl text-gray-300 mb-4"></i>
                {searchTerm || minPrice || maxPrice ? (
                  <>
                    <p className="text-gray-500 text-lg mb-2">Aucun produit ne correspond à votre recherche</p>
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setMinPrice('');
                        setMaxPrice('');
                      }}
                      className="text-purple-600 hover:text-purple-700 font-semibold"
                    >
                      Effacer les filtres
                    </button>
                  </>
                ) : (
                  <>
                    <p className="text-gray-500 text-lg mb-2">Aucun produit n'a été trouvé</p>
                    <button
                      onClick={() => navigate('/add-product')}
                      className="mt-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
                    >
                      Ajouter votre premier produit
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
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produit</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prix</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantité</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Emplacement</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {currentProducts.map((product) => (
                          <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
                                  {product.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-500 max-w-md truncate" title={product.description}>
                                {product.description.length > 60 ? product.description.substring(0, 60) + '...' : product.description}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-semibold text-green-600">{formatPrice(product.price)}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                product.quantity > 10 ? 'bg-green-100 text-green-800' :
                                product.quantity > 0 ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {product.quantity} unités
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">
                                <i className="fas fa-map-marker-alt text-gray-400 mr-1"></i>
                                {product.location}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-3">
                                <button
                                  onClick={() => navigate(`/update-product/${product.id}`)}
                                  className="text-blue-600 hover:text-blue-900 transition-colors"
                                  title="Modifier"
                                >
                                  <i className="fas fa-edit text-lg"></i>
                                </button>
                                <button
                                  onClick={() => handleDelete(product.id, product.name)}
                                  disabled={isDeleting === product.id}
                                  className="text-red-600 hover:text-red-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                  title="Supprimer"
                                >
                                  {isDeleting === product.id ? (
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
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
                    <div className="text-sm text-gray-500">
                      Affichage de {indexOfFirstProduct + 1} à {Math.min(indexOfLastProduct, filteredProducts.length)} sur {filteredProducts.length} produits
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 rounded border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <i className="fas fa-chevron-left"></i>
                      </button>
                      <span className="px-4 py-1 text-gray-600">Page {currentPage} sur {totalPages}</span>
                      <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 rounded border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <i className="fas fa-chevron-right"></i>
                      </button>
                    </div>
                  </div>
                )}

                {/* Statistiques */}
                {filteredProducts.length > 0 && (
                  <div className="mt-4 text-center">
                    <p className="text-sm text-gray-500">
                      Total des produits : <span className="font-semibold text-gray-700">{filteredProducts.length}</span>
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

export default ListeProduct;