import React, { useEffect } from "react";
import styles from "@/styles/Login.module.css";
import { Button, Input, Modal, Form } from "antd";
import Link from "next/link";
import { db } from "../../firebase/config";
import firebase, { auth } from "../../firebase/config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import productSlice from "@/redux/slice/product";
import { useRouter } from 'next/router'
import { toast } from "react-toastify";
import { ILogin } from "@/interface";
import {GoogleOutlined} from "@ant-design/icons"
import { getLanguage } from "@/redux/selector";
import { useTranslation } from "react-i18next";

const Login = () => {
    const dispatch = useDispatch() 
    const router = useRouter()
    const selectedLanguage = useSelector(getLanguage)  
    const { t } = useTranslation();

    const handleFinish = (value : ILogin) => {
        const {email,password} = value
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                const userInfo = {...user.providerData[0],userId: user.uid}
                dispatch(productSlice.actions.setUserInfo(userInfo))
                router.push("/")
            })
            .catch((error) => {
                toast.error(t("EmailorPassError"))
            });


    }

    const handleGGLogin =  () => {
        const ggProvider = new firebase.auth.GoogleAuthProvider()
        auth.signInWithPopup(ggProvider).then().catch((error) => {console.log(error)})
    }

    useEffect(() => {
        const authChange = auth.onAuthStateChanged((user) => {
            if (user === null) {
                return;
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
                router.push("/");
            }
        });

        return authChange;
    }, [dispatch, router]);
    
    return (
        <div className={styles.LoginPage + " Login"}>
            <div className={styles.loginForm}>
                <h1>{t("SignIn")}</h1>
                <Form onFinish={handleFinish}>
                    <Form.Item
                        rules={[
                            { required: true, message: t("EmailEmptyError") },
                            { type: 'email', message: t("EmailInValidError") },
                        ]}
                        style={{ marginBottom: "13px" }}
                        label={"Email"}
                        name={"email"}>
                        <Input />
                    </Form.Item>
                    <Form.Item
                        rules={[
                            { required: true, message: t("PassEmptyError") },
                        ]}
                        label={t("Password")}
                        name={"password"}>
                        <Input.Password/>
                    </Form.Item>

                    <Form.Item>
                        <Button htmlType="submit" size="large">
                            {t("SignIn")}
                        </Button>
                    </Form.Item>
                    <Form.Item>
                        <Button className="GGSignIn" onClick={handleGGLogin} size="large" icon={<GoogleOutlined style={{ fontSize: "18px" }} />}>
                                {t("GGSingIn")}
                        </Button>
                    </Form.Item>
                </Form>
                <div className={styles.footer}>
                    <span>{t("OrSignUpUsing")}</span>
                    <Link href={"/sign-up"}>{t("SignUp")}</Link>
                </div>
                
            </div>

        </div>
    );
};

export default Login;
