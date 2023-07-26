import React, { useEffect, useState } from "react";
import Search from "antd/es/input/Search";
import { Table } from "antd";
import styles from "@/styles/Home.module.css";
import { IProduct } from "@/interface";
import { EditOutlined ,DeleteOutlined,EyeOutlined} from "@ant-design/icons";
import productSlice from "@/redux/slice/product";
import {useDispatch,useSelector } from "react-redux";
import { getProducts } from "@/redux/selector";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

interface Prop {
    setSelectedProduct: (data: IProduct | undefined) => void
    searchProduct: IProduct[] ,
}
const ProductList = (props: Prop) => {
    const { setSelectedProduct ,searchProduct} = props;
    const dispatch = useDispatch()
    const router = useRouter()

    const handleEditProductClick = (id: string) => {
        dispatch(productSlice.actions.setIsModelOpen((true)));
        setSelectedProduct(searchProduct.find((item) => item.id === id));
    };
    const handleDeleteProductClick = (id: string) => {
        dispatch(productSlice.actions.setIsModelDeleteOpen((true)));
        setSelectedProduct(searchProduct.find((item) => item.id === id));
    };
    const handleView = (id: string) => {
        router.push("/product/[...id]", `/product/${id}`)
    }
    const { t } = useTranslation();

    const columns = [
        {
            title: "Id",
            dataIndex: "id",
            key: "id",
        },
        {
            title: t("Name"),
            dataIndex: "name",
            key: "name",
        },
        {
            title: t("Type"),
            dataIndex: "type",
            key: "type",
        },
        {
            title: t("Price"),
            dataIndex: "price",
            key: "price",
        },
        {
            title: t("Rate"),
            dataIndex: "rate",
            key: "rate",
        },
        {
            // dayjs(new Date()).format("DD/MM/YYYY h:mm:ss A")
            title: t("CreatedAt"),
            dataIndex: "createdAt",
            key: "createdAt",
            render: (_: any, record: IProduct) => (
                <>{dayjs(new Date(record.createdAt?.seconds*1000)).format("DD/MM/YYYY h:mm:ss A")}</>
            ),
        },
        {
            title: t("Action"),
            dataIndex: "Action",
            key: "Action",
            render: (_: any, record: IProduct) => (
                <>
                    <EditOutlined style={{ cursor: "pointer" }} onClick={() => handleEditProductClick(record.id)} />
                    <DeleteOutlined  style={{ cursor: "pointer", margin:"0 10px" }} onClick={() => handleDeleteProductClick(record.id)}  />
                    <EyeOutlined  style={{ cursor: "pointer"}} onClick={() => handleView(record.id)}  />
                </>
            ),
        },
    ];
    return (
        <div className={styles.ProductList}>
            <Table dataSource={searchProduct} columns={columns} />;
        </div>
    );
};

export default ProductList;
