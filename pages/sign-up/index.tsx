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
import { useTranslation } from "react-i18next";

const SignUp = () => {
    const {t} = useTranslation()
    
    const [form] = Form.useForm();
    const pass = Form.useWatch("password", form);
    const InputName = Form.useWatch("name", form);
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
                    toast.error(t("EmailIsExisted"));
                } else {
                    toast.error(t('ErrorToast'));
                }
            });
    };

    return (
        <div className={styles.LoginPage + " Login"}>
            <div className={styles.loginForm}>
                <h1>{t("SignUp")}</h1>
                <Form form={form} onFinish={handleFinish}>
                    <Form.Item
                        label={t("Name")}
                        // style={{ marginBottom: "10px" }}
                        name={"name"}
                        rules={[
                            { required: true, message: t('Name') },
                            { min: 3, message: t("NameAtLeastChar") },
                            { max: 20, message: t("NameAtMostChar") },

                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Email"
                        // style={{ marginBottom: "10px" }}
                        name="email"
                        rules={[
                            { required: true, message: t("EmailEmptyError") },
                            { type: "email", message: t("EmailInValidError") },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        // style={{ marginBottom: "10px" }}
                        rules={[
                            { required: true, message: t("PassEmptyError") },
                            { min: 6, message: t("PassAtLeastChar")},
                            { max: 20, message:t("PassAtMostChar") },
                        ]}
                        label={t("Password")}
                        name={"password"}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item
                        // style={{ marginBottom: "15px" }}
                        rules={[
                            { required: true, message: t("ConfirmPassEmptyError") },
                            { pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])/, message: t("PassIncludeSpecialChar") },
                            {
                                message: t("PasswordNotMatch"),
                                validator: (_, value) => {
                                    if (value === pass) {
                                        return Promise.resolve();
                                    } else {
                                        return Promise.reject("Some message here");
                                    }
                                },
                            },
                        ]}
                        label={t("ConfirmPassword")}
                        name={"confirmPassword"}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                        style={{ marginTop: "15px" }}

                    >
                        <Button size="large" htmlType="submit">
                            {t("SignUp")}
                        </Button>
                    </Form.Item>
                </Form>
                <div className={styles.footer}>
                    <span>
                        {t("AlreadlyUser")+ " "}
                        <Link href="./login" style={{ color: "#000" }}>
                            {t("SignIn")}
                        </Link>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
