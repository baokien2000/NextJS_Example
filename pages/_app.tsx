import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { Provider, useSelector } from "react-redux";
import store from "../redux/store";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { useEffect } from 'react';
import Navbar from '@/component/navbar';
import { getLanguage } from '@/redux/selector';

export default function App({ Component, pageProps }: AppProps) {

  return <Provider store={store}>
            <Navbar />

              <Component {...pageProps} />
    <ToastContainer autoClose={1500} />

  </Provider>
}
