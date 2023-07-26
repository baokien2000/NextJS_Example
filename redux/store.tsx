import { configureStore } from "@reduxjs/toolkit";
import productSlice from "./slice/product";
import i18n from "../i18n/i18n"
i18n.init()

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