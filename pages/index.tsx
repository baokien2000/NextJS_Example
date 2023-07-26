import Head from "next/head";
import styles from "@/styles/Home.module.css";
import Navbar from "@/component/navbar";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import { Input, Button, Spin } from "antd";
import ProductList from "@/component/productList";
import { useEffect, useState, KeyboardEvent } from "react";
import { IProduct } from "@/interface";
import { DeleteModel, ProductModel } from "@/component/productModel";
import { useSelector, useDispatch } from "react-redux";
import { getLanguage, getProducts, getUserInfo } from "@/redux/selector";
import productSlice from "@/redux/slice/product";
import { useRouter } from "next/router";
import { auth, db } from "../firebase/config";
import {Loadding} from "@/component/Loadding";
import { useTranslation } from "react-i18next";

export default function Home() {
    const [searchData, setSearchData] = useState<IProduct[]>([]);
    const [search, setSearch] = useState("");
    const [selectedProduct, setSelectedProduct] = useState<IProduct>();

    const router = useRouter();
    const userInfo = useSelector(getUserInfo);
    const products = useSelector(getProducts);
    const dispatch = useDispatch();
    const [loading, setIsLoad] = useState(false)
    const { t } = useTranslation();
    useEffect(() => {
        setSearchData(products);
    }, [products]);

    const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.code === "Enter") handleSearch();
    };
    const handleSearch = () => {
        setSearchData(products.filter((item) => item.name.toLocaleLowerCase().includes(search.toLocaleLowerCase())));
    };
    const handleAddProduct = () => {
        setSelectedProduct(undefined);
        dispatch(productSlice.actions.setIsModelOpen(true));
    };
    useEffect(() => {
        if (userInfo?.uid) {
            let conlectionRef = db.collection("products").orderBy("createdAt");

            conlectionRef = conlectionRef.where("createdBy", "==", userInfo.uid);
            const unSubcribe = conlectionRef.onSnapshot((snapshot) => {
                const value = snapshot.docs.map((doc) => ({
                    ...doc.data(),
                    // id: doc.id,
                    // key: doc.id,
                }));
                dispatch(productSlice.actions.setProducts(value));
                setIsLoad(true)

            });

            return unSubcribe;
        }
    }, [userInfo]);
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

    return (
        loading ? <>
            <Head>
                <title>Example App</title>
            </Head>
            {/* <Navbar /> */}

            <main className={styles.main}>
                <div className={styles.search}>
                    <Input
                        placeholder={t("Search")  }
                        onChange={(e) => setSearch(e.target.value)}
                        suffix={<SearchOutlined onClick={handleSearch} />}
                        onKeyDown={handleKeyPress}
                        style={{ maxWidth: "500px" }}
                        size="large"
                    />
                    <Button
                        onClick={handleAddProduct}
                        type="primary"
                        shape="round"
                        icon={<PlusOutlined />}
                        size={"large"}
                    />
                </div>
                <ProductList searchProduct={searchData} setSelectedProduct={setSelectedProduct} />
            </main>
          <ProductModel data={selectedProduct} />
          <DeleteModel data={selectedProduct}  />
        </> : <Loadding/>
    );
}
