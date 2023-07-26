/** @type {import('next').NextConfig} */
// import dotenv from 'dotenv'
// dotenv.config()

// require('dotenv').config()
const nextConfig = {
  reactStrictMode: true,
  env: {
    APIKEY: process.env.APIKEY,
    AUTHDOMAIN: process.env.AUTHDOMAIN,
    PROJECTID: process.env.PROJECTID,
    STRORAGEBUCKET: process.env.STRORAGEBUCKET,
    APPID: process.env.APPID,
    MEASUREMENTID: process.env.MEASUREMENTID,
    MESSAGINGSENDERID: process.env.MESSAGINGSENDERID,
  },
}

module.exports = nextConfig
