
'use client'
import localFont from "next/font/local";
import "../globals.css";
import { Provider } from "react-redux";
import store from './../../redux/store'
import TopBar from '@/components/TopBar'
import BottomBar from "@/components/BottomBar";

const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Provider store={store}>
          <TopBar/>
          {children}
          <BottomBar/>
        </Provider>
      </body>
    </html>
  );
}
