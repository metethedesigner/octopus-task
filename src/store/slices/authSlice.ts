import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "octopus_task/utils/axiosInstance";

// Login işlemini gerçekleştirdiğimiz istek
export const login = createAsyncThunk(
  "auth/login",
  async (
    credentials: { username: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.post("/auth/login", credentials);
      const user = response.data;
      localStorage.setItem("token", user.accessToken);
      localStorage.setItem("user", JSON.stringify(user));
      return user;
    } catch (error: any) {
      console.log(error);
      return rejectWithValue(error.response.data.message);
    }
  }
);

interface UserState {
  firstName: string;
}

interface AuthState {
  token: string | null;
  user: UserState | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

// localStorage'dan token ve user verilerini alıyoruz ve userı JSON parse et
const initialToken =
  typeof window !== "undefined" ? localStorage.getItem("token") : null;
const initialUser =
  typeof window !== "undefined" && localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user") || "{}")
    : null;

const initialState: AuthState = {
  token: initialToken,
  user: initialUser,
  status: "idle",
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.user = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.token = action.payload.accessToken;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
