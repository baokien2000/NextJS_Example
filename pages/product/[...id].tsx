import React, { useEffect,useState } from "react";
import { getLanguage, getSelectedProducts,getProducts, getUserInfo  } from "@/redux/selector";
import styles from "@/styles/Product.module.css";
import Head from "next/head";
import Link from "next/link";
import { Card } from "antd";
import { useSelector, useDispatch } from "react-redux";
import productSlice from "@/redux/slice/product";
import { useRouter } from "next/router";
import { auth, db } from "../../firebase/config";
import dayjs from "dayjs";
import  { TableLoadding } from "@/component/Loadding";
import { useTranslation } from "react-i18next";

const ProductDetails = () => {
    const router = useRouter();
    const userInfo = useSelector(getUserInfo);
    const dispatch = useDispatch();
    const selectedProducts = useSelector(getSelectedProducts);
    const [loading, setIsLoad] = useState(false);
    const selectedLanguage = useSelector(getLanguage);
    const { t } = useTranslation();
    useEffect(() => {
        if (router.query?.id) {
            dispatch(productSlice.actions.setSelectedProducts(router.query?.id[0]));
        }
    }, [router.query?.id,dispatch]);

    useEffect(() => {
        if (router.query?.id && userInfo?.uid) {
            let conlectionRef = db.collection("products").orderBy("createdAt");
            conlectionRef = conlectionRef
                .where("id", "==", router.query?.id[0])
                .where("createdBy", "==", userInfo?.uid);
            const unSubcribe = conlectionRef.onSnapshot((snapshot) => {
                const value = snapshot.docs.map((doc) => ({
                    ...doc.data(),
                    id: doc.id,
                    key: doc.id,
                }));
                dispatch(productSlice.actions.setSelectedProducts(value[0]));
                setIsLoad(true);
            });
            return unSubcribe;
        }
    }, [router.query?.id, userInfo,selectedLanguage,dispatch]);

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
    }, [dispatch,router]);

    return (
        <div>
            <Head>
                <title>{t("ProductDetails")}</title>
            </Head>
            {/* <Navbar /> */}
            {loading ? (
                selectedProducts ? (
                    <div className={styles.ProductDetails + " ProductDetails"}>
                        <Card
                            title={t('ProductDetails')}
                            extra={<Link href="/">{t("BackToProductsList")}</Link>}
                            style={{ width: 500 }}
                        >
                            <div className={styles.DetailsTable}>
                                <span>ID</span>
                                <span>{selectedProducts.id}</span>
                                <span>{t("Name")}</span>
                                <span>{selectedProducts.name}</span>
                                <span>{t("Price")}</span>
                                <span>{selectedProducts.price}</span>
                                <span>{t("Rate")}</span>
                                <span>{selectedProducts.rate}</span>
                                <span>{t("Type")}</span>
                                <span>{selectedProducts.type}</span>
                                <span>{t("CreatedAt")}</span>
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
