import React from 'react';
import { Routes, Route } from "react-router-dom";
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
import ListeSuppliers from './pages/ListeSuppliers';
import UpdateSupplier from './pages/UpdateSupplier';
import UpdateVehicules from './pages/UpdateVehicules';
import ListeVehicules from './pages/ListeVehicules';
import UpdateWorker from './pages/UpdateWorker';
import ListeWorker from './pages/ListeWorker';
import ListeProduct from './pages/ListeProduct';
import UpdateProduct from './pages/UpdateProduct';
import UpdateCustomer from './pages/UpdateCustomer';
import ListeCustomer from './pages/ListeCustomer';
import ListeInvoice from './pages/ListeInvoice';
import UpdateInvoice from './pages/UpdateInvoice';
import ListUsers from './pages/ListUsers';
import UpdateUser from './pages/UpdateUser';
import Connected from './pages/Connected';
import RoleProtected from './components/RoleProtected';


const App = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<Connected />}>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={
            <RoleProtected roles={['admin']}>
              <Home />
            </RoleProtected>
          } />
          
          {/* Produits */}
          <Route path="/add-product" element={
            <RoleProtected roles={['admin', 'stock_manager']}>
              <AddProduct />
            </RoleProtected>
          } />
          <Route path="/list-products" element={
            <RoleProtected roles={['admin', 'stock_manager']}>
              <ListeProduct />
            </RoleProtected>
          } />
          <Route path="/update-product/:id" element={
            <RoleProtected roles={['admin', 'stock_manager']}>
              <UpdateProduct />
            </RoleProtected>
          } />
          
          {/* Clients */}
          <Route path="/add-customer" element={
            <RoleProtected roles={['admin', 'financier']}>
              <AddCustomer />
            </RoleProtected>
          } />
          <Route path="/customers" element={
            <RoleProtected roles={['admin', 'financier']}>
              <ListeCustomer />
            </RoleProtected>
          } />
          <Route path="/update-customer/:id" element={
            <RoleProtected roles={['admin', 'financier']}>
              <UpdateCustomer />
            </RoleProtected>
          } />
          
          {/* Factures */}
          <Route path="/add-invoice" element={
            <RoleProtected roles={['admin', 'financier']}>
              <AddInvoice />
            </RoleProtected>
          } />
          <Route path="/invoices" element={
            <RoleProtected roles={['admin', 'financier']}>
              <ListeInvoice />
            </RoleProtected>
          } />
          <Route path="/update-invoice/:id" element={
            <RoleProtected roles={['admin', 'financier']}>
              <UpdateInvoice />
            </RoleProtected>
          } />
          
          {/* Fournisseurs */}
          <Route path="/add-supplier" element={
            <RoleProtected roles={['admin', 'stock_manager']}>
              <AddSupplier />
            </RoleProtected>
          } />
          <Route path="/all-suppliers" element={
            <RoleProtected roles={['admin', 'stock_manager']}>
              <ListeSuppliers />
            </RoleProtected>
          } />
          <Route path="/update-supplier/:id" element={
            <RoleProtected roles={['admin', 'stock_manager']}>
              <UpdateSupplier />
            </RoleProtected>
          } />
          
          {/* Utilisateurs */}
          <Route path="/add-user" element={
            <RoleProtected roles={['admin']}>
              <AddUser />
            </RoleProtected>
          } />
          <Route path="/users" element={
            <RoleProtected roles={['admin']}>
              <ListUsers />
            </RoleProtected>
          } />
          <Route path="/update-user/:id" element={
            <RoleProtected roles={['admin']}>
              <UpdateUser />
            </RoleProtected>
          } />
          
          {/* Véhicules */}
          <Route path="/add-vehicle" element={
            <RoleProtected roles={['admin', 'park_manager']}>
              <AddVehicle />
            </RoleProtected>
          } />
          <Route path="/liste-vehicules" element={
            <RoleProtected roles={['admin', 'park_manager']}>
              <ListeVehicules />
            </RoleProtected>
          } />
          <Route path="/update-vehicle/:id" element={
            <RoleProtected roles={['admin', 'park_manager']}>
              <UpdateVehicules />
            </RoleProtected>
          } />
          
          {/* Employés */}
          <Route path="/add-worker" element={
            <RoleProtected roles={['admin', 'RH']}>
              <AddWorker />
            </RoleProtected>
          } />
          <Route path="/workers" element={
            <RoleProtected roles={['admin', 'RH']}>
              <ListeWorker />
            </RoleProtected>
          } />
          <Route path="/update-worker/:id" element={
            <RoleProtected roles={['admin', 'RH']}>
              <UpdateWorker />
            </RoleProtected>
          } />
        </Route>
      </Routes>
      <Footer />
    </div>
  );
};

export default App;