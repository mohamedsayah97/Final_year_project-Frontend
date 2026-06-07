import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from '../../config/axios';

// Types
export interface LoginCredentials {
    email: string;
    password: string;
}

export interface LoginResponse {
    accesToken: string;
}

export interface User {
    id: number;
    email: string;
    role: string;
}

interface LoginState {
    isAuthenticated: boolean;
    user: User | null;
    token: string | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

// ✅ Fonction pour décoder le token JWT et extraire le rôle
const decodeToken = (token: string) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('Erreur de décodage du token:', error);
        return null;
    }
};

// Async thunk pour login
export const loginUser = createAsyncThunk(
    "login/loginUser",
    async (credentials: LoginCredentials, { rejectWithValue }) => {
        try {
            const response = await instance.post<LoginResponse>('/user/login', credentials);
            const token = response.data.accesToken;
            
            // ✅ Décoder le token pour obtenir le rôle
            const decoded = decodeToken(token);
            const userRole = decoded?.role || 'admin';
            const userId = decoded?.id || 0;
            
            // ✅ Stocker dans localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('userEmail', credentials.email);
            localStorage.setItem('userRole', userRole);  // ✅ AJOUTÉ
            localStorage.setItem('userId', userId.toString()); // ✅ AJOUTÉ
            
            return { 
                accesToken: token, 
                role: userRole, 
                email: credentials.email,
                id: userId 
            };
        } catch (error: any) {
            if (error.response) {
                return rejectWithValue(error.response.data.message || 'Email ou mot de passe incorrect');
            } else if (error.request) {
                return rejectWithValue('Impossible de contacter le serveur');
            } else {
                return rejectWithValue('Erreur de connexion');
            }
        }
    }
);

// Async thunk pour logout
export const logoutUser = createAsyncThunk(
    "login/logoutUser",
    async () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userId');
        localStorage.removeItem('rememberedEmail');
        return null;
    }
);

// Async thunk pour vérifier si l'utilisateur est déjà connecté
export const checkAuthStatus = createAsyncThunk(
    "login/checkAuthStatus",
    async () => {
        const token = localStorage.getItem('token');
        const userEmail = localStorage.getItem('userEmail');
        const userRole = localStorage.getItem('userRole');
        
        if (token && userEmail) {
            return { 
                token, 
                email: userEmail,
                role: userRole || 'user'
            };
        }
        return null;
    }
);

// État initial
const initialState: LoginState = {
    isAuthenticated: false,
    user: null,
    token: null,
    status: 'idle',
    error: null,
};

// Création du slice
const loginSlice = createSlice({
    name: "login",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        resetLoginState: (state) => {
            state.status = 'idle';
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Login cases
            .addCase(loginUser.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.isAuthenticated = true;
                state.token = action.payload.accesToken;
                state.user = {
                    id: action.payload.id,
                    email: action.payload.email,
                    role: action.payload.role,  // ✅ Rôle correct depuis le token
                };
                state.error = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.status = 'failed';
                state.isAuthenticated = false;
                state.user = null;
                state.token = null;
                state.error = action.payload as string || 'Email ou mot de passe incorrect';
            })
            // Logout cases
            .addCase(logoutUser.fulfilled, (state) => {
                state.isAuthenticated = false;
                state.user = null;
                state.token = null;
                state.status = 'idle';
                state.error = null;
            })
            // Check auth status cases
            .addCase(checkAuthStatus.fulfilled, (state, action) => {
                if (action.payload) {
                    state.isAuthenticated = true;
                    state.token = action.payload.token;
                    state.user = {
                        id: 0,
                        email: action.payload.email,
                        role: action.payload.role || 'user',
                    };
                } else {
                    state.isAuthenticated = false;
                    state.user = null;
                    state.token = null;
                }
            });
    }
});

export const { clearError, resetLoginState } = loginSlice.actions;
export default loginSlice.reducer;