import { IProductSlice } from "@/interface";
import { createSlice } from "@reduxjs/toolkit";
import dayjs from "dayjs";

// const dataSource = [
//     {
//         key: "1",
//         id: "1",
//         name: "product A",
//         type: "type 1",
//         price: 11.22,
//         rate: 5,
//         createdAt: {
//             nanoseconds: 297000000,
//             seconds: 1690256429,
//         },
//     },
//     {
//         key: "2",
//         id: "2",
//         name: "product B",
//         type: "type 2",
//         price: 22.22,
//         rate: 4.5,
//         createdAt: {
//             nanoseconds: 297000000,
//             seconds: 1690256429,
//         },
//     },
// ];
const initialState: IProductSlice   = {
    user: undefined,
    products:[],
    isModelOpen: false,
    isModelDeleteOpen: false,
    selectedProducts: undefined
} 
const productSlice = createSlice({
    name: "product",
    initialState: initialState ,
    reducers: {
        setProducts: (state, action) => {
            state.products = action.payload;
        },
        setSelectedProducts: (state, action) => {
            state.selectedProducts = state.products.find((item) => item.id === action.payload);
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
