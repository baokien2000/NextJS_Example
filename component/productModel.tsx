import React, { use, useEffect, useState } from "react";
import { Button, Input, Modal, Form, Space } from "antd";
import { IProduct } from "@/interface";
import { useSelector, useDispatch } from "react-redux";
import productSlice from "@/redux/slice/product";
import dayjs from "dayjs";
import { getIsModelDeleteOpen, getIsModelOpen, getProducts, getUserInfo } from "@/redux/selector";
import firebase, { db, auth } from "../firebase/config";
import { doc, updateDoc,deleteDoc,setDoc } from "firebase/firestore";
import { PoweroffOutlined } from "@ant-design/icons"
import { signOut } from "firebase/auth";
import { useRouter } from 'next/router'
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

interface Prop {
    data: IProduct | undefined;
}
export const ProductModel = (props: Prop) => {

    const [isLoad, setIsLoad] = useState(false);
    const {t} = useTranslation()
    const [form] = Form.useForm();
    const { data } = props;
    const dispatch = useDispatch();
    const userInfo = useSelector(getUserInfo);
    const isModelOpen = useSelector(getIsModelOpen);
    useEffect(() => {
        // Close Window Scroll when Model open
        if (isModelOpen) {
            document.body.style.cssText = "overflow: hidden; position:fixed;";
        } else {
            document.body.style.cssText = "overflow: unset";
        }
    }, [isModelOpen]);

    useEffect(() => {
        if (data)
            form.setFieldsValue({
                id: data.id,
                name: data.name,
                type: data.type,
                price: data.price,
                rate: data.rate,
                createdAt: dayjs(new Date(data.createdAt?.seconds*1000)).format("DD/MM/YYYY h:mm:ss A"),
            });
        else {
            form.resetFields();
        }
    }, [data, form]);

    const handleFinish = () => {
        // Data === true ? Edit : Create
        if (data) {
            const updatedProduct = {
                ...form.getFieldsValue(),
                createdAt: data.createdAt
            };
            const updateRef = doc(db, "products", updatedProduct.id);
            updateDoc(updateRef, updatedProduct);
        } else {
            const ref = db.collection("products").doc();
            const productID = ref.id;
            const addItem = {
                ...form.getFieldsValue(),
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                createdBy: userInfo?.uid,
                id: productID,
                key: productID
            };
            setDoc(ref, addItem)


        }
        dispatch(productSlice.actions.setIsModelOpen(false));
    };

    const handleCancel = () => {
        dispatch(productSlice.actions.setIsModelOpen(false));
    };
    
    return (
        <Modal
            title={(data ? t("Update") : t("Create")) +" " + t("product")}
            open={isModelOpen}
            onCancel={handleCancel}
            footer={null}
            className="Login"
        >
            <Form form={form} onFinish={handleFinish}>
                {data && (
                    <Form.Item label="Id" name={"id"}>
                        <Input readOnly />
                    </Form.Item>
                )}
                <Form.Item
                    label={t("Name")}
                    name={"name"}
                    rules={[{ required: true, message: t("NameEmptyError") }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label={t("Type")}
                    name={"type"}
                    rules={[{ required: true, message: t("TypeEmptyError") }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label={t("Price")}
                    name={"price"}
                    rules={[{ required: true, message: t("PriceEmptyError") }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label={t("Rate")}
                    name={"rate"}
                    rules={[{ required: true, message: t("RateEmptyError") }]}
                >
                    <Input />
                </Form.Item>
                {data && (
                    <Form.Item label={t("CreatedAt")} name={"createdAt"}>
                        <Input readOnly />
                    </Form.Item>
                )}
                <Form.Item>
                    <Space align="end">
                        <Button htmlType="button" onClick={handleCancel}>
                            {t("Cancel")}
                        </Button>
                        <Button type="primary" htmlType="submit">
                            {data ? t("Update") : t("Create")}
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Modal>
    );
};


interface ILogout{
    isModelOpen: boolean
    setIsModelOpen: (isOpen: boolean) => void

}
export const LogoutModel = (props : ILogout) => {
    const { isModelOpen,setIsModelOpen } = props
    const dispatch = useDispatch()
    const router = useRouter()
    const handleCancel = () => {
        setIsModelOpen(false)
    }
    const {t} = useTranslation()
    const handleLogout = () => {
        signOut(auth).then(() => {
            setIsModelOpen(false)
            router.push("/login").then(() => {
                dispatch(productSlice.actions.setProducts([]))
            })
        }).catch((error) => {
            toast.error(t("ErrorToast"));
        });
    }
    return <Modal
    open={isModelOpen}
    onCancel={handleCancel}
        footer={
            < >
                <Button className="LogoutCancel" onClick={handleCancel}>{t("Cancel")}</Button>
                <Button className="LogoutBtn" onClick={handleLogout}>{t("YesImSure")}</Button>

            </>
        }
    className="Logout"
    >
        <div className="Container">
            <div className="Circle">
                <PoweroffOutlined  style={{fontSize:"35px" , color:"#1d7c8e"}}/>
            </div>
            <p>{t("SeeYouBackSoon")}</p>
            <span>{t("SureToLogout")}</span>
        </div>
    </Modal>
}

interface IDelete{
    data: IProduct | undefined;
}

export const DeleteModel = (props: IDelete) => {
    const [confirtext,setConfirmText] = useState("")
    const dispatch = useDispatch()
    const isModelDeleteOpen = useSelector(getIsModelDeleteOpen)
    const router = useRouter()
    const handleCancel = () => {
        dispatch(productSlice.actions.setIsModelDeleteOpen(false))
    }
    const {t} = useTranslation()

    const handleDelete = () => {
        if (props.data?.id) {
            deleteDoc(doc(db, "products", props.data.id)).then(() => {
                toast.success(t("DeleteProductSuccess"))
                dispatch(productSlice.actions.setIsModelDeleteOpen(false))
            })
            .catch(error => {
                console.log(error);
                toast.error(t("ErrorToast"));
            })
        }
    }
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmText(e.target.value)
    }
    return <Modal
    open={isModelDeleteOpen}
        onCancel={handleCancel}
        footer={
            < >
                <Button className="DeleteCancel" type="text" onClick={handleCancel}>{t("Cancel")}</Button>
                <Button disabled={props.data?.name !== confirtext} className="DeleteBtn" onClick={handleDelete}>{t("Delete")}</Button>
            </>
        }
    className="Delete"
    >
        <div className="Container">
            <h2>{t("DeleteThisProduct")}</h2>
            <p>{t("DeleteWarning")}</p>
        </div>
        <div className="Confirm">
        <span>{t("DeleteConfirm")} <b>{props.data?.name}</b></span>
            <Input onChange={handleChange}></Input>
        </div>
    </Modal>
}