import React, { useState } from "react";
import styles from "@/styles/Login.module.css";
import { Button, Input, Form } from "antd";
import Link from "next/link";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../firebase/config";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import productSlice from "@/redux/slice/product";
import { useRouter } from "next/router";

const SignUp = () => {
    const [form] = Form.useForm();
    const pass = Form.useWatch("password", form);
    const dispatch = useDispatch()
    const router = useRouter()

    const handleFinish = () => {
        const { email, password, name } = form.getFieldsValue();
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                updateProfile(user, {displayName: name});
                router.push("/")
            })
            .catch((error) => {
                const errorCode = error.code;
                if (errorCode === "auth/email-already-in-use") {
                    toast.error("That email address is already in use");
                } else {
                    toast.error("An error occurred. Please try again later.");
                }
            });
    };

    return (
        <div className={styles.LoginPage + " Login"}>
            <div className={styles.loginForm}>
                <h1>SIGN UP</h1>
                <Form form={form} onFinish={handleFinish}>
                    <Form.Item
                        label="Name"
                        // style={{ marginBottom: "10px" }}
                        name={"name"}
                        rules={[{ required: true, message: "Please input your name!" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Email"
                        // style={{ marginBottom: "10px" }}
                        name="email"
                        rules={[
                            { required: true, message: "Please input your email!" },
                            { type: "email", message: "Your email is not valid!" },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        // style={{ marginBottom: "10px" }}
                        rules={[{ required: true, message: "Please input your password!" }]}
                        label="Password"
                        name={"password"}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item
                        // style={{ marginBottom: "15px" }}
                        rules={[
                            { required: true, message: "Please input your confirm password!" },
                            {
                                message: "Your password is not match!",
                                validator: (_, value) => {
                                    if (value === pass) {
                                        return Promise.resolve();
                                    } else {
                                        return Promise.reject("Some message here");
                                    }
                                },
                            },
                        ]}
                        label="Confirm Password"
                        name={"confirmPassword"}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                        style={{ marginTop: "15px" }}

                    >
                        <Button size="large" htmlType="submit">
                            SIGN UP
                        </Button>
                    </Form.Item>
                </Form>
                <div className={styles.footer}>
                    <span>
                        Alreadly a user?{" "}
                        <Link href="./login" style={{ color: "#000" }}>
                            LOGIN
                        </Link>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
