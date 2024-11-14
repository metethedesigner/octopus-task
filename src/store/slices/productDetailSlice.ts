import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";

// Ürün detayını çekmek için istek atıyoruz.
export const fetchProductDetail = createAsyncThunk(
  "productDetail/fetchProductDetail",
  async (productId: string) => {
    const response = await axiosInstance.get(`/products/${productId}`);
    return response.data;
  }
);

interface ProductDetailState {
  product: any | null;
  status: "idle" | "loading" | "succeeded" | "failed";
}

const initialState: ProductDetailState = {
  product: null,
  status: "idle",
};

const productDetailSlice = createSlice({
  name: "productDetail",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductDetail.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProductDetail.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.product = action.payload;
      })
      .addCase(fetchProductDetail.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export default productDetailSlice.reducer;
