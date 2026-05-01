const AddInvoice = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="h-32 md:h-48"></div>
        
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-xl">
                <i className="fas fa-file-invoice-dollar text-white text-xl"></i>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Add New Invoice</h2>
                <p className="text-indigo-100 text-sm">
                  Create and manage customer invoices
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form className="p-6 space-y-5">
            {/* Invoice Number avec préfixe */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Invoice Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <i className="fas fa-file-alt absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                <input
                  type="text"
                  placeholder="INV-2024-001"
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 outline-none transition"
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">Unique invoice identifier</p>
            </div>

            {/* Dates section */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <i className="fas fa-calendar-alt text-indigo-500 text-sm"></i>
                <span className="text-sm font-semibold text-gray-700">Invoice Dates</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Issue Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 outline-none transition"
                  />
                </div>
              </div>
            </div>

            {/* Amounts section */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <i className="fas fa-coins text-indigo-500 text-sm"></i>
                <span className="text-sm font-semibold text-gray-700">Amount Details</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Total Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                    <input
                      type="number"
                      placeholder="0.00"
                      className="w-full pl-8 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 outline-none transition"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Tax Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                    <input
                      type="number"
                      placeholder="0.00"
                      className="w-full pl-8 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 outline-none transition"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Status & Payment Terms */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <div className="relative">
                  <i className="fas fa-flag absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                  <select className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 outline-none transition cursor-pointer appearance-none">
                    <option value="">Select status</option>
                    <option value="draft">📝 Draft</option>
                    <option value="pending">⏳ Pending</option>
                    <option value="paid">✅ Paid</option>
                    <option value="overdue">⚠️ Overdue</option>
                    <option value="cancelled">❌ Cancelled</option>
                  </select>
                  <i className="fas fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Terms
                </label>
                <div className="relative">
                  <i className="fas fa-handshake absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                  <select className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 outline-none transition cursor-pointer appearance-none">
                    <option value="">Select payment terms</option>
                    <option value="due_on_receipt">Due on receipt</option>
                    <option value="net15">Net 15 days</option>
                    <option value="net30">Net 30 days</option>
                    <option value="net45">Net 45 days</option>
                    <option value="net60">Net 60 days</option>
                  </select>
                  <i className="fas fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-xl transition duration-200"
              >
                <i className="fas fa-times mr-2"></i>
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition duration-200 transform hover:scale-[1.02]"
              >
                <i className="fas fa-save mr-2"></i>
                Create Invoice
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddInvoice;