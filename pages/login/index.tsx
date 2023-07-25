import React, { useEffect } from "react";
import styles from "@/styles/Login.module.css";
import { Button, Input, Modal, Form } from "antd";
import Link from "next/link";
import { db } from "../../firebase/config";
import firebase, { auth } from "../../firebase/config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useDispatch } from "react-redux";
import productSlice from "@/redux/slice/product";
import { useRouter } from 'next/router'
import { toast } from "react-toastify";
import { ILogin } from "@/interface";
import {GoogleOutlined} from "@ant-design/icons"
import { error } from "console";
const Login = () => {
    const dispatch = useDispatch() 
    const router = useRouter()
    const [form] = Form.useForm()
    // "baokien@gmail.com"
    // 123456789
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
                toast.error("The email or password is not correct")
            });


    }

    const handleGGLogin =  () => {
        const ggProvider = new firebase.auth.GoogleAuthProvider()
        auth.signInWithPopup(ggProvider).then((result) => {
        }).catch((error) => {
            console.log(error);
        })

    //     const userInfo = {
    // email: string;
    // phoneNumber: string;
    // photoURL: string;
    // providerId: string;
    // uid: string;
    //     }
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
    }, []);
    
    return (
        <div className={styles.LoginPage + " Login"}>
            <div className={styles.loginForm}>
                <h1>SIGN IN</h1>
                <Form onFinish={handleFinish}>
                    <Form.Item
                        rules={[
                            { required: true, message: 'Please input your email!' },
                            { type: 'email', message: 'Your email is not valid!' },
                        ]}
                        style={{ marginBottom: "13px" }}
                        label="Email"
                        name={"email"}>
                        <Input />
                    </Form.Item>
                    <Form.Item
                        rules={[
                            { required: true, message: 'Please input your password!' },
                        ]}
                        label="Password"
                        name={"password"}>
                        <Input.Password/>
                    </Form.Item>

                    <Form.Item>
                        <Button htmlType="submit" size="large">
                            LOGIN
                        </Button>
                    </Form.Item>
                    <Form.Item>
                        <Button className="GGSignIn" onClick={handleGGLogin} size="large" icon={<GoogleOutlined style={{ fontSize: "18px" }} />}>
                                Sign In with Google
                        </Button>
                    </Form.Item>
                </Form>
                <div className={styles.footer}>
                    <span>Or Sign Up Using</span>
                    <Link href={"/sign-up"}>SIGN UP</Link>
                </div>
                
            </div>

        </div>
    );
};

export default Login;
