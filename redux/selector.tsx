import { IProductSlice } from "@/interface";
import { createSelector } from "@reduxjs/toolkit";

// import { IMovieSlice } from "./slice/movie";
interface IReducer {
    product: IProductSlice;
}
export const getLanguage = (state: IReducer) => state.product.language;
export const getUserInfo = (state: IReducer) => state.product.user;
export const getProducts = (state: IReducer) => state.product.products;
export const getSelectedProducts = (state: IReducer) => state.product.selectedProducts;
export const getIsModelOpen = (state: IReducer) => state.product.isModelOpen;
export const getIsModelDeleteOpen = (state: IReducer) => state.product.isModelDeleteOpen;

// export const getShowCategory = (state: IReducer) => state.movies.showCategory;
// export const getProductById = createSelector(
//     getProducts, getSelectedProducts,
//     (products, product) => {
//         if (product) {
//             return products.find(item => item.id === product.id)
//         }

//     }
// )