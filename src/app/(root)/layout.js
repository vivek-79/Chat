
'use client'
import localFont from "next/font/local";
import "../globals.css";
import TopBar from '@/components/TopBar'
import BottomBar from "@/components/BottomBar";
import Provider from "@/components/Provider";

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
        <Provider>
          <div className="layout">
            <div className="layout-a">
              <TopBar />
            </div>
            <div className="layout-b">
              {children}
            </div>
            <div className="layout-c">
              <BottomBar />
            </div>
          </div>
        </Provider>
      </body>
    </html>
  );
}
