import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { Provider } from "react-redux";
import store from "../redux/store";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { useEffect } from 'react';

export default function App({ Component, pageProps }: AppProps) {


  return        <Provider store={store}>
    <Component {...pageProps} />
    <ToastContainer autoClose={1500} />

  </Provider>
}
