const AddVehicle = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="h-32 md:h-48"></div>
        
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

          <form className="p-6 space-y-5">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <i className="fas fa-id-card text-gray-400 text-xs"></i>
                Registration Number
              </label>
              <input type="text" placeholder="ABC-1234" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-green-400 focus:ring-2 focus:ring-green-200 outline-none transition" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <i className="fas fa-industry text-gray-400 text-xs"></i>
                  Make (Brand)
                </label>
                <input type="text" placeholder="Toyota" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-green-400 focus:ring-2 focus:ring-green-200 outline-none transition" />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <i className="fas fa-car-side text-gray-400 text-xs"></i>
                  Model
                </label>
                <input type="text" placeholder="Camry" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-green-400 focus:ring-2 focus:ring-green-200 outline-none transition" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <i className="fas fa-calendar-alt text-gray-400 text-xs"></i>
                  Year
                </label>
                <input type="number" placeholder="2024" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-green-400 focus:ring-2 focus:ring-green-200 outline-none transition" />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <i className="fas fa-truck text-gray-400 text-xs"></i>
                  Vehicle Type
                </label>
                <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-green-400 focus:ring-2 focus:ring-green-200 outline-none transition cursor-pointer">
                  <option value="">Select type</option>
                  <option value="sedan">🚗 Sedan</option>
                  <option value="suv">🚙 SUV</option>
                  <option value="truck">🚛 Truck</option>
                  <option value="van">🚐 Van</option>
                  <option value="motorcycle">🏍️ Motorcycle</option>
                </select>
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <i className="fas fa-palette text-gray-400 text-xs"></i>
                Color
              </label>
              <div className="flex gap-3">
                <input type="text" placeholder="Red" className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-green-400 focus:ring-2 focus:ring-green-200 outline-none transition" />
                <input type="color" className="w-14 h-11 rounded-xl border border-gray-200 cursor-pointer" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <i className="fas fa-calendar-plus text-gray-400 text-xs"></i>
                  Purchase Date
                </label>
                <input type="date" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-green-400 focus:ring-2 focus:ring-green-200 outline-none transition" />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <i className="fas fa-calendar-check text-gray-400 text-xs"></i>
                  Assigned Date
                </label>
                <input type="date" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-green-400 focus:ring-2 focus:ring-green-200 outline-none transition" />
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <i className="fas fa-id-badge text-gray-400 text-xs"></i>
                Current Driver ID
              </label>
              <input type="text" placeholder="DRV-001" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-green-400 focus:ring-2 focus:ring-green-200 outline-none transition" />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <i className="fas fa-circle-info text-gray-400 text-xs"></i>
                Status
              </label>
              <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-green-400 focus:ring-2 focus:ring-green-200 outline-none transition cursor-pointer">
                <option value="">Select status</option>
                <option value="available">🟢 Available</option>
                <option value="in_use">🔵 In Use</option>
                <option value="maintenance">🟡 Under Maintenance</option>
                <option value="repair">🔴 In Repair</option>
                <option value="retired">⚫ Retired</option>
              </select>
            </div>

            <button type="submit" className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 px-4 rounded-xl transition duration-200 ease-in-out transform hover:scale-[1.02]">
              <i className="fas fa-car mr-2"></i>
              Add Vehicle
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddVehicle;