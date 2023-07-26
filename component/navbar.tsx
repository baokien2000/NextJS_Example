import React, { useEffect, useState } from "react";
import { LoginOutlined, GlobalOutlined } from "@ant-design/icons";
import styles from "@/styles/Navbar.module.css";
import { getLanguage, getUserInfo } from "@/redux/selector";
import { useDispatch, useSelector } from "react-redux";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/config";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import productSlice from "@/redux/slice/product";
import { LogoutModel } from "./productModel";
import Link from "next/link";
import { Select } from "antd";
import i18n from "@/i18n/i18n";
import { useTranslation } from "react-i18next";

const Navbar = () => {
    const userInfo = useSelector(getUserInfo);
    const [isModelOpen, setIsModelOpen] = useState(false);
    const router = useRouter();
    const dispatch = useDispatch();
    const handleSignOut = () => {
        setIsModelOpen(true);
    };
    const { t } = useTranslation();
    const selectedLanguage = useSelector(getLanguage)
    useEffect(() => {
        i18n.changeLanguage(selectedLanguage)
    },[selectedLanguage])
    const handleLanguageChange = (value: string) => {
        dispatch(productSlice.actions.setLanguage(value))
        i18n.changeLanguage(value)

    };
    console.log("render");
    return (
        <div className={styles.navbar}>
            <Link href={"/"}>
                <h2>Example App</h2>
            </Link>
            <div className={styles.UserName}>
                <Select
                    className="LanguageSelect"
                    defaultValue="vi"
                    value={selectedLanguage}
                    dropdownMatchSelectWidth={false}

                    onChange={handleLanguageChange}
                    suffixIcon  ={<GlobalOutlined style={{ fontSize: "18px" }} />}
                    options={[
                        { value: "vi", label: t('VN') },
                        { value: "en", label: t('EN') },
                        { value: "disabled1", label: "Tiếng Thái", disabled: true },
                        { value: "disabled2", label: "Tiếng Pháp", disabled: true },
                        { value: "disabled3", label: "Tiếng Trung", disabled: true },
                    ]}
                />
                <h3>{userInfo?.displayName}</h3>
                <LoginOutlined onClick={handleSignOut} style={{ cursor: "pointer" }} />
            </div>
            <LogoutModel setIsModelOpen={setIsModelOpen} isModelOpen={isModelOpen} />
        </div>
    );
};

export default Navbar;
