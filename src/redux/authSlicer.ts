import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface User {
  id: number | null;
  accessToken: string | null;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  role: string | null;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  error: null,
};

export const loginUser = createAsyncThunk(
  "user/loginUser",
  async (userCredentials: object, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://192.168.10.210:8080/TAM/auth/login",
        userCredentials
      );

      const responseData = response.data.body;

      console.log(responseData);

      localStorage.setItem("user", JSON.stringify(responseData));

      if (response.status !== 200) {
        return rejectWithValue(responseData.error.message);
      }

      localStorage.setItem("user", JSON.stringify(responseData));

      return responseData;
    } catch (error) {
      console.log("Error in loginUser:", error);

      return rejectWithValue("Login failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload as string | null;
      });
  },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;