import React, { useEffect, useState, useCallback } from "react";
import { instance } from "../config/axios";
import { useNavigate } from "react-router-dom";
import DashboardCustomer from "./DashboardCustomer";
import ProductDashboard from "./ProductDashboard";
import WorkerDashboard from "./WorkerDashboard";

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
  createdAt?: string;
  updatedAt?: string;
}

interface ApiError {
  response?: {
    status?: number;
    data?: unknown;
  };
  message?: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [_vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [availableVehicles, setAvailableVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    inUse: 0,
    maintenance: 0,
    outOfService: 0,
  });

  const statusOptions = [
    {
      value: "available",
      label: "Disponible",
      icon: "🟢",
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      value: "in-use",
      label: "En utilisation",
      icon: "🔵",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      value: "maintenance",
      label: "En maintenance",
      icon: "🟡",
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      value: "out-of-service",
      label: "Hors service",
      icon: "🔴",
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
  ];

  const vehicleTypeIcons: { [key: string]: string } = {
    SUV: "🚙",
    Berline: "🚗",
    Break: "🚐",
    Citadine: "🚗",
    Utilitaire: "🚛",
    Moto: "🏍️",
  };

  // ✅ Déclarer fetchVehicles AVANT le useEffect
  const fetchVehicles = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await instance.get("/vehicules/all");
      const allVehicles = response.data;
      setVehicles(allVehicles);

      const available = allVehicles.filter(
        (v: Vehicle) => v.status === "available",
      );
      setAvailableVehicles(available);

      const newStats = {
        total: allVehicles.length,
        available: allVehicles.filter((v: Vehicle) => v.status === "available")
          .length,
        inUse: allVehicles.filter((v: Vehicle) => v.status === "in-use").length,
        maintenance: allVehicles.filter(
          (v: Vehicle) => v.status === "maintenance",
        ).length,
        outOfService: allVehicles.filter(
          (v: Vehicle) => v.status === "out-of-service",
        ).length,
      };
      setStats(newStats);
    } catch (err: unknown) {
      const error = err as ApiError;
      console.error("Erreur lors de la récupération des véhicules", error);
      setError("Impossible de charger les données du dashboard");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ✅ useEffect APRÈS la déclaration
  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  const getStatusInfo = useCallback(
    (status: string) => {
      const option = statusOptions.find((opt) => opt.value === status);
      return (
        option || {
          icon: "⚪",
          label: status,
          color: "text-gray-600",
          bgColor: "bg-gray-100",
        }
      );
    },
    [statusOptions],
  );

  const getVehicleTypeIcon = useCallback(
    (type: string) => {
      return vehicleTypeIcons[type] || "🚗";
    },
    [vehicleTypeIcons],
  );

  const handleEdit = useCallback(
    (id: string) => {
      navigate(`/update-vehicle/${id}`);
    },
    [navigate],
  );

  const handleAddVehicle = useCallback(() => {
    navigate("/add-vehicle");
  }, [navigate]);

  const handleViewAll = useCallback(() => {
    navigate("/liste-vehicules");
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-5xl text-green-600 mb-4"></i>
          <p className="text-gray-600 text-lg">Chargement du dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center gap-3">
                <i className="fas fa-chart-line text-green-600"></i>
                Dashboard Global
              </h1>
              <p className="text-gray-600 text-lg">
                Bienvenue dans votre espace utilisateur. Voici un aperçu global
                de votre entreprise.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleViewAll}
                className="bg-white hover:bg-gray-50 text-gray-700 font-semibold py-2 px-4 rounded-lg transition duration-200 flex items-center gap-2 shadow-md border border-gray-200"
              >
                <i className="fas fa-list"></i>
                Voir tous
              </button>
              <button
                onClick={handleAddVehicle}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 flex items-center gap-2 shadow-md"
              >
                <i className="fas fa-plus"></i>
                Ajouter un véhicule
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <i className="fas fa-car text-2xl text-blue-600"></i>
              </div>
              <span className="text-3xl font-bold text-gray-800">
                {stats.total}
              </span>
            </div>
            <h3 className="text-gray-600 font-medium">Total véhicules</h3>
            <p className="text-sm text-gray-400 mt-1">Flotte complète</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border-l-4 border-green-500">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <i className="fas fa-check-circle text-2xl text-green-600"></i>
              </div>
              <span className="text-3xl font-bold text-green-600">
                {stats.available}
              </span>
            </div>
            <h3 className="text-gray-600 font-medium">Disponibles</h3>
            <p className="text-sm text-gray-400 mt-1">Prêts à rouler</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border-l-4 border-blue-500">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <i className="fas fa-road text-2xl text-blue-600"></i>
              </div>
              <span className="text-3xl font-bold text-blue-600">
                {stats.inUse}
              </span>
            </div>
            <h3 className="text-gray-600 font-medium">En utilisation</h3>
            <p className="text-sm text-gray-400 mt-1">Actuellement en route</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-100 rounded-xl">
                <i className="fas fa-wrench text-2xl text-yellow-600"></i>
              </div>
              <span className="text-3xl font-bold text-yellow-600">
                {stats.maintenance}
              </span>
            </div>
            <h3 className="text-gray-600 font-medium">En maintenance</h3>
            <p className="text-sm text-gray-400 mt-1">En réparation</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border-l-4 border-red-500">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-100 rounded-xl">
                <i className="fas fa-ban text-2xl text-red-600"></i>
              </div>
              <span className="text-3xl font-bold text-red-600">
                {stats.outOfService}
              </span>
            </div>
            <h3 className="text-gray-600 font-medium">Hors service</h3>
            <p className="text-sm text-gray-400 mt-1">Indisponibles</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <i className="fas fa-car-side"></i>
                  Véhicules disponibles ({availableVehicles.length})
                </h2>
                <p className="text-green-100 text-sm mt-1">
                  Ces véhicules sont prêts à être utilisés
                </p>
              </div>
              {availableVehicles.length > 3 && (
                <button
                  onClick={handleViewAll}
                  className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors text-sm font-semibold"
                >
                  Voir tous
                </button>
              )}
            </div>
          </div>

          {error && (
            <div className="m-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
              <div className="flex items-center gap-2">
                <i className="fas fa-exclamation-circle"></i>
                <span>{error}</span>
                <button
                  onClick={fetchVehicles}
                  className="ml-auto text-red-700 hover:text-red-900 font-semibold"
                >
                  Réessayer
                </button>
              </div>
            </div>
          )}

          {!error && availableVehicles.length === 0 && (
            <div className="p-12 text-center">
              <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-car text-5xl text-gray-400"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Aucun véhicule disponible
              </h3>
              <p className="text-gray-500 mb-6">
                Aucun véhicule n'est actuellement disponible.
              </p>
              {stats.total === 0 ? (
                <button
                  onClick={handleAddVehicle}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-200"
                >
                  Ajouter votre premier véhicule
                </button>
              ) : (
                <button
                  onClick={handleViewAll}
                  className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-200"
                >
                  Voir tous les véhicules
                </button>
              )}
            </div>
          )}

          {!error && availableVehicles.length > 0 && (
            <>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {availableVehicles.slice(0, 6).map((vehicle) => {
                    const statusInfo = getStatusInfo(vehicle.status);
                    return (
                      <div
                        key={vehicle.id}
                        className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 group"
                      >
                        <div className={`h-2 ${statusInfo.bgColor}`}></div>

                        <div className="p-5">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-2xl">
                                  {getVehicleTypeIcon(vehicle.vehicleType)}
                                </span>
                                <h3 className="font-bold text-gray-800 text-lg">
                                  {vehicle.make} {vehicle.model}
                                </h3>
                              </div>
                              <p className="text-sm text-gray-500 font-mono">
                                {vehicle.registrationNumber}
                              </p>
                            </div>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-semibold ${statusInfo.bgColor} ${statusInfo.color}`}
                            >
                              {statusInfo.icon} {statusInfo.label}
                            </span>
                          </div>

                          <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <i className="fas fa-calendar-alt w-4 text-gray-400"></i>
                              <span>Année: {vehicle.year}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <i className="fas fa-palette w-4 text-gray-400"></i>
                              <div className="flex items-center gap-2">
                                <span>Couleur: {vehicle.color}</span>
                                <div
                                  className="w-4 h-4 rounded-full border border-gray-300"
                                  style={{
                                    backgroundColor:
                                      vehicle.color.toLowerCase(),
                                  }}
                                ></div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <i className="fas fa-calendar-plus w-4 text-gray-400"></i>
                              <span>
                                Achat:{" "}
                                {new Date(
                                  vehicle.purchaseDate,
                                ).toLocaleDateString("fr-FR")}
                              </span>
                            </div>
                          </div>

                          <div className="flex gap-3 pt-4 border-t border-gray-100">
                            <button
                              onClick={() => handleEdit(vehicle.id)}
                              className="flex-1 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2"
                            >
                              <i className="fas fa-edit"></i>
                              Modifier
                            </button>
                            <button
                              onClick={handleAddVehicle}
                              className="flex-1 px-3 py-2 bg-green-50 hover:bg-green-100 text-green-600 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2"
                            >
                              <i className="fas fa-plus"></i>
                              Nouveau
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {availableVehicles.length > 6 && (
                <div className="px-6 pb-6 text-center">
                  <button
                    onClick={handleViewAll}
                    className="text-green-600 hover:text-green-700 font-semibold flex items-center justify-center gap-2 mx-auto"
                  >
                    <span>
                      Voir les {availableVehicles.length - 6} autres véhicules
                      disponibles
                    </span>
                    <i className="fas fa-arrow-right"></i>
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        <DashboardCustomer />
        <ProductDashboard />
        <WorkerDashboard />
      </div>
    </div>
  );
};

export default Dashboard;
