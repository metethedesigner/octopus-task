import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./slices/productSlice";
import categoryReducer from "./slices/categorySlice";
import productDetailReducer from "./slices/productDetailSlice";
import authReducer from "./slices/authSlice";

export const store = configureStore({
  reducer: {
    product: productReducer,
    productDetail: productDetailReducer,
    category: categoryReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
