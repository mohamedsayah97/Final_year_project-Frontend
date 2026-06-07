import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { instance } from '../config/axios';

interface ProductFormData {
    name: string;
    description: string;
    price: string;
    quantity: string;
    location: string;
}

interface FormErrors {
    name?: string;
    description?: string;
    price?: string;
    quantity?: string;
    location?: string;
}

const AddProductForm = () => {
    const navigate = useNavigate();
    
    // État local du formulaire
    const [formData, setFormData] = useState<ProductFormData>({
        name: '',
        description: '',
        price: '',
        quantity: '',
        location: '',
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string[]>([]);
    const [successMessage, setSuccessMessage] = useState('');

    // Fonctions de validation individuelles
    const validateName = (value: string): string | undefined => {
        if (!value) return 'Le nom est requis';
        if (value.length < 5) return 'Le nom doit contenir au moins 5 caractères';
        if (value.length > 120) return 'Le nom ne peut pas dépasser 120 caractères';
        return undefined;
    };

    const validateDescription = (value: string): string | undefined => {
        if (!value) return 'La description est requise';
        if (value.length < 10) return 'La description doit contenir au moins 10 caractères';
        if (value.length > 1000) return 'La description ne peut pas dépasser 1000 caractères';
        return undefined;
    };

    const validatePrice = (value: string): string | undefined => {
        if (!value) return 'Le prix est requis';
        const priceNum = parseFloat(value);
        if (isNaN(priceNum)) return 'Le prix doit être un nombre valide';
        if (priceNum < 0.01) return 'Le prix doit être au minimum 0.01';
        if (!/^\d+(\.\d{0,2})?$/.test(value)) return 'Le prix ne peut pas avoir plus de 2 décimales';
        return undefined;
    };

    const validateQuantity = (value: string): string | undefined => {
        if (!value) return 'La quantité est requise';
        const quantityNum = parseInt(value);
        if (isNaN(quantityNum)) return 'La quantité doit être un nombre valide';
        if (quantityNum < 0) return 'La quantité ne peut pas être négative';
        if (!Number.isInteger(quantityNum)) return 'La quantité doit être un nombre entier';
        return undefined;
    };

    const validateLocation = (value: string): string | undefined => {
        if (!value) return 'L\'emplacement est requis';
        if (value.length < 5) return 'L\'emplacement doit contenir au moins 5 caractères';
        if (value.length > 200) return 'L\'emplacement ne peut pas dépasser 200 caractères';
        return undefined;
    };

    // Validation des champs selon le DTO
    const validateField = (name: string, value: string): string | undefined => {
        switch (name) {
            case 'name':
                return validateName(value);
            case 'description':
                return validateDescription(value);
            case 'price':
                return validatePrice(value);
            case 'quantity':
                return validateQuantity(value);
            case 'location':
                return validateLocation(value);
            default:
                return undefined;
        }
    };

    // Validation complète du formulaire
    const validateForm = (): boolean => {
        const newErrors: FormErrors = {
            name: validateName(formData.name),
            description: validateDescription(formData.description),
            price: validatePrice(formData.price),
            quantity: validateQuantity(formData.quantity),
            location: validateLocation(formData.location),
        };

        setErrors(newErrors);
        return !Object.values(newErrors).some(error => error !== undefined);
    };

    // Gestion des changements dans les inputs
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Valider le champ en temps réel
        const error = validateField(name, value);
        setErrors(prev => ({
            ...prev,
            [name]: error
        }));
    };

    // Soumission du formulaire avec axios
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Valider le formulaire avant soumission
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        setErrorMessage([]);
        setSuccessMessage('');

        try {
            const productData = {
                name: formData.name.trim(),
                description: formData.description.trim(),
                price: parseFloat(formData.price),
                quantity: parseInt(formData.quantity, 10),
                location: formData.location.trim(),
            };

            console.log('Envoi des données:', productData);
            const response = await instance.post('/products/create', productData);

            console.log('Produit créé avec succès', response.data);
            setSuccessMessage('Produit ajouté avec succès !');
            
            // Redirection vers la liste des produits après 1.5 secondes
            setTimeout(() => {
                navigate('/list-products');
            }, 1500);
            
        } catch (error: any) {
            console.error('Erreur lors de la création:', error);
            
            if (error.response?.data?.message) {
                const messages = error.response.data.message;
                if (Array.isArray(messages)) {
                    setErrorMessage(messages);
                } else {
                    setErrorMessage([messages]);
                }
            } else if (error.response?.status === 401) {
                setErrorMessage(['Vous devez être connecté et avoir les droits pour ajouter un produit']);
            } else {
                setErrorMessage(['Une erreur est survenue lors de l\'ajout du produit']);
            }
        } finally {
            setIsLoading(false);
        }
    };

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

                {/* Message de succès */}
                {successMessage && (
                    <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-center">
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
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                        <div className="font-semibold mb-1 flex items-center gap-2">
                            <i className="fas fa-exclamation-triangle"></i>
                            Erreurs de validation :
                        </div>
                        <ul className="list-disc list-inside text-sm">
                            {errorMessage.map((msg, index) => (
                                <li key={index}>{msg}</li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden">
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4">
                        <div className="flex items-center gap-3">
                            <i className="fas fa-box text-white text-2xl"></i>
                            <div>
                                <h2 className="text-xl font-bold text-white">Ajouter un Produit</h2>
                                <p className="text-purple-100 text-sm">
                                    Créer un nouveau produit dans votre inventaire
                                </p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-5">
                        {/* Name */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                <i className="fas fa-tag text-gray-400 text-xs"></i>
                                Nom * (5-120 caractères)
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g., Wireless Mouse"
                                className={`w-full px-4 py-2.5 bg-gray-50 border rounded-xl focus:bg-white focus:ring-2 outline-none transition ${errors.name ? 'border-red-400 focus:border-red-400 focus:ring-red-200' : 'border-gray-200 focus:border-purple-400 focus:ring-purple-200'
                                    }`}
                                disabled={isLoading}
                            />
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-500">
                                    <i className="fas fa-exclamation-circle mr-1"></i>
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        {/* Description */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                <i className="fas fa-align-left text-gray-400 text-xs"></i>
                                Description * (10-1000 caractères)
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={3}
                                placeholder="Describe the product..."
                                className={`w-full px-4 py-2.5 bg-gray-50 border rounded-xl focus:bg-white focus:ring-2 outline-none transition resize-none ${errors.description ? 'border-red-400 focus:border-red-400 focus:ring-red-200' : 'border-gray-200 focus:border-purple-400 focus:ring-purple-200'
                                    }`}
                                disabled={isLoading}
                            />
                            {errors.description && (
                                <p className="mt-1 text-sm text-red-500">
                                    <i className="fas fa-exclamation-circle mr-1"></i>
                                    {errors.description}
                                </p>
                            )}
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
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    step="0.01"
                                    min="0.01"
                                    placeholder="0.00"
                                    className={`w-full px-4 py-2.5 bg-gray-50 border rounded-xl focus:bg-white focus:ring-2 outline-none transition ${errors.price ? 'border-red-400 focus:border-red-400 focus:ring-red-200' : 'border-gray-200 focus:border-purple-400 focus:ring-purple-200'
                                        }`}
                                    disabled={isLoading}
                                />
                                {errors.price && (
                                    <p className="mt-1 text-sm text-red-500">
                                        <i className="fas fa-exclamation-circle mr-1"></i>
                                        {errors.price}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                    <i className="fas fa-boxes text-gray-400 text-xs"></i>
                                    Quantité * (nombre entier ≥ 0)
                                </label>
                                <input
                                    type="number"
                                    name="quantity"
                                    value={formData.quantity}
                                    onChange={handleChange}
                                    step="1"
                                    min="0"
                                    placeholder="0"
                                    className={`w-full px-4 py-2.5 bg-gray-50 border rounded-xl focus:bg-white focus:ring-2 outline-none transition ${errors.quantity ? 'border-red-400 focus:border-red-400 focus:ring-red-200' : 'border-gray-200 focus:border-purple-400 focus:ring-purple-200'
                                        }`}
                                    disabled={isLoading}
                                />
                                {errors.quantity && (
                                    <p className="mt-1 text-sm text-red-500">
                                        <i className="fas fa-exclamation-circle mr-1"></i>
                                        {errors.quantity}
                                    </p>
                                )}
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
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                placeholder="Warehouse A, Store #42"
                                className={`w-full px-4 py-2.5 bg-gray-50 border rounded-xl focus:bg-white focus:ring-2 outline-none transition ${errors.location ? 'border-red-400 focus:border-red-400 focus:ring-red-200' : 'border-gray-200 focus:border-purple-400 focus:ring-purple-200'
                                    }`}
                                disabled={isLoading}
                            />
                            {errors.location && (
                                <p className="mt-1 text-sm text-red-500">
                                    <i className="fas fa-exclamation-circle mr-1"></i>
                                    {errors.location}
                                </p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => navigate('/list-products')}
                                className="w-1/3 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-4 rounded-xl transition duration-200"
                                disabled={isLoading}
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-2/3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-4 rounded-xl transition duration-200 ease-in-out transform hover:scale-[1.02] ${isLoading ? 'opacity-75 cursor-not-allowed' : ''
                                    }`}
                            >
                                {isLoading ? (
                                    <>
                                        <i className="fas fa-spinner fa-spin mr-2"></i>
                                        Création en cours...
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-plus mr-2"></i>
                                        Ajouter le produit
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

export default AddProductForm;