const AddWorker = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-100 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="h-32 md:h-48"></div>
        
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

          <form className="p-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <i className="fas fa-user text-gray-400 text-xs"></i>
                  First Name
                </label>
                <input type="text" placeholder="John" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition" />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <i className="fas fa-user text-gray-400 text-xs"></i>
                  Last Name
                </label>
                <input type="text" placeholder="Doe" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <i className="fas fa-envelope text-gray-400 text-xs"></i>
                  Email
                </label>
                <input type="email" placeholder="john.doe@company.com" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition" />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <i className="fas fa-phone text-gray-400 text-xs"></i>
                  Phone Number
                </label>
                <input type="tel" placeholder="+1 234 567 8900" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <i className="fas fa-city text-gray-400 text-xs"></i>
                  City
                </label>
                <input type="text" placeholder="New York" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition" />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <i className="fas fa-briefcase text-gray-400 text-xs"></i>
                  Job Title
                </label>
                <input type="text" placeholder="Software Engineer" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <i className="fas fa-building text-gray-400 text-xs"></i>
                  Department
                </label>
                <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition cursor-pointer">
                  <option value="">Select department</option>
                  <option value="it">💻 IT</option>
                  <option value="hr">👥 HR</option>
                  <option value="sales">📈 Sales</option>
                  <option value="marketing">📢 Marketing</option>
                  <option value="finance">💰 Finance</option>
                </select>
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <i className="fas fa-calendar-alt text-gray-400 text-xs"></i>
                  Hire Date
                </label>
                <input type="date" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <i className="fas fa-file-signature text-gray-400 text-xs"></i>
                  Contract Type
                </label>
                <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition cursor-pointer">
                  <option value="">Select contract</option>
                  <option value="permanent">📄 Permanent</option>
                  <option value="fixed_term">⏱️ Fixed Term</option>
                  <option value="part_time">🕒 Part Time</option>
                  <option value="internship">🎓 Internship</option>
                </select>
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <i className="fas fa-dollar-sign text-gray-400 text-xs"></i>
                  Salary
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input type="number" placeholder="50000" className="w-full pl-8 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition" />
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
                  <input type="radio" name="hasCompanyCar" value="yes" className="w-4 h-4 text-blue-600" />
                  <span className="text-gray-700">Yes</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="hasCompanyCar" value="no" className="w-4 h-4 text-blue-600" defaultChecked />
                  <span className="text-gray-700">No</span>
                </label>
              </div>
            </div>

            <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white font-semibold py-3 px-4 rounded-xl transition duration-200 ease-in-out transform hover:scale-[1.02]">
              <i className="fas fa-user-plus mr-2"></i>
              Add Worker
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddWorker;