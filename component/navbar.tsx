import React, { useState } from 'react';
import {LoginOutlined} from "@ant-design/icons"
import styles from '@/styles/Navbar.module.css'
import { getUserInfo } from '@/redux/selector';
import {useDispatch, useSelector } from "react-redux";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/config";
import { useRouter } from 'next/router'
import { toast } from "react-toastify";
import productSlice from '@/redux/slice/product';
import { LogoutModel } from './productModel';
import Link from 'next/link'
const Navbar = () => {
    const userInfo = useSelector(getUserInfo)
    const [isModelOpen,setIsModelOpen]= useState(false)
    const router = useRouter()
    const dispatch = useDispatch()
    const handleSignOut = () => {
        setIsModelOpen(true)
        // signOut(auth).then(() => {
        //     dispatch(productSlice.actions.setProducts([]))
        //     router.push("/login")
        // }).catch((error) => {
        //         toast.error("An error occurred. Please try again later.");
        // });
    }
    return (
        <div className={styles.navbar}>
            <Link href={"/"}>
            <h2>Example App</h2>
            </Link>
            <div className={styles.UserName}>
                <h3>{userInfo?.displayName}</h3>
                <LoginOutlined onClick={handleSignOut} style={{cursor:"pointer"}}/>
            </div>
            <LogoutModel setIsModelOpen={setIsModelOpen} isModelOpen={isModelOpen} />
        </div>
    );
};

export default Navbar;