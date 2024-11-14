import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";

// Ürünlerin tamamını tek sayfada 9 adet gelecek şekilde çekiyoruz.
export const fetchProducts = createAsyncThunk(
  "product/fetchProducts",
  async (page: number = 1) => {
    const limit = 9; //
    const skip = (page - 1) * limit;
    const response = await axiosInstance.get(
      `/products?limit=${limit}&skip=${skip}`
    );
    return { products: response.data.products, total: response.data.total };
  }
);

interface ProductState {
  items: any[];
  total: number;
  status: "idle" | "loading" | "succeeded" | "failed";
}

const initialState: ProductState = {
  items: [],
  total: 0,
  status: "idle",
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.products;
        state.total = action.payload.total;
      })
      .addCase(fetchProducts.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export default productSlice.reducer;
