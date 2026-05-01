const AddUser = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-purple-100 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="h-32 md:h-48"></div>
        
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-4">
            <div className="flex items-center gap-3">
              <i className="fas fa-user-plus text-white text-2xl"></i>
              <div>
                <h2 className="text-xl font-bold text-white">Add New User</h2>
                <p className="text-violet-100 text-sm">Create a new user account</p>
              </div>
            </div>
          </div>

          <form className="p-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <i className="fas fa-user text-gray-400 text-xs"></i>
                  First Name
                </label>
                <input type="text" placeholder="John" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-violet-400 focus:ring-2 focus:ring-violet-200 outline-none transition" />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <i className="fas fa-user text-gray-400 text-xs"></i>
                  Last Name
                </label>
                <input type="text" placeholder="Doe" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-violet-400 focus:ring-2 focus:ring-violet-200 outline-none transition" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <i className="fas fa-envelope text-gray-400 text-xs"></i>
                  Email
                </label>
                <input type="email" placeholder="john.doe@example.com" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-violet-400 focus:ring-2 focus:ring-violet-200 outline-none transition" />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <i className="fas fa-lock text-gray-400 text-xs"></i>
                  Password
                </label>
                <input type="password" placeholder="••••••••" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-violet-400 focus:ring-2 focus:ring-violet-200 outline-none transition" />
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <i className="fas fa-phone text-gray-400 text-xs"></i>
                Phone Number
              </label>
              <input type="tel" placeholder="+1 234 567 8900" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-violet-400 focus:ring-2 focus:ring-violet-200 outline-none transition" />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <i className="fas fa-location-dot text-gray-400 text-xs"></i>
                Address
              </label>
              <textarea rows={2} placeholder="123 Main St, City, Country" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-violet-400 focus:ring-2 focus:ring-violet-200 outline-none transition resize-none" />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <i className="fas fa-user-tag text-gray-400 text-xs"></i>
                Role
              </label>
              <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-violet-400 focus:ring-2 focus:ring-violet-200 outline-none transition cursor-pointer">
                <option value="">Select user role</option>
                <option value="admin">👑 Admin</option>
                <option value="manager">📊 Manager</option>
                <option value="employee">👥 Employee</option>
                <option value="viewer">👁️ Viewer</option>
              </select>
            </div>

            <button type="submit" className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-xl transition duration-200 ease-in-out transform hover:scale-[1.02]">
              <i className="fas fa-user-plus mr-2"></i>
              Add User
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddUser;