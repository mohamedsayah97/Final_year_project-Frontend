// components/ProductDashboard.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { instance } from '../config/axios';

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

interface ProductStats {
  total: number;
  totalValue: number;
  lowStock: number;
  outOfStock: number;
  averagePrice: number;
}

const ProductDashboard = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<ProductStats>({
    total: 0,
    totalValue: 0,
    lowStock: 0,
    outOfStock: 0,
    averagePrice: 0
  });

  // Récupérer tous les produits
  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await instance.get('/products/all');
      const allProducts = response.data;
      setProducts(allProducts);
      
      // Récupérer les 6 produits les plus récents (par id ou par date si disponible)
      const recent = [...allProducts].slice(0, 6);
      setRecentProducts(recent);
      
      // Calculer les statistiques
      const totalValue = allProducts.reduce((sum: number, p: Product) => sum + (p.price * p.quantity), 0);
      const lowStockCount = allProducts.filter((p: Product) => p.quantity > 0 && p.quantity <= 5).length;
      const outOfStockCount = allProducts.filter((p: Product) => p.quantity === 0).length;
      const averagePrice = allProducts.length > 0 
        ? allProducts.reduce((sum: number, p: Product) => sum + p.price, 0) / allProducts.length 
        : 0;
      
      const newStats: ProductStats = {
        total: allProducts.length,
        totalValue: totalValue,
        lowStock: lowStockCount,
        outOfStock: outOfStockCount,
        averagePrice: averagePrice
      };
      
      setStats(newStats);
      
    } catch (error: any) {
      console.error('Erreur lors de la récupération des produits', error);
      if (error.response?.status === 401) {
        setError('Vous devez être connecté pour voir les produits');
      } else {
        setError('Impossible de charger les données des produits');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleEdit = (id: string) => {
    navigate(`/update-product/${id}`);
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le produit "${name}" ?`)) {
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
      }
    }
  };

  // Fonction pour formater le prix
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-TN', { style: 'currency', currency: 'TND' }).format(price);
  };

  // Fonction pour obtenir la couleur du stock
  const getStockColor = (quantity: number) => {
    if (quantity === 0) return 'text-red-600 bg-red-100';
    if (quantity <= 5) return 'text-orange-600 bg-orange-100';
    return 'text-green-600 bg-green-100';
  };

  // Fonction pour obtenir le texte du stock
  const getStockText = (quantity: number) => {
    if (quantity === 0) return 'Rupture';
    if (quantity <= 5) return 'Stock faible';
    return 'En stock';
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-4xl text-blue-600 mb-4"></i>
          <p className="text-gray-600">Chargement des produits...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      {/* En-tête du dashboard produit */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <i className="fas fa-boxes text-blue-600"></i>
              Dashboard Produits
            </h2>
            <p className="text-gray-600 mt-1">Gérez votre inventaire de produits</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/products')}
              className="bg-white hover:bg-gray-50 text-gray-700 font-semibold py-2 px-4 rounded-lg transition duration-200 flex items-center gap-2 shadow-md border border-gray-200"
            >
              <i className="fas fa-list"></i>
              Voir tous
            </button>
            <button
              onClick={() => navigate('/add-product')}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 flex items-center gap-2 shadow-md"
            >
              <i className="fas fa-plus"></i>
              Ajouter un produit
            </button>
          </div>
        </div>
      </div>

      {/* Cartes de statistiques produits */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <i className="fas fa-boxes text-blue-600"></i>
            </div>
            <span className="text-2xl font-bold text-gray-800">{stats.total}</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Total produits</h3>
        </div>

        <div className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow border-l-4 border-green-500">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <i className="fas fa-coins text-green-600"></i>
            </div>
            <span className="text-xl font-bold text-green-600">{formatPrice(stats.totalValue)}</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Valeur totale</h3>
        </div>

        <div className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow border-l-4 border-orange-500">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-orange-100 rounded-lg">
              <i className="fas fa-exclamation-triangle text-orange-600"></i>
            </div>
            <span className="text-2xl font-bold text-orange-600">{stats.lowStock}</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Stock faible</h3>
          <p className="text-xs text-gray-400 mt-1">≤ 5 unités</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow border-l-4 border-red-500">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-red-100 rounded-lg">
              <i className="fas fa-ban text-red-600"></i>
            </div>
            <span className="text-2xl font-bold text-red-600">{stats.outOfStock}</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Rupture</h3>
          <p className="text-xs text-gray-400 mt-1">Plus en stock</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow border-l-4 border-purple-500">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <i className="fas fa-chart-line text-purple-600"></i>
            </div>
            <span className="text-xl font-bold text-purple-600">{formatPrice(stats.averagePrice)}</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Prix moyen</h3>
        </div>
      </div>

      {/* Section des produits récents */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-3">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <i className="fas fa-clock"></i>
                Produits récents ({recentProducts.length})
              </h3>
              <p className="text-blue-100 text-xs mt-1">Les derniers produits ajoutés</p>
            </div>
            {recentProducts.length === 6 && stats.total > 6 && (
              <button
                onClick={() => navigate('/products')}
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
                onClick={fetchProducts}
                className="text-red-700 hover:text-red-900 font-semibold text-sm"
              >
                Réessayer
              </button>
            </div>
          </div>
        )}

        {!error && recentProducts.length === 0 && (
          <div className="p-8 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <i className="fas fa-box-open text-3xl text-gray-400"></i>
            </div>
            <p className="text-gray-500">Aucun produit pour le moment</p>
            <button
              onClick={() => navigate('/add-product')}
              className="mt-3 text-blue-600 hover:text-blue-700 font-semibold text-sm"
            >
              Ajouter votre premier produit
            </button>
          </div>
        )}

        {!error && recentProducts.length > 0 && (
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-all duration-300"
                >
                  {/* Header */}
                  <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-3 text-white">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-sm line-clamp-1">{product.name}</h4>
                        <p className="text-white/80 text-xs mt-1">{product.location}</p>
                      </div>
                      <span className="text-xl font-bold">{formatPrice(product.price)}</span>
                    </div>
                  </div>

                  {/* Détails */}
                  <div className="p-3 space-y-2">
                    <p className="text-xs text-gray-600 line-clamp-2 min-h-[40px]">
                      {product.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <i className="fas fa-cubes text-gray-400 text-xs"></i>
                        <span className="text-sm font-semibold">{product.quantity}</span>
                        <span className="text-xs text-gray-500">unités</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStockColor(product.quantity)}`}>
                        {getStockText(product.quantity)}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-3 pt-0 flex gap-2">
                    <button
                      onClick={() => handleEdit(product.id)}
                      className="flex-1 px-2 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1"
                    >
                      <i className="fas fa-edit text-xs"></i>
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(product.id, product.name)}
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

export default ProductDashboard;