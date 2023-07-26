import { configureStore } from "@reduxjs/toolkit";
import productSlice from "./slice/product";


const store = configureStore({
    reducer: {
        product: productSlice.reducer,
    },
    middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})
export default store;