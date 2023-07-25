import { Spin } from 'antd';
import React from 'react';
import styles from "@/styles/Home.module.css";

const Loadding = () => {
    return (
        <div className={styles.Loading}>
            <Spin size="large" />
        </div>
    );
};

export default Loadding;