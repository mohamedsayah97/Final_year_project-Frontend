import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';

// Configuration axios
export const instance = axios.create({
    baseURL: 'http://localhost:3002',
    timeout: 100000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Types pour les produits
export interface Product {
    id?: number;
    name: string;
    description: string;
    price: number;
    quantity: number;
    location: string;
    createdAt?: string;
}

// Async thunk pour fetch data
export const fetchData = createAsyncThunk(
    "add/fetchData",
    async () => {
        const response = await instance.get('/products/create');
        return response.data;
    }
);

// Async thunk pour créer un produit
export const createProduct = createAsyncThunk(
    "add/createProduct",
    async (productData: Omit<Product, 'id' | 'createdAt'>) => {
        const response = await instance.post('/products/create', productData);
        return response.data;
    }
);

// État initial avec types
const initialState = {
    value: 0,
    data: null ,
    status: 'idle' as 'idle' | 'loading' | 'succeeded' | 'failed',
    error: null as string | null,
    createStatus: 'idle' as 'idle' | 'loading' | 'succeeded' | 'failed',
    createError: null as string | null,
};

const addSlice = createSlice({
    name: "add",
    initialState,
    reducers: {
        increment: (state) => {
            state.value += 1;
        },
        decrement: (state) => {
            state.value -= 1;
        },
        reset: (state) => {
            state.value = 0;
        },
        clearCreateStatus: (state) => {
            state.createStatus = 'idle';
            state.createError = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch data cases
            .addCase(fetchData.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchData.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload;
                state.error = null;
            })
            .addCase(fetchData.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Une erreur est survenue';
            })
            // Create product cases
            .addCase(createProduct.pending, (state) => {
                state.createStatus = 'loading';
                state.createError = null;
            })
            .addCase(createProduct.fulfilled, (state) => {
                state.createStatus = 'succeeded';
                state.createError = null;
            })
            .addCase(createProduct.rejected, (state, action) => {
                state.createStatus = 'failed';
                state.createError = action.error.message || 'Une erreur est survenue';
            });
    }
});

export const { increment, decrement, reset, clearCreateStatus } = addSlice.actions;
export default addSlice.reducer;