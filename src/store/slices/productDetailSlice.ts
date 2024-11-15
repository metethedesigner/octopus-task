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

export interface ProductDetailState {
  reviews: Review[];
  price: number;
  description: string;
  title: string;
  id: number;
  product: unknown | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  images: string[];
}

// Ürün yorumları için interface tanımı yapıyoruz.
export interface Review {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}

const initialState: ProductDetailState = {
  product: null,
  status: "idle",
  images: [],
  id: 0,
  reviews: [],
  price: 0,
  description: "",
  title: "",
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
