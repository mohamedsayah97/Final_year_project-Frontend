import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { instance } from '../config/axios';

const AddVehicle = () => {
  const navigate = useNavigate();
  
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [color, setColor] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [assignedDate, setAssignedDate] = useState('');
  const [currentDriverId, setCurrentDriverId] = useState('');
  const [status, setStatus] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState('');

  // Status options selon le DTO
  const statusOptions = [
    { value: 'available', label: 'Available', icon: '🟢' },
    { value: 'in-use', label: 'In Use', icon: '🔵' },
    { value: 'maintenance', label: 'Under Maintenance', icon: '🟡' },
    { value: 'out-of-service', label: 'Out of Service', icon: '🔴' },
  ];

  // Vehicle type options selon le DTO
  const vehicleTypeOptions = [
    { value: 'SUV', label: 'SUV', icon: '🚙' },
    { value: 'Berline', label: 'Berline', icon: '🚗' },
    { value: 'Break', label: 'Break', icon: '🚐' },
    { value: 'Citadine', label: 'Citadine', icon: '🚗' },
    { value: 'Utilitaire', label: 'Utilitaire', icon: '🚛' },
    { value: 'Moto', label: 'Moto', icon: '🏍️' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage([]);
    setSuccessMessage('');

    // Validation supplémentaire pour le numéro d'immatriculation
    const registrationRegex = /^[A-Z0-9-]+$/;
    if (!registrationRegex.test(registrationNumber)) {
      setErrorMessage(['Le numéro d\'immatriculation ne doit contenir que des lettres majuscules, chiffres et tirets']);
      setIsLoading(false);
      return;
    }

    // Validation de l'année
    const currentYear = new Date().getFullYear();
    const yearNum = parseInt(year);
    if (yearNum < 1900 || yearNum > currentYear + 1) {
      setErrorMessage([`L'année doit être comprise entre 1900 et ${currentYear + 1}`]);
      setIsLoading(false);
      return;
    }

    // Si currentDriverId est fourni, vérifier que c'est un UUID valide
    if (currentDriverId && !currentDriverId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
      setErrorMessage(['L\'ID du conducteur doit être un UUID valide']);
      setIsLoading(false);
      return;
    }

    try {
      const vehicleData = {
        registrationNumber: registrationNumber,
        make: make,
        model: model,
        year: yearNum,
        vehicleType: vehicleType,
        color: color,
        purchaseDate: purchaseDate,
        assignedDate: assignedDate || undefined,
        currentDriverId: currentDriverId || undefined,
        status: status || 'available',
      };

      console.log('Données envoyées:', vehicleData);
      const response = await instance.post('/vehicules/create', vehicleData);

      console.log('Véhicule ajouté avec succès', response.data);
      
      // Redirection vers la liste des véhicules après 1.5 secondes
      setTimeout(() => {
        navigate('/liste-vehicules');
      }, 1500);
      
    } catch (error: any) {
      console.error('Erreur lors de l\'ajout du véhicule', error);
      
      if (error.response?.data?.message) {
        const messages = error.response.data.message;
        if (Array.isArray(messages)) {
          setErrorMessage(messages);
        } else {
          setErrorMessage([messages]);
        }
      } else {
        setErrorMessage(['Une erreur est survenue lors de l\'ajout du véhicule']);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Mettre à jour le numéro d'immatriculation en majuscules
  const handleRegistrationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegistrationNumber(e.target.value.toUpperCase());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-6">
      <div className="max-w-3xl mx-auto">
        
        {/* Bouton retour */}
        <div className="mb-4">
          <button
            onClick={() => navigate('/liste-vehicules')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <i className="fas fa-arrow-left"></i>
            Retour à la liste
          </button>
        </div>
        
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4">
            <div className="flex items-center gap-3">
              <i className="fas fa-car text-white text-2xl"></i>
              <div>
                <h2 className="text-xl font-bold text-white">Add New Vehicle</h2>
                <p className="text-green-100 text-sm">Register a new vehicle in your fleet</p>
              </div>
            </div>
          </div>

          {/* Message de succès avec indicateur de redirection */}
          {successMessage && (
            <div className="mx-6 mt-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <i className="fas fa-check-circle"></i>
                  <span>Véhicule ajouté avec succès !</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <i className="fas fa-spinner fa-spin"></i>
                  <span>Redirection vers la liste...</span>
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
            {/* Registration Number */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <i className="fas fa-id-card text-gray-400 text-xs"></i>
                Registration Number <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                placeholder="ABC-1234" 
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-green-400 focus:ring-2 focus:ring-green-200 outline-none transition" 
                value={registrationNumber}
                onChange={handleRegistrationChange}
                required
              />
              <p className="text-xs text-gray-400 mt-1">
                Utilisez uniquement des lettres majuscules, chiffres et tirets
              </p>
            </div>

            {/* Make & Model */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <i className="fas fa-industry text-gray-400 text-xs"></i>
                  Make (Brand) <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  placeholder="Toyota" 
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-green-400 focus:ring-2 focus:ring-green-200 outline-none transition" 
                  value={make} 
                  onChange={(e) => setMake(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <i className="fas fa-car-side text-gray-400 text-xs"></i>
                  Model <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  placeholder="Camry" 
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-green-400 focus:ring-2 focus:ring-green-200 outline-none transition" 
                  value={model} 
                  onChange={(e) => setModel(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Year & Vehicle Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <i className="fas fa-calendar-alt text-gray-400 text-xs"></i>
                  Year <span className="text-red-500">*</span>
                </label>
                <input 
                  type="number" 
                  placeholder="2024" 
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-green-400 focus:ring-2 focus:ring-green-200 outline-none transition" 
                  value={year} 
                  onChange={(e) => setYear(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <i className="fas fa-truck text-gray-400 text-xs"></i>
                  Vehicle Type <span className="text-red-500">*</span>
                </label>
                <select 
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-green-400 focus:ring-2 focus:ring-green-200 outline-none transition cursor-pointer" 
                  value={vehicleType} 
                  onChange={(e) => setVehicleType(e.target.value)}
                  required
                >
                  <option value="">Select type</option>
                  {vehicleTypeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.icon} {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Color */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <i className="fas fa-palette text-gray-400 text-xs"></i>
                Color <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-3">
                <input 
                  type="text" 
                  placeholder="Red" 
                  className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-green-400 focus:ring-2 focus:ring-green-200 outline-none transition" 
                  value={color} 
                  onChange={(e) => setColor(e.target.value)}
                  required
                />
                <input 
                  type="color" 
                  className="w-14 h-11 rounded-xl border border-gray-200 cursor-pointer" 
                  value={color} 
                  onChange={(e) => setColor(e.target.value)} 
                />
              </div>
            </div>

            {/* Purchase Date & Assigned Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <i className="fas fa-calendar-plus text-gray-400 text-xs"></i>
                  Purchase Date <span className="text-red-500">*</span>
                </label>
                <input 
                  type="date" 
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-green-400 focus:ring-2 focus:ring-green-200 outline-none transition" 
                  value={purchaseDate} 
                  onChange={(e) => setPurchaseDate(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <i className="fas fa-calendar-check text-gray-400 text-xs"></i>
                  Assigned Date <span className="text-gray-400 text-xs">(Optional)</span>
                </label>
                <input 
                  type="date" 
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-green-400 focus:ring-2 focus:ring-green-200 outline-none transition" 
                  value={assignedDate} 
                  onChange={(e) => setAssignedDate(e.target.value)}
                />
              </div>
            </div>

            {/* Current Driver ID */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <i className="fas fa-id-badge text-gray-400 text-xs"></i>
                Current Driver ID <span className="text-gray-400 text-xs">(Optional - UUID format)</span>
              </label>
              <input 
                type="text" 
                placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" 
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-green-400 focus:ring-2 focus:ring-green-200 outline-none transition" 
                value={currentDriverId} 
                onChange={(e) => setCurrentDriverId(e.target.value)}
              />
              <p className="text-xs text-gray-400 mt-1">
                Format: 8-4-4-4-12 caractères (ex: 123e4567-e89b-12d3-a456-426614174000)
              </p>
            </div>

            {/* Status */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <i className="fas fa-circle-info text-gray-400 text-xs"></i>
                Status <span className="text-gray-400 text-xs">(Optional - Default: available)</span>
              </label>
              <select 
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-green-400 focus:ring-2 focus:ring-green-200 outline-none transition cursor-pointer" 
                value={status} 
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="">Default (available)</option>
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.icon} {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 px-4 rounded-xl transition duration-200 ease-in-out transform hover:scale-[1.02] disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Adding Vehicle...
                </>
              ) : (
                <>
                  <i className="fas fa-car mr-2"></i>
                  Add Vehicle
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddVehicle;