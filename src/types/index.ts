// types/index.ts
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: "admin" | "user" | "manager";
}

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  description?: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  amount: number;
  status: "paid" | "pending" | "overdue";
  date: string;
}

export interface Supplier {
  id: string;
  name: string;
  contact: string;
  email: string;
  phone: string;
}

export interface Vehicle {
  id: string;
  registrationNumber: string;
  brand: string;
  model: string;
  year: number;
}

export interface Worker {
  id: string;
  fullName: string;
  position: string;
  email: string;
  phone: string;
}
