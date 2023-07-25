import React, { useEffect, useState } from "react";
import { Button, Input, Modal, Form, Space } from "antd";
import { IProduct } from "@/interface";
import { useSelector, useDispatch } from "react-redux";
import productSlice from "@/redux/slice/product";
import dayjs from "dayjs";
import { getIsModelDeleteOpen, getIsModelOpen, getProducts, getUserInfo } from "@/redux/selector";
import firebase, { db, auth } from "../firebase/config";
import { doc, updateDoc,deleteDoc} from "firebase/firestore";
import { PoweroffOutlined } from "@ant-design/icons"
import { signOut } from "firebase/auth";
import { useRouter } from 'next/router'
import { toast } from "react-toastify";

interface Prop {
    data: IProduct | undefined;
}
export const ProductModel = (props: Prop) => {

    const [isLoad, setIsLoad] = useState(false);

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
            const addItem = {
                ...form.getFieldsValue(),
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            };
            db.collection("products").add({
                ...addItem,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                createdBy: userInfo?.uid,
            });
        }
        dispatch(productSlice.actions.setIsModelOpen(false));
    };

    const handleCancel = () => {
        dispatch(productSlice.actions.setIsModelOpen(false));
    };
    
    return (
        <Modal
            title={(data ? "Update" : "Create") + " Product"}
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
                    label="Name"
                    name={"name"}
                    rules={[{ required: true, message: "Please input product name!" }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Type"
                    name={"type"}
                    rules={[{ required: true, message: "Please input product type!" }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Price"
                    name={"price"}
                    rules={[{ required: true, message: "Please input product price!" }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Rate"
                    name={"rate"}
                    rules={[{ required: true, message: "Please input product rate!" }]}
                >
                    <Input />
                </Form.Item>
                {data && (
                    <Form.Item label="Created At" name={"createdAt"}>
                        <Input readOnly />
                    </Form.Item>
                )}
                <Form.Item>
                    <Space align="end">
                        <Button htmlType="button" onClick={handleCancel}>
                            Cancel
                        </Button>
                        <Button type="primary" htmlType="submit">
                            {data ? "Update" : "Create"}
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
    const handleLogout = () => {
        signOut(auth).then(() => {
            router.push("/login").then(() => {
                dispatch(productSlice.actions.setProducts([]))
            })
        }).catch((error) => {
            toast.error("An error occurred. Please try again later.");
        });
    }
    return <Modal
    open={isModelOpen}
    onCancel={handleCancel}
        footer={
            < >
                <Button className="LogoutCancel" onClick={handleCancel}>Cancel</Button>
                <Button className="LogoutBtn" onClick={handleLogout}>{"Yes, I'm Sure"}</Button>

            </>
        }
    className="Logout"
    >
        <div className="Container">
            <div className="Circle">
                <PoweroffOutlined  style={{fontSize:"35px" , color:"#1d7c8e"}}/>
            </div>
            <p>Hope to see you back soon</p>
            <span>Are you sure you want to logout ?</span>
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
    const handleDelete = () => {
        if (props.data?.id) {
            deleteDoc(doc(db, "products", props.data.id)).then(() => {
                toast.success("Product has been deleted successfully")
                dispatch(productSlice.actions.setIsModelDeleteOpen(false))
            })
            .catch(error => {
                console.log(error);
                toast.error("An error occurred. Please try again later.");
            })
        }
       
        // signOut(auth).then(() => {
        //     router.push("/login").then(() => {
        //         dispatch(productSlice.actions.setProducts([]))
        //     })
        // }).catch((error) => {
        //     toast.error("An error occurred. Please try again later.");
        // });
    }
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmText(e.target.value)
    }
    return <Modal
    open={isModelDeleteOpen}
        onCancel={handleCancel}
        footer={
            < >
                <Button className="DeleteCancel" type="text" onClick={handleCancel}>Cancel</Button>
                <Button disabled={props.data?.name !== confirtext} className="DeleteBtn" onClick={handleDelete}>Delete</Button>
            </>
        }
    className="Delete"
    >
        <div className="Container">
            <h2>Delete this product?</h2>
            <p>{"Doing so will permanently delete this product's data"}</p>
        </div>
        <div className="Confirm">
        <span>Confirm you want to delete this product by typing its name: <b>{props.data?.name}</b></span>
            <Input onChange={handleChange}></Input>
        </div>
    </Modal>
}