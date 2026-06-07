import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { instance } from '../config/axios';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  location: string;
}

const UpdateProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [location, setLocation] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    setIsFetching(true);
    setErrorMessage([]);
    try {
      const response = await instance.get(`/products/${id}`);
      const product: Product = response.data;
      
      setName(product.name);
      setDescription(product.description);
      setPrice(product.price.toString());
      setQuantity(product.quantity.toString());
      setLocation(product.location);
      
    } catch (error: any) {
      console.error('Erreur lors de la récupération du produit', error);
      if (error.response?.status === 404) {
        setErrorMessage(['Produit non trouvé']);
      } else if (error.response?.status === 401) {
        setErrorMessage(['Vous devez être connecté pour modifier un produit']);
      } else {
        setErrorMessage(['Impossible de charger les données du produit']);
      }
    } finally {
      setIsFetching(false);
    }
  };

  const validateForm = (): string[] => {
    const errors: string[] = [];
    
    if (!name.trim()) errors.push('Le nom est requis');
    if (name.length < 5) errors.push('Le nom doit contenir au moins 5 caractères');
    if (name.length > 120) errors.push('Le nom ne peut pas dépasser 120 caractères');
    
    if (!description.trim()) errors.push('La description est requise');
    if (description.length < 10) errors.push('La description doit contenir au moins 10 caractères');
    if (description.length > 1000) errors.push('La description ne peut pas dépasser 1000 caractères');
    
    const priceNum = parseFloat(price);
    if (isNaN(priceNum)) errors.push('Le prix doit être un nombre valide');
    if (priceNum < 0.01) errors.push('Le prix doit être au minimum 0.01');
    
    const quantityNum = parseInt(quantity);
    if (isNaN(quantityNum)) errors.push('La quantité doit être un nombre valide');
    if (quantityNum < 0) errors.push('La quantité ne peut pas être négative');
    
    if (!location.trim()) errors.push('L\'emplacement est requis');
    if (location.length < 5) errors.push('L\'emplacement doit contenir au moins 5 caractères');
    if (location.length > 200) errors.push('L\'emplacement ne peut pas dépasser 200 caractères');
    
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (errors.length > 0) {
      setErrorMessage(errors);
      return;
    }
    
    setIsLoading(true);
    setErrorMessage([]);
    setSuccessMessage('');

    try {
      const productData = {
        name: name.trim(),
        description: description.trim(),
        price: parseFloat(price),
        quantity: parseInt(quantity, 10),
        location: location.trim(),
      };

      console.log('Données envoyées pour mise à jour:', productData);
      await instance.put(`/products/${id}`, productData);

      setSuccessMessage('Produit modifié avec succès !');
      
      setTimeout(() => {
        navigate('/list-products');
      }, 1500);
      
    } catch (error: any) {
      console.error('Erreur lors de la modification du produit', error);
      
      if (error.response?.data?.message) {
        const messages = error.response.data.message;
        setErrorMessage(Array.isArray(messages) ? messages : [messages]);
      } else if (error.response?.status === 401) {
        setErrorMessage(['Vous devez être connecté pour modifier un produit']);
      } else if (error.response?.status === 403) {
        setErrorMessage(['Vous n\'avez pas les droits pour modifier ce produit']);
      } else {
        setErrorMessage(['Une erreur est survenue lors de la modification du produit']);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-6 flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-4xl text-purple-600 mb-4"></i>
          <p className="text-gray-600">Chargement des données...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-6">
      <div className="max-w-3xl mx-auto">
        
        {/* Bouton retour */}
        <div className="mb-4">
          <button
            onClick={() => navigate('/list-products')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <i className="fas fa-arrow-left"></i>
            Retour à la liste
          </button>
        </div>
        
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4">
            <div className="flex items-center gap-3">
              <i className="fas fa-edit text-white text-2xl"></i>
              <div>
                <h2 className="text-xl font-bold text-white">Modifier le Produit</h2>
                <p className="text-purple-100 text-sm">Modifier les informations du produit</p>
              </div>
            </div>
          </div>

          {/* Message de succès */}
          {successMessage && (
            <div className="mx-6 mt-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <i className="fas fa-check-circle"></i>
                  <span>{successMessage}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <i className="fas fa-spinner fa-spin"></i>
                  <span>Redirection...</span>
                </div>
              </div>
            </div>
          )}

          {/* Message d'erreur */}
          {errorMessage.length > 0 && (
            <div className="mx-6 mt-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
              <div className="font-semibold mb-1 flex items-center gap-2">
                <i className="fas fa-exclamation-circle"></i>
                Erreurs de validation :
              </div>
              <ul className="list-disc list-inside text-sm">
                {errorMessage.map((msg, index) => (
                  <li key={index}>{msg}</li>
                ))}
              </ul>
            </div>
          )}

          <form className="p-6 space-y-5" onSubmit={handleSubmit}>
            {/* Name */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <i className="fas fa-tag text-gray-400 text-xs"></i>
                Nom * (5-120 caractères)
              </label>
              <input 
                type="text" 
                placeholder="e.g., Wireless Mouse" 
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-purple-400 focus:ring-2 focus:ring-purple-200 outline-none transition" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <i className="fas fa-align-left text-gray-400 text-xs"></i>
                Description * (10-1000 caractères)
              </label>
              <textarea 
                rows={3}
                placeholder="Describe the product..." 
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-purple-400 focus:ring-2 focus:ring-purple-200 outline-none transition resize-none" 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            {/* Price & Quantity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <i className="fas fa-dollar-sign text-gray-400 text-xs"></i>
                  Prix * (minimum 0.01)
                </label>
                <input 
                  type="number" 
                  step="0.01" 
                  min="0.01"
                  placeholder="0.00" 
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-purple-400 focus:ring-2 focus:ring-purple-200 outline-none transition" 
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <i className="fas fa-boxes text-gray-400 text-xs"></i>
                  Quantité * (nombre entier ≥ 0)
                </label>
                <input 
                  type="number" 
                  step="1" 
                  min="0"
                  placeholder="0" 
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-purple-400 focus:ring-2 focus:ring-purple-200 outline-none transition" 
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <i className="fas fa-location-dot text-gray-400 text-xs"></i>
                Emplacement * (5-200 caractères)
              </label>
              <input 
                type="text" 
                placeholder="Warehouse A, Store #42" 
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-purple-400 focus:ring-2 focus:ring-purple-200 outline-none transition" 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button 
                type="button"
                onClick={() => navigate('/list-products')}
                className="w-1/3 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-4 rounded-xl transition duration-200"
              >
                Annuler
              </button>
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-2/3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-4 rounded-xl transition duration-200 ease-in-out transform hover:scale-[1.02] disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Mise à jour...
                  </>
                ) : (
                  <>
                    <i className="fas fa-save mr-2"></i>
                    Mettre à jour
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateProduct;