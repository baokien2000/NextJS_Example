import Navbar from '@/component/navbar'
import { getLanguage } from '@/redux/selector';
import { Html, Head, Main, NextScript } from 'next/document'
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

export default function Document() {


  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
      
    </Html>
  )
}
