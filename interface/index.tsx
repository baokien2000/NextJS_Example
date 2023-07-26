export interface IProduct {
    key: string;
    id: string;
    name: string;
    type: string;
    price: number;
    rate: number;
    createdAt: {
        seconds: number;
        nanoseconds: number;
    };
}
export interface IProductSlice {
    user: IUser | undefined ,
    products: IProduct[],
    selectedProducts: IProduct| undefined ,
    isModelOpen: boolean,
    isModelDeleteOpen: boolean,
    language: string,
}

export interface IUser {
    displayName: string;
    email: string;
    phoneNumber: string;
    photoURL: string;
    providerId: string;
    uid: string;
    
}

export interface ILogin{
    email: string;
    password: string;
}