import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";

// Sepete ürün ekleme işlemi
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (
    productData: { productId: number; quantity: number },
    { rejectWithValue }
  ) => {
    try {
      const user = localStorage.getItem("user");
      const userId = user ? JSON.parse(user).id : null;

      if (!userId) {
        throw new Error("Kullanıcı ID bulunamadı.");
      }

      const response = await axiosInstance.post("/carts/add", {
        userId,
        products: [productData],
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Sepete eklenemedi"
      );
    }
  }
);

interface CartState {
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: CartState = {
  status: "idle",
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state) => {
        state.status = "succeeded";
        toast.success("Ürün başarıyla sepete eklendi!", {
          position: "top-right",
          autoClose: 3000,
        });
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
        toast.error("Sepete ekleme başarısız!", {
          position: "top-right",
          autoClose: 3000,
        });
      });
  },
});

export default cartSlice.reducer;
