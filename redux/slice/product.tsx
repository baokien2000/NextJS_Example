import { IProductSlice } from "@/interface";
import { createSlice } from "@reduxjs/toolkit";

const initialState: IProductSlice   = {
    user: undefined,
    products:[],
    isModelOpen: false,
    isModelDeleteOpen: false,
    selectedProducts: undefined,
    language: "vi",
} 
const productSlice = createSlice({
    name: "product",
    initialState: initialState ,
    reducers: {
        setLanguage: (state, action) => {
            state.language = action.payload;
        },
        setProducts: (state, action) => {
            state.products = action.payload;
        },
        setSelectedProducts: (state, action) => {
            state.selectedProducts = action.payload;
        },
        setUserInfo: (state, action) => {
            state.user = action.payload;
        },
        addProduct: (state, action) => {
            state.products = [...state.products, action.payload];
        },
        updateProduct: (state, action) => {
            state.products = state.products.map((item) =>
                item.id === action.payload.id ? (item = action.payload) : item
            );
        },
        setIsModelOpen: (state, action) => {
            state.isModelOpen = action.payload;
        },
        setIsModelDeleteOpen: (state, action) => {
            state.isModelDeleteOpen = action.payload;
        },
    },

});
export default productSlice;
