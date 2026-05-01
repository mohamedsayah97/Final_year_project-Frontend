const AddSupplier = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-100 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="h-32 md:h-48"></div>
        
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

          <form className="p-6 space-y-5">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <i className="fas fa-building text-gray-400 text-xs"></i>
                Supplier Name
              </label>
              <input type="text" placeholder="e.g., Tech Distributors Inc." className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-amber-400 focus:ring-2 focus:ring-amber-200 outline-none transition" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <i className="fas fa-envelope text-gray-400 text-xs"></i>
                  Email
                </label>
                <input type="email" placeholder="supplier@company.com" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-amber-400 focus:ring-2 focus:ring-amber-200 outline-none transition" />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <i className="fas fa-phone text-gray-400 text-xs"></i>
                  Phone
                </label>
                <input type="tel" placeholder="+1 234 567 8900" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-amber-400 focus:ring-2 focus:ring-amber-200 outline-none transition" />
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <i className="fas fa-location-dot text-gray-400 text-xs"></i>
                Address
              </label>
              <textarea rows={2} placeholder="123 Business Park, City, Country" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-amber-400 focus:ring-2 focus:ring-amber-200 outline-none transition resize-none" />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <i className="fas fa-id-card text-gray-400 text-xs"></i>
                Registration Number
              </label>
              <input type="text" placeholder="e.g., VAT123456789" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-amber-400 focus:ring-2 focus:ring-amber-200 outline-none transition" />
            </div>

            <button type="submit" className="w-full bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white font-semibold py-3 px-4 rounded-xl transition duration-200 ease-in-out transform hover:scale-[1.02]">
              <i className="fas fa-truck mr-2"></i>
              Add Supplier
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddSupplier;