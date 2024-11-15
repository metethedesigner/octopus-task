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

// Ürün aramak için thunk fonksiyonumuz.
export const searchProducts = createAsyncThunk(
  "product/searchProducts",
  async (query: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/products/search?q=${query}`);
      return response.data.products;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Arama hatası");
    }
  }
);

interface ProductState {
  items: unknown[];
  total: number;
  searchResults: unknown[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ProductState = {
  items: [],
  total: 0,
  searchResults: [],
  status: "idle",
  error: null,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Klasik ürün çekme reducerları
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
      })

      // Ürünlerde Search reducerları
      .addCase(searchProducts.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.searchResults = [];
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.searchResults = action.payload;
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      });
  },
});

export default productSlice.reducer;
