import { Spin } from 'antd';
import React from 'react';
import styles from "@/styles/Home.module.css";


export const Loadding = () => {
    return (
        <div className={styles.Loading}>
            <Spin size="large" />
        </div>
    );
};

export const TableLoadding = () => {
    return (
        <div className={styles.TableLoading}>
            <Spin size="large" />
        </div>
    );
};