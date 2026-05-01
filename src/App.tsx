import React from 'react';
import { Routes, Route } from "react-router-dom"; // Supprimez BrowserRouter import
import Footer from './components/Footer';
import Home from './pages/Home';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import AddProduct from './pages/AddProduct';
import AddCustomer from './pages/AddCustomer';
import AddInvoice from './pages/AddInvoice';
import AddSupplier from './pages/AddSupplier';
import AddUser from './pages/AddUser';
import AddVehicle from './pages/AddVehicule';
import AddWorker from './pages/AddWorker';

const App = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/add-customer" element={<AddCustomer />} />
        <Route path="/add-invoice" element={<AddInvoice />} />
        <Route path="/add-supplier" element={<AddSupplier />} />
        <Route path="/add-user" element={<AddUser />} />
        <Route path="/add-vehicle" element={<AddVehicle />} />
        <Route path="/add-worker" element={<AddWorker />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;