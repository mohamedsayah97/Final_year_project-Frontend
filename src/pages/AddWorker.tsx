import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { instance } from '../config/axios';

const AddWorker = () => {
  const navigate = useNavigate();
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [city, setCity] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [department, setDepartment] = useState('');
  const [hireDate, setHireDate] = useState('');
  const [contractType, setContractType] = useState('');
  const [salary, setSalary] = useState('');
  const [hasCompanyCar, setHasCompanyCar] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState('');

  // Options pour les sélecteurs
  const departmentOptions = [
    { value: 'IT', label: '💻 IT', icon: '💻' },
    { value: 'HR', label: '👥 HR', icon: '👥' },
    { value: 'Sales', label: '📈 Sales', icon: '📈' },
    { value: 'Marketing', label: '📢 Marketing', icon: '📢' },
    { value: 'Finance', label: '💰 Finance', icon: '💰' },
  ];

  const contractTypeOptions = [
    { value: 'CDI', label: '📄 CDI (Permanent)', icon: '📄' },
    { value: 'CDD', label: '⏱️ CDD (Fixed Term)', icon: '⏱️' },
    { value: 'Stage', label: '🎓 Stage', icon: '🎓' },
    { value: 'Freelance', label: '💼 Freelance', icon: '💼' },
    { value: 'Intérim', label: '🤝 Intérim', icon: '🤝' },
    { value: 'Alternance', label: '🔄 Alternance', icon: '🔄' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage([]);
    setSuccessMessage('');

    try {
      const workerData = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        phoneNumber: phoneNumber || undefined,
        city: city,
        jobTitle: jobTitle,
        department: department,
        hireDate: hireDate,
        contractType: contractType,
        salary: parseFloat(salary),
        hasCompanyCar: hasCompanyCar,
      };

      console.log('Données envoyées:', workerData);
      const response = await instance.post('/workers/create', workerData);

      console.log('Employé ajouté avec succès', response.data);
      setSuccessMessage('Employé ajouté avec succès !');
      
      setTimeout(() => {
        navigate('/workers');
      }, 1500);
      
    } catch (error: any) {
      console.error('Erreur lors de l\'ajout de l\'employé', error);
      
      if (error.response?.data?.message) {
        const messages = error.response.data.message;
        if (Array.isArray(messages)) {
          setErrorMessage(messages);
        } else {
          setErrorMessage([messages]);
        }
      } else {
        setErrorMessage(['Une erreur est survenue lors de l\'ajout de l\'employé']);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-100 p-6">
      <div className="max-w-3xl mx-auto">
        
        {/* Bouton retour */}
        <div className="mb-4">
          <button
            onClick={() => navigate('/workers')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <i className="fas fa-arrow-left"></i>
            Retour à la liste
          </button>
        </div>
        
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-sky-600 px-6 py-4">
            <div className="flex items-center gap-3">
              <i className="fas fa-hard-hat text-white text-2xl"></i>
              <div>
                <h2 className="text-xl font-bold text-white">Add New Worker</h2>
                <p className="text-blue-100 text-sm">Register a new employee in your workforce</p>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <i className="fas fa-user text-gray-400 text-xs"></i>
                  First Name <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  placeholder="John" 
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition" 
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <i className="fas fa-user text-gray-400 text-xs"></i>
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  placeholder="Doe" 
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition" 
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <i className="fas fa-envelope text-gray-400 text-xs"></i>
                  Email <span className="text-red-500">*</span>
                </label>
                <input 
                  type="email" 
                  placeholder="john.doe@company.com" 
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <i className="fas fa-phone text-gray-400 text-xs"></i>
                  Phone Number
                </label>
                <input 
                  type="tel" 
                  placeholder="+1 234 567 8900" 
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition" 
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <i className="fas fa-city text-gray-400 text-xs"></i>
                  City <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  placeholder="New York" 
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition" 
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <i className="fas fa-briefcase text-gray-400 text-xs"></i>
                  Job Title <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  placeholder="Software Engineer" 
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition" 
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <i className="fas fa-building text-gray-400 text-xs"></i>
                  Department <span className="text-red-500">*</span>
                </label>
                <select 
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition cursor-pointer" 
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  required
                >
                  <option value="">Select department</option>
                  {departmentOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.icon} {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <i className="fas fa-calendar-alt text-gray-400 text-xs"></i>
                  Hire Date <span className="text-red-500">*</span>
                </label>
                <input 
                  type="date" 
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition" 
                  value={hireDate}
                  onChange={(e) => setHireDate(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <i className="fas fa-file-signature text-gray-400 text-xs"></i>
                  Contract Type <span className="text-red-500">*</span>
                </label>
                <select 
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition cursor-pointer" 
                  value={contractType}
                  onChange={(e) => setContractType(e.target.value)}
                  required
                >
                  <option value="">Select contract</option>
                  {contractTypeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.icon} {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <i className="fas fa-dollar-sign text-gray-400 text-xs"></i>
                  Salary <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input 
                    type="number" 
                    placeholder="50000" 
                    className="w-full pl-8 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition" 
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <i className="fas fa-car text-gray-400 text-xs"></i>
                Has Company Car
              </label>
              <div className="flex gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="hasCompanyCar" 
                    value="yes" 
                    checked={hasCompanyCar === true}
                    onChange={() => setHasCompanyCar(true)}
                    className="w-4 h-4 text-blue-600" 
                  />
                  <span className="text-gray-700">Yes</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="hasCompanyCar" 
                    value="no" 
                    checked={hasCompanyCar === false}
                    onChange={() => setHasCompanyCar(false)}
                    className="w-4 h-4 text-blue-600" 
                  />
                  <span className="text-gray-700">No</span>
                </label>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white font-semibold py-3 px-4 rounded-xl transition duration-200 ease-in-out transform hover:scale-[1.02] disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Adding Worker...
                </>
              ) : (
                <>
                  <i className="fas fa-user-plus mr-2"></i>
                  Add Worker
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddWorker;