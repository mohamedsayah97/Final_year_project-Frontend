import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { instance } from "../config/axios";

interface Supplier {
  id: string;
  supplier_name: string;
  email: string;
  phone?: string;
  address?: string;
  registration_number: string;
}

interface ApiError {
  response?: {
    status?: number;
    data?: {
      message?: string | string[];
    };
  };
  message?: string;
}

const UpdateSupplier = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [supplierName, setSupplierName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState("");

  // ✅ Déclarer fetchSupplier AVANT le useEffect
  const fetchSupplier = useCallback(async () => {
    if (!id) return;

    setIsFetching(true);
    setErrorMessage([]);
    try {
      const response = await instance.get(`/supplier/${id}`);
      const supplier: Supplier = response.data;

      setSupplierName(supplier.supplier_name);
      setEmail(supplier.email);
      setPhone(supplier.phone || "");
      setAddress(supplier.address || "");
      setRegistrationNumber(supplier.registration_number);
    } catch (err: unknown) {
      const error = err as ApiError;
      console.error("Erreur lors de la récupération du fournisseur", error);
      if (error.response?.status === 404) {
        setErrorMessage(["Fournisseur non trouvé"]);
      } else {
        setErrorMessage(["Impossible de charger les données du fournisseur"]);
      }
    } finally {
      setIsFetching(false);
    }
  }, [id]);

  // ✅ useEffect APRÈS la déclaration
  useEffect(() => {
    fetchSupplier();
  }, [fetchSupplier]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage([]);
    setSuccessMessage("");

    try {
      const response = await instance.put(`/supplier/${id}`, {
        supplier_name: supplierName,
        email: email,
        phone: phone || undefined,
        address: address || undefined,
        registration_number: registrationNumber,
      });

      console.warn("Supplier modifié avec succès", response.data);
      setSuccessMessage("Fournisseur modifié avec succès !");

      setTimeout(() => {
        navigate("/all-suppliers");
      }, 2000);
    } catch (err: unknown) {
      const error = err as ApiError;
      console.error("Erreur lors de la modification du fournisseur", error);

      if (error.response?.data?.message) {
        const messages = error.response.data.message;
        if (Array.isArray(messages)) {
          setErrorMessage(messages);
        } else {
          setErrorMessage([messages]);
        }
      } else {
        setErrorMessage([
          "Une erreur est survenue lors de la modification du fournisseur",
        ]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-100 p-6 flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-4xl text-amber-600 mb-4"></i>
          <p className="text-gray-600">Chargement des données...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-100 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-4">
          <button
            onClick={() => navigate("/all-suppliers")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <i className="fas fa-arrow-left"></i>
            Retour à la liste
          </button>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-amber-600 to-yellow-600 px-6 py-4">
            <div className="flex items-center gap-3">
              <i className="fas fa-edit text-white text-2xl"></i>
              <div>
                <h2 className="text-xl font-bold text-white">Edit Supplier</h2>
                <p className="text-amber-100 text-sm">
                  Modifier les informations du fournisseur
                </p>
              </div>
            </div>
          </div>

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

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <i className="fas fa-location-dot text-gray-400 text-xs"></i>
                Address{" "}
                <span className="text-gray-400 text-xs">(Optional)</span>
              </label>
              <textarea
                rows={2}
                placeholder="123 Business Park, City, Country"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-amber-400 focus:ring-2 focus:ring-amber-200 outline-none transition resize-none"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

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
                onClick={() => navigate("/all-suppliers")}
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
                    Updating Supplier...
                  </>
                ) : (
                  <>
                    <i className="fas fa-save mr-2"></i>
                    Update Supplier
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

export default UpdateSupplier;
