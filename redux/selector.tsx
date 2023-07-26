import { IProductSlice } from "@/interface";
import { createSelector } from "@reduxjs/toolkit";

interface IReducer {
    product: IProductSlice;
}
export const getLanguage = (state: IReducer) => state.product.language;
export const getUserInfo = (state: IReducer) => state.product.user;
export const getProducts = (state: IReducer) => state.product.products;
export const getSelectedProducts = (state: IReducer) => state.product.selectedProducts;
export const getIsModelOpen = (state: IReducer) => state.product.isModelOpen;
export const getIsModelDeleteOpen = (state: IReducer) => state.product.isModelDeleteOpen;