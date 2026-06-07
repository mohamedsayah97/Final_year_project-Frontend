import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { instance } from '../config/axios';

const AddSupplier = () => {
  const navigate = useNavigate();
  const [supplierName, setSupplierName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage([]);
    setSuccessMessage('');

    try {
      const response = await instance.post('/supplier/create', {
        supplier_name: supplierName,
        email: email,
        phone: phone || undefined,
        address: address || undefined,
        registration_number: registrationNumber,
      });

      console.log('Supplier ajouté avec succès', response.data);
      setSuccessMessage('Fournisseur ajouté avec succès !');
      
      // Rediriger vers la liste des fournisseurs après 2 secondes
      setTimeout(() => {
        navigate('/all-suppliers');
      }, 2000);
      
    } catch (error: any) {
      console.error('Erreur lors de l\'ajout du fournisseur', error);
      
      if (error.response?.data?.message) {
        const messages = error.response.data.message;
        if (Array.isArray(messages)) {
          setErrorMessage(messages);
        } else {
          setErrorMessage([messages]);
        }
      } else {
        setErrorMessage(['Une erreur est survenue lors de l\'ajout du fournisseur']);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-100 p-6">
      <div className="max-w-3xl mx-auto">
        
        {/* Bouton retour */}
        <div className="mb-4">
          <button
            onClick={() => navigate('/all-suppliers')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <i className="fas fa-arrow-left"></i>
            Retour à la liste
          </button>
        </div>
        
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-amber-600 to-yellow-600 px-6 py-4">
            <div className="flex items-center gap-3">
              <i className="fas fa-truck text-white text-2xl"></i>
              <div>
                <h2 className="text-xl font-bold text-white">Add New Supplier</h2>
                <p className="text-amber-100 text-sm">Register a new supplier in your system</p>
              </div>
            </div>
          </div>

          {/* Message de succès */}
          {successMessage && (
            <div className="mx-6 mt-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <i className="fas fa-check-circle mr-2"></i>
                  <span>{successMessage}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <i className="fas fa-spinner fa-spin"></i>
                  <span>Redirection...</span>
                </div>
              </div>
            </div>
          )}

          {/* Affichage des erreurs */}
          {errorMessage.length > 0 && (
            <div className="mx-6 mt-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
              <div className="font-semibold mb-1 flex items-center">
                <i className="fas fa-exclamation-circle mr-2"></i>
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
            {/* Supplier Name - Requis */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <i className="fas fa-building text-gray-400 text-xs"></i>
                Supplier Name <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                placeholder="e.g., Tech Distributors Inc." 
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-amber-400 focus:ring-2 focus:ring-amber-200 outline-none transition" 
                value={supplierName}
                onChange={(e) => setSupplierName(e.target.value)}
                required
              />
            </div>

            {/* Email - Requis */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <i className="fas fa-envelope text-gray-400 text-xs"></i>
                Email <span className="text-red-500">*</span>
              </label>
              <input 
                type="email" 
                placeholder="supplier@company.com" 
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-amber-400 focus:ring-2 focus:ring-amber-200 outline-none transition" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Phone - Optionnel */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <i className="fas fa-phone text-gray-400 text-xs"></i>
                Phone <span className="text-gray-400 text-xs">(Optional)</span>
              </label>
              <input 
                type="tel" 
                placeholder="+1 234 567 8900" 
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-amber-400 focus:ring-2 focus:ring-amber-200 outline-none transition" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            {/* Address - Optionnel */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <i className="fas fa-location-dot text-gray-400 text-xs"></i>
                Address <span className="text-gray-400 text-xs">(Optional)</span>
              </label>
              <textarea 
                rows={2} 
                placeholder="123 Business Park, City, Country" 
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-amber-400 focus:ring-2 focus:ring-amber-200 outline-none transition resize-none" 
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            {/* Registration Number - Requis */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <i className="fas fa-id-card text-gray-400 text-xs"></i>
                Registration Number <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                placeholder="e.g., VAT123456789" 
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-amber-400 focus:ring-2 focus:ring-amber-200 outline-none transition" 
                value={registrationNumber}
                onChange={(e) => setRegistrationNumber(e.target.value)}
                required
              />
              <p className="text-xs text-gray-400 mt-1">
                Numéro d'enregistrement unique du fournisseur
              </p>
            </div>

            <div className="flex gap-3">
              <button 
                type="button"
                onClick={() => navigate('/all-suppliers')}
                className="w-1/3 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-4 rounded-xl transition duration-200"
              >
                Annuler
              </button>
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-2/3 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white font-semibold py-3 px-4 rounded-xl transition duration-200 ease-in-out transform hover:scale-[1.02] disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Adding Supplier...
                  </>
                ) : (
                  <>
                    <i className="fas fa-truck mr-2"></i>
                    Add Supplier
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

export default AddSupplier;