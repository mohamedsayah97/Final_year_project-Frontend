import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { instance } from '../../config/axios';

// Types pour les données d'inscription
export interface RegisterUserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  address: string;
  role?: string;
}

// Types pour la réponse du backend
export interface RegisterResponse {
  token?: string;
  user?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    address: string;
    role: string;
  };
  message?: string;
}

// Types pour l'état du slice
interface RegisterState {
  loading: boolean;
  error: string | null;
  user: RegisterResponse['user'] | null;
  success: boolean;
}

export const registerUser = createAsyncThunk<
  RegisterResponse,           // Type de retour en cas de succès
  RegisterUserData,           // Type du paramètre
  { rejectValue: string }     // Type de rejet
>(
  'register/registerUser',
  async (userData: RegisterUserData, { rejectWithValue }) => {
    try {
      const response = await instance.post<RegisterResponse>('/user/register', {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: userData.password,
        phoneNumber: userData.phoneNumber,
        address: userData.address,
        role: userData.role || 'admin',
      });
      
      // Stocker le token si retourné
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Erreur lors de l\'inscription:', error.response?.data);
      return rejectWithValue(
        error.response?.data?.message || "Erreur lors de l'inscription"
      );
    }
  }
);

const initialState: RegisterState = {
  loading: false,
  error: null,
  user: null,
  success: false,
};

const registerSlice = createSlice({
  name: 'register',
  initialState,
  reducers: {
    clearRegisterState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user || null;
        state.success = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || "Erreur lors de l'inscription";
        state.success = false;
      });
  },
});

export const { clearRegisterState } = registerSlice.actions;
export default registerSlice.reducer;