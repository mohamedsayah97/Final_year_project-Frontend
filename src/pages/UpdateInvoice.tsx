import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { instance } from '../config/axios';

interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  totalAmount: number;
  taxAmount: number;
  status: string;
  paymentTerms: string;
}

const UpdateInvoice = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [date, setDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [taxAmount, setTaxAmount] = useState('');
  const [status, setStatus] = useState('');
  const [paymentTerms, setPaymentTerms] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchInvoice();
  }, [id]);

  const fetchInvoice = async () => {
    setIsFetching(true);
    setErrorMessage([]);
    try {
      const response = await instance.get(`/invoices/${id}`);
      const invoice: Invoice = response.data;
      
      setInvoiceNumber(invoice.invoiceNumber);
      setDate(invoice.date.split('T')[0]);
      setDueDate(invoice.dueDate.split('T')[0]);
      setTotalAmount(invoice.totalAmount.toString());
      setTaxAmount(invoice.taxAmount.toString());
      setStatus(invoice.status);
      setPaymentTerms(invoice.paymentTerms);
      
    } catch (error: any) {
      console.error('Erreur lors de la récupération de la facture', error);
      if (error.response?.status === 404) {
        setErrorMessage(['Facture non trouvée']);
      } else if (error.response?.status === 401) {
        setErrorMessage(['Vous devez être connecté pour modifier une facture']);
      } else {
        setErrorMessage(['Impossible de charger les données de la facture']);
      }
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
      const invoiceData = {
        date,
        dueDate,
        totalAmount: parseFloat(totalAmount),
        taxAmount: parseFloat(taxAmount),
        status,
        paymentTerms,
      };

      await instance.put(`/invoices/${id}`, invoiceData);

      setSuccessMessage('Facture modifiée avec succès !');
      
      setTimeout(() => {
        navigate('/invoices');
      }, 1500);
      
    } catch (error: any) {
      console.error('Erreur lors de la modification de la facture', error);
      
      if (error.response?.data?.message) {
        const messages = error.response.data.message;
        setErrorMessage(Array.isArray(messages) ? messages : [messages]);
      } else if (error.response?.status === 401) {
        setErrorMessage(['Vous devez être connecté pour modifier une facture']);
      } else if (error.response?.status === 403) {
        setErrorMessage(['Vous n\'avez pas les droits pour modifier cette facture']);
      } else {
        setErrorMessage(['Une erreur est survenue lors de la modification de la facture']);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 p-6 flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-4xl text-blue-600 mb-4"></i>
          <p className="text-gray-600">Chargement des données...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 p-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Bouton retour */}
        <div className="mb-4">
          <button
            onClick={() => navigate('/invoices')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <i className="fas fa-arrow-left"></i>
            Retour à la liste
          </button>
        </div>
        
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-xl">
                <i className="fas fa-edit text-white text-xl"></i>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Modifier la Facture</h2>
                <p className="text-blue-100 text-sm">
                  Modifier les informations de la facture
                </p>
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
                Erreurs :
              </div>
              <ul className="list-disc list-inside text-sm">
                {errorMessage.map((msg, index) => (
                  <li key={index}>{msg}</li>
                ))}
              </ul>
            </div>
          )}

          <form className="p-6 space-y-5" onSubmit={handleSubmit}>
            {/* Numéro de facture (non modifiable) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Numéro de Facture
              </label>
              <input
                type="text"
                className="w-full px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-xl outline-none cursor-not-allowed"
                value={invoiceNumber}
                readOnly
              />
            </div>

            {/* Date et Date d'échéance */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date de la facture <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <i className="fas fa-calendar-alt absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                  <input
                    type="date"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date d'échéance <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <i className="fas fa-calendar-check absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                  <input
                    type="date"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>

            {/* Montant total et Taxes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Montant Total (€) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <i className="fas fa-euro-sign absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition"
                    value={totalAmount}
                    onChange={(e) => setTotalAmount(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Montant des Taxes (€) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <i className="fas fa-percent absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition"
                    value={taxAmount}
                    onChange={(e) => setTaxAmount(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>

            {/* Statut et Conditions de paiement */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Statut <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <i className="fas fa-circle-info absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                  <select
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition appearance-none"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    required
                    disabled={isLoading}
                  >
                    <option value="">Sélectionner un statut</option>
                    <option value="pending">⏳ En attente</option>
                    <option value="paid">✅ Payée</option>
                    <option value="overdue">⚠️ En retard</option>
                    <option value="cancelled">❌ Annulée</option>
                  </select>
                  <i className="fas fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Conditions de paiement <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <i className="fas fa-clock absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                  <select
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition appearance-none"
                    value={paymentTerms}
                    onChange={(e) => setPaymentTerms(e.target.value)}
                    required
                    disabled={isLoading}
                  >
                    <option value="">Sélectionner les conditions</option>
                    <option value="immediate">💵 Paiement immédiat</option>
                    <option value="net15">📅 Net 15 jours</option>
                    <option value="net30">📅 Net 30 jours</option>
                    <option value="net60">📅 Net 60 jours</option>
                  </select>
                  <i className="fas fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                </div>
              </div>
            </div>

            {/* Boutons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => navigate('/invoices')}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-xl transition duration-200"
                disabled={isLoading}
              >
                <i className="fas fa-times mr-2"></i>
                Annuler
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-3 px-4 rounded-xl transition duration-200 transform hover:scale-[1.02] disabled:opacity-75 disabled:cursor-not-allowed"
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

export default UpdateInvoice;