import React, { useEffect, useState } from 'react';
import { instance } from '../config/axios';
import { useNavigate } from 'react-router-dom';

interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  totalAmount: number;
  taxAmount: number;
  status: string;
  paymentTerms: string;
  createdAt: string;
}

const ListeInvoice = () => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [invoicesPerPage] = useState(10);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await instance.get('/invoices/all');
      setInvoices(response.data);
    } catch (error: any) {
      console.error('Erreur lors de la récupération des factures', error);
      if (error.response?.status === 401) {
        setError('Vous devez être connecté pour voir les factures');
      } else {
        setError('Impossible de charger la liste des factures');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string, invoiceNumber: string) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer la facture "${invoiceNumber}" ?`)) {
      setIsDeleting(id);
      try {
        await instance.delete(`/invoices/${id}`);
        await fetchInvoices();
        alert('Facture supprimée avec succès');
      } catch (error: any) {
        console.error('Erreur lors de la suppression', error);
        if (error.response?.status === 401) {
          alert('Vous n\'avez pas les droits pour supprimer cette facture');
        } else {
          alert('Erreur lors de la suppression de la facture');
        }
      } finally {
        setIsDeleting(null);
      }
    }
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = searchTerm === '' || 
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === '' || invoice.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const indexOfLastInvoice = currentPage * invoicesPerPage;
  const indexOfFirstInvoice = indexOfLastInvoice - invoicesPerPage;
  const currentInvoices = filteredInvoices.slice(indexOfFirstInvoice, indexOfLastInvoice);
  const totalPages = Math.ceil(filteredInvoices.length / invoicesPerPage);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'paid':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">✅ Payée</span>;
      case 'pending':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">⏳ En attente</span>;
      case 'overdue':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">⚠️ En retard</span>;
      case 'cancelled':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">❌ Annulée</span>;
      default:
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                <i className="fas fa-file-invoice text-blue-600"></i>
                Liste des Factures
              </h1>
              <p className="text-gray-600">Gérez toutes vos factures</p>
            </div>
            <button
              onClick={() => navigate('/add-invoice')}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 flex items-center gap-2 shadow-md"
            >
              <i className="fas fa-plus"></i>
              Nouvelle facture
            </button>
          </div>
        </div>

        {/* Filtres */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <input
                type="text"
                placeholder="Rechercher par numéro de facture..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <div className="w-full md:w-64">
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="">Tous les statuts</option>
                <option value="pending">⏳ En attente</option>
                <option value="paid">✅ Payée</option>
                <option value="overdue">⚠️ En retard</option>
                <option value="cancelled">❌ Annulée</option>
              </select>
            </div>
          </div>
        </div>

        {/* État de chargement */}
        {isLoading && (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <i className="fas fa-spinner fa-spin text-4xl text-blue-600 mb-4"></i>
              <p className="text-gray-600">Chargement des factures...</p>
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
                onClick={fetchInvoices}
                className="text-red-700 hover:text-red-900 font-semibold"
              >
                Réessayer
              </button>
            </div>
          </div>
        )}

        {/* Liste des factures */}
        {!isLoading && !error && (
          <>
            {filteredInvoices.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <i className="fas fa-file-invoice text-6xl text-gray-300 mb-4"></i>
                {searchTerm || statusFilter ? (
                  <>
                    <p className="text-gray-500 text-lg mb-2">Aucune facture ne correspond à votre recherche</p>
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setStatusFilter('');
                      }}
                      className="text-blue-600 hover:text-blue-700 font-semibold"
                    >
                      Effacer les filtres
                    </button>
                  </>
                ) : (
                  <>
                    <p className="text-gray-500 text-lg mb-2">Aucune facture n'a été trouvée</p>
                    <button
                      onClick={() => navigate('/add-invoice')}
                      className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
                    >
                      Créer votre première facture
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
                            N° Facture
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Échéance
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Montant TTC
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Statut
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {currentInvoices.map((invoice) => (
                          <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {invoice.invoiceNumber}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">{formatDate(invoice.date)}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">{formatDate(invoice.dueDate)}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-semibold text-green-600">
                                {formatPrice(invoice.totalAmount)}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {getStatusBadge(invoice.status)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-3">
                                <button
                                  onClick={() => navigate(`/update-invoice/${invoice.id}`)}
                                  className="text-blue-600 hover:text-blue-900 transition-colors"
                                  title="Modifier"
                                >
                                  <i className="fas fa-edit text-lg"></i>
                                </button>
                                <button
                                  onClick={() => handleDelete(invoice.id, invoice.invoiceNumber)}
                                  disabled={isDeleting === invoice.id}
                                  className="text-red-600 hover:text-red-900 transition-colors disabled:opacity-50"
                                >
                                  {isDeleting === invoice.id ? (
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
                  <div className="flex justify-center mt-6">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 rounded border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                      >
                        <i className="fas fa-chevron-left"></i>
                      </button>
                      <span className="px-4 py-1 text-gray-600">
                        Page {currentPage} sur {totalPages}
                      </span>
                      <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 rounded border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                      >
                        <i className="fas fa-chevron-right"></i>
                      </button>
                    </div>
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

export default ListeInvoice;