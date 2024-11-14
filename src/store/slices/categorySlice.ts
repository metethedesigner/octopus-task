import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";

// Tüm kategorileri çekiyoruz
export const fetchCategories = createAsyncThunk(
  "category/fetchCategories",
  async () => {
    const response = await axiosInstance.get("/products/categories");
    return response.data;
  }
);

// Seçili kategoriye göre ürünleri çekiyoruz
export const fetchProductsByCategory = createAsyncThunk(
  "category/fetchProductsByCategory",
  async ({ category, page }: { category: string; page: number }) => {
    const limit = 9;
    const skip = (page - 1) * limit;
    const response = await axiosInstance.get(
      `/products/category/${category}?limit=${limit}&skip=${skip}`
    );
    return { products: response.data.products, total: response.data.total };
  }
);

interface CategoryState {
  categories: { slug: string; name: string; url: string }[];
  selectedCategoryProducts: any[];
  selectedCategoryTotal: number;
  status: "idle" | "loading" | "succeeded" | "failed";
}

const initialState: CategoryState = {
  categories: [],
  selectedCategoryProducts: [],
  selectedCategoryTotal: 0,
  status: "idle",
};

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(fetchProductsByCategory.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.selectedCategoryProducts = action.payload.products;
        state.selectedCategoryTotal = action.payload.total;
      })
      .addCase(fetchProductsByCategory.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export default categorySlice.reducer;
