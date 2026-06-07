import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { instance } from '../config/axios';

interface Worker {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  city: string;
  jobTitle: string;
  department: string;
  hireDate: string;
  contractType: string;
  salary: number;
  hasCompanyCar: boolean;
}

const UpdateWorker = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
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
  const [isFetching, setIsFetching] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState('');

  const departmentOptions = [
    { value: 'IT', label: '💻 IT' },
    { value: 'HR', label: '👥 HR' },
    { value: 'Sales', label: '📈 Sales' },
    { value: 'Marketing', label: '📢 Marketing' },
    { value: 'Finance', label: '💰 Finance' },
  ];

  const contractTypeOptions = [
    { value: 'CDI', label: '📄 CDI' },
    { value: 'CDD', label: '⏱️ CDD' },
    { value: 'Stage', label: '🎓 Stage' },
    { value: 'Freelance', label: '💼 Freelance' },
    { value: 'Intérim', label: '🤝 Intérim' },
    { value: 'Alternance', label: '🔄 Alternance' },
  ];

  useEffect(() => {
    fetchWorker();
  }, [id]);

  const fetchWorker = async () => {
    setIsFetching(true);
    try {
      const response = await instance.get(`/workers/${id}`);
      const worker: Worker = response.data;
      
      setFirstName(worker.firstName);
      setLastName(worker.lastName);
      setEmail(worker.email);
      setPhoneNumber(worker.phoneNumber || '');
      setCity(worker.city);
      setJobTitle(worker.jobTitle);
      setDepartment(worker.department);
      setHireDate(worker.hireDate.split('T')[0]);
      setContractType(worker.contractType);
      setSalary(worker.salary.toString());
      setHasCompanyCar(worker.hasCompanyCar);
      
    } catch (error: any) {
      console.error('Erreur lors de la récupération', error);
      setErrorMessage(['Impossible de charger les données']);
    } finally {
      setIsFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage([]);
    setSuccessMessage('');

    try {
      const workerData = {
        firstName, lastName, email, phoneNumber: phoneNumber || undefined,
        city, jobTitle, department, hireDate, contractType,
        salary: parseFloat(salary), hasCompanyCar,
      };

      await instance.put(`/workers/${id}`, workerData);
      setSuccessMessage('Employé modifié avec succès !');
      
      setTimeout(() => navigate('/workers'), 1500);
      
    } catch (error: any) {
      const messages = error.response?.data?.message;
      setErrorMessage(Array.isArray(messages) ? messages : [messages || 'Erreur lors de la modification']);
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-100 p-6 flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-4xl text-blue-600 mb-4"></i>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-100 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-4">
          <button onClick={() => navigate('/workers')} className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
            <i className="fas fa-arrow-left"></i> Retour à la liste
          </button>
        </div>
        
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-sky-600 px-6 py-4">
            <div className="flex items-center gap-3">
              <i className="fas fa-edit text-white text-2xl"></i>
              <div>
                <h2 className="text-xl font-bold text-white">Edit Worker</h2>
                <p className="text-blue-100 text-sm">Modifier les informations de l'employé</p>
              </div>
            </div>
          </div>

          {successMessage && (
            <div className="mx-6 mt-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
              <div className="flex items-center justify-between">
                <span>{successMessage}</span>
                <i className="fas fa-spinner fa-spin"></i>
              </div>
            </div>
          )}

          {errorMessage.length > 0 && (
            <div className="mx-6 mt-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
              <ul className="list-disc list-inside text-sm">
                {errorMessage.map((msg, i) => <li key={i}>{msg}</li>)}
              </ul>
            </div>
          )}

          <form className="p-6 space-y-5" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input type="text" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-200 outline-none transition" 
                  value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input type="text" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-200 outline-none transition" 
                  value={lastName} onChange={(e) => setLastName(e.target.value)} required />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input type="email" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-200 outline-none transition" 
                  value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  Phone Number
                </label>
                <input type="tel" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-200 outline-none transition" 
                  value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  City <span className="text-red-500">*</span>
                </label>
                <input type="text" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-200 outline-none transition" 
                  value={city} onChange={(e) => setCity(e.target.value)} required />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  Job Title <span className="text-red-500">*</span>
                </label>
                <input type="text" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-200 outline-none transition" 
                  value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} required />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  Department <span className="text-red-500">*</span>
                </label>
                <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-200 outline-none transition"
                  value={department} onChange={(e) => setDepartment(e.target.value)} required>
                  <option value="">Select department</option>
                  {departmentOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  Hire Date <span className="text-red-500">*</span>
                </label>
                <input type="date" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-200 outline-none transition"
                  value={hireDate} onChange={(e) => setHireDate(e.target.value)} required />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  Contract Type <span className="text-red-500">*</span>
                </label>
                <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-200 outline-none transition"
                  value={contractType} onChange={(e) => setContractType(e.target.value)} required>
                  <option value="">Select contract</option>
                  {contractTypeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  Salary <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
                  <input type="number" placeholder="50000" className="w-full pl-8 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-200 outline-none transition"
                    value={salary} onChange={(e) => setSalary(e.target.value)} required />
                </div>
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                Has Company Car
              </label>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="hasCompanyCar" checked={hasCompanyCar === true}
                    onChange={() => setHasCompanyCar(true)} className="w-4 h-4 text-blue-600" />
                  <span>Yes</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="hasCompanyCar" checked={hasCompanyCar === false}
                    onChange={() => setHasCompanyCar(false)} className="w-4 h-4 text-blue-600" />
                  <span>No</span>
                </label>
              </div>
            </div>

            <div className="flex gap-3">
              <button type="button" onClick={() => navigate('/workers')}
                className="w-1/3 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-4 rounded-xl">
                Annuler
              </button>
              <button type="submit" disabled={isLoading}
                className="w-2/3 bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white font-semibold py-3 px-4 rounded-xl disabled:opacity-75">
                {isLoading ? <><i className="fas fa-spinner fa-spin mr-2"></i>Updating...</> : <><i className="fas fa-save mr-2"></i>Update Worker</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateWorker;