import React, { useEffect } from "react";
import Head from "next/head";
import Navbar from "@/component/navbar";
import { getSelectedProducts } from "@/redux/selector";
import { SearchOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { Input, Button, Card, Rate } from "antd";
import ProductList from "@/component/productList";
import { useState, KeyboardEvent } from "react";
import { IProduct } from "@/interface";
import { DeleteModel, ProductModel } from "@/component/productModel";
import { useSelector, useDispatch } from "react-redux";
import { getProducts, getUserInfo } from "@/redux/selector";
import productSlice from "@/redux/slice/product";
import { useRouter } from "next/router";
import { auth, db } from "../../firebase/config";
import styles from "@/styles/Product.module.css";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import  { TableLoadding } from "@/component/Loadding";
const ProductDetails = () => {
    const router = useRouter();
    const userInfo = useSelector(getUserInfo);
    const products = useSelector(getProducts);
    const dispatch = useDispatch();
    const selectedProducts = useSelector(getSelectedProducts);
    router.query?.id && console.log("router.query?.id[0]", router.query?.id[0]);
    const [loading, setIsLoad] = useState(false);
    useEffect(() => {
        if (router.query?.id) {
            dispatch(productSlice.actions.setSelectedProducts(router.query?.id[0]));
            console.log("Im runing");
        }
    }, [router.query?.id]);

    useEffect(() => {
        if (router.query?.id && userInfo?.uid) {
            let conlectionRef = db.collection("products").orderBy("createdAt");
            console.log("router.query?.id[0]", router.query?.id[0]);
            console.log(" userInfo?.uid", userInfo?.uid);
            conlectionRef = conlectionRef
                .where("id", "==", router.query?.id[0])
                .where("createdBy", "==", userInfo?.uid);
            const unSubcribe = conlectionRef.onSnapshot((snapshot) => {
                const value = snapshot.docs.map((doc) => ({
                    ...doc.data(),
                    id: doc.id,
                    key: doc.id,
                }));
                console.log("value", value);
                console.log("value[0]", value[0]);
                dispatch(productSlice.actions.setSelectedProducts(value[0]));
                setIsLoad(true);
            });
            return unSubcribe;
        }
    }, [router.query?.id, userInfo]);

    useEffect(() => {
        const authChange = auth.onAuthStateChanged((user) => {
            if (user === null) {
                router.push("/login");
            } else {
                const userInfo = {
                    displayName: user.displayName,
                    email: user.email,
                    phoneNumber: user.phoneNumber,
                    photoURL: user.photoURL,
                    providerId: user.providerId,
                    uid: user.uid,
                };
                dispatch(productSlice.actions.setUserInfo(userInfo));
            }
        });

        return authChange;
    }, []);

    console.log("selectedProducts", selectedProducts);
    return (
        <div>
            <Head>
                <title>Product Details</title>
            </Head>
            <Navbar />
            {loading ? (
                selectedProducts ? (
                    <div className={styles.ProductDetails + " ProductDetails"}>
                        <Card
                            title="Product Detail"
                            extra={<Link href="/">Back to products list</Link>}
                            style={{ width: 500 }}
                        >
                            <div className={styles.DetailsTable}>
                                <span>ID</span>
                                <span>{selectedProducts.id}</span>
                                <span>Name</span>
                                <span>{selectedProducts.name}</span>
                                <span>Price</span>
                                <span>{selectedProducts.price}</span>
                                <span>Rate</span>
                                <span>{selectedProducts.rate}</span>
                                <span>Type</span>
                                <span>{selectedProducts.type}</span>
                                <span>Create At</span>
                                <span>
                                    {dayjs(new Date(selectedProducts.createdAt?.seconds * 1000)).format(
                                        "DD/MM/YYYY h:mm:ss A"
                                    )}
                                </span>
                            </div>
                        </Card>
                    </div>
                ) : (
                    <div className={styles.NotFound}>
                        <h1>404</h1>
                        <span>PageNot Found</span>
                    </div>
                )
            ) : (
                <TableLoadding />
            )}
        </div>
    );
};

export default ProductDetails;
