import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "octopus_task/utils/axiosInstance";

// Login işlemini gerçekleştirdiğimiz istek
export const login = createAsyncThunk(
  "auth/login",
  async (
    {
      username,
      password,
      rememberMe,
    }: { username: string; password: string; rememberMe: boolean },
    { rejectWithValue }
  ) => {
    try {
      const expiresInMins = rememberMe ? 120 : 30; // Kullanıcı loginde "remember me" seçtiyse token süresini 2 saate çıkarıyoruz. Seçmediyse 30 dakika.
      const response = await axiosInstance.post("/auth/login", {
        username,
        password,
        expiresInMins,
      });
      const user = response.data;
      localStorage.setItem("token", user.accessToken);
      localStorage.setItem("user", JSON.stringify(user));
      return user;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(error);
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Token geçerliliğini burada kontrol ediyoruz.
export const checkTokenValidity = createAsyncThunk(
  "auth/checkTokenValidity",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/auth/me");
      return response.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(error);
      return rejectWithValue("Token geçerliliğini kaybetti.");
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

// localStorage'dan token ve user verilerini alıyoruz ve userı JSON parse ediyoruz.
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
      // Klasik login reducerları
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
      })

      // Token kontrolü sonrası token expire olduysa kullanıcıyı çıkış yaptıracağız.
      .addCase(checkTokenValidity.rejected, (state) => {
        state.token = null;
        state.user = null;
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
