import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { instance } from "../config/axios";

interface Vehicle {
  id: string;
  registrationNumber: string;
  make: string;
  model: string;
  year: number;
  vehicleType: string;
  color: string;
  purchaseDate: string;
  assignedDate: string | null;
  currentDriverId: string | null;
  status: string;
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

const statusOptions = [
  { value: "available", label: "Available", icon: "🟢" },
  { value: "in-use", label: "In Use", icon: "🔵" },
  { value: "maintenance", label: "Under Maintenance", icon: "🟡" },
  { value: "out-of-service", label: "Out of Service", icon: "🔴" },
];

const vehicleTypeOptions = [
  { value: "SUV", label: "SUV", icon: "🚙" },
  { value: "Berline", label: "Berline", icon: "🚗" },
  { value: "Break", label: "Break", icon: "🚐" },
  { value: "Citadine", label: "Citadine", icon: "🚗" },
  { value: "Utilitaire", label: "Utilitaire", icon: "🚛" },
  { value: "Moto", label: "Moto", icon: "🏍️" },
];

const UpdateVehicules = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [registrationNumber, setRegistrationNumber] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [color, setColor] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [assignedDate, setAssignedDate] = useState("");
  const [currentDriverId, setCurrentDriverId] = useState("");
  const [status, setStatus] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState("");

  // ✅ Déclarer fetchVehicle AVANT le useEffect
  const fetchVehicle = useCallback(async () => {
    if (!id) return;

    setIsFetching(true);
    setErrorMessage([]);
    try {
      const response = await instance.get(`/vehicules/${id}`);
      const vehicle: Vehicle = response.data;

      setRegistrationNumber(vehicle.registrationNumber);
      setMake(vehicle.make);
      setModel(vehicle.model);
      setYear(vehicle.year.toString());
      setVehicleType(vehicle.vehicleType);
      setColor(vehicle.color);
      setPurchaseDate(vehicle.purchaseDate.split("T")[0]);
      setAssignedDate(
        vehicle.assignedDate ? vehicle.assignedDate.split("T")[0] : "",
      );
      setCurrentDriverId(vehicle.currentDriverId || "");
      setStatus(vehicle.status);
    } catch (err: unknown) {
      const error = err as ApiError;
      console.error("Erreur lors de la récupération du véhicule", error);
      if (error.response?.status === 404) {
        setErrorMessage(["Véhicule non trouvé"]);
      } else {
        setErrorMessage(["Impossible de charger les données du véhicule"]);
      }
    } finally {
      setIsFetching(false);
    }
  }, [id]);

  // ✅ useEffect APRÈS la déclaration
  useEffect(() => {
    fetchVehicle();
  }, [fetchVehicle]);

  const handleRegistrationChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setRegistrationNumber(e.target.value.toUpperCase());
    },
    [],
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage([]);
    setSuccessMessage("");

    const registrationRegex = /^[A-Z0-9-]+$/;
    if (!registrationRegex.test(registrationNumber)) {
      setErrorMessage([
        "Le numéro d'immatriculation ne doit contenir que des lettres majuscules, chiffres et tirets",
      ]);
      setIsLoading(false);
      return;
    }

    const currentYear = new Date().getFullYear();
    const yearNum = parseInt(year);
    if (yearNum < 1900 || yearNum > currentYear + 1) {
      setErrorMessage([
        `L'année doit être comprise entre 1900 et ${currentYear + 1}`,
      ]);
      setIsLoading(false);
      return;
    }

    if (
      currentDriverId &&
      !currentDriverId.match(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
      )
    ) {
      setErrorMessage(["L'ID du conducteur doit être un UUID valide"]);
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
        status: status,
      };

      console.warn("Données envoyées pour mise à jour:", vehicleData);
      const response = await instance.put(`/vehicules/${id}`, vehicleData);

      console.warn("Véhicule modifié avec succès", response.data);
      setSuccessMessage("Véhicule modifié avec succès !");

      setTimeout(() => {
        navigate("/liste-vehicules");
      }, 1500);
    } catch (err: unknown) {
      const error = err as ApiError;
      console.error("Erreur lors de la modification du véhicule", error);

      if (error.response?.data?.message) {
        const messages = error.response.data.message;
        if (Array.isArray(messages)) {
          setErrorMessage(messages);
        } else {
          setErrorMessage([messages]);
        }
      } else {
        setErrorMessage([
          "Une erreur est survenue lors de la modification du véhicule",
        ]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-6 flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-4xl text-green-600 mb-4"></i>
          <p className="text-gray-600">Chargement des données...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-4">
          <button
            onClick={() => navigate("/liste-vehicules")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <i className="fas fa-arrow-left"></i>
            Retour à la liste
          </button>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4">
            <div className="flex items-center gap-3">
              <i className="fas fa-edit text-white text-2xl"></i>
              <div>
                <h2 className="text-xl font-bold text-white">Edit Vehicle</h2>
                <p className="text-green-100 text-sm">
                  Modifier les informations du véhicule
                </p>
              </div>
            </div>
          </div>

          {successMessage && (
            <div className="mx-6 mt-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <i className="fas fa-check-circle"></i>
                  <span>{successMessage}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <i className="fas fa-spinner fa-spin"></i>
                  <span>Redirection vers la liste...</span>
                </div>
              </div>
            </div>
          )}

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
                  Assigned Date{" "}
                  <span className="text-gray-400 text-xs">(Optional)</span>
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-green-400 focus:ring-2 focus:ring-green-200 outline-none transition"
                  value={assignedDate}
                  onChange={(e) => setAssignedDate(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <i className="fas fa-id-badge text-gray-400 text-xs"></i>
                Current Driver ID{" "}
                <span className="text-gray-400 text-xs">
                  (Optional - UUID format)
                </span>
              </label>
              <input
                type="text"
                placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-green-400 focus:ring-2 focus:ring-green-200 outline-none transition"
                value={currentDriverId}
                onChange={(e) => setCurrentDriverId(e.target.value)}
              />
              <p className="text-xs text-gray-400 mt-1">
                Format: 8-4-4-4-12 caractères (ex:
                123e4567-e89b-12d3-a456-426614174000)
              </p>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <i className="fas fa-circle-info text-gray-400 text-xs"></i>
                Status <span className="text-red-500">*</span>
              </label>
              <select
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-green-400 focus:ring-2 focus:ring-green-200 outline-none transition cursor-pointer"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                required
              >
                <option value="">Select status</option>
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.icon} {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => navigate("/liste-vehicules")}
                className="w-1/3 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-4 rounded-xl transition duration-200"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="w-2/3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 px-4 rounded-xl transition duration-200 ease-in-out transform hover:scale-[1.02] disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Updating Vehicle...
                  </>
                ) : (
                  <>
                    <i className="fas fa-save mr-2"></i>
                    Update Vehicle
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

export default UpdateVehicules;
