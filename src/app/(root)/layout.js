import { Inter } from "next/font/google";
import "../globals.css";
import Provider from "../../components/Provider";
import TopBar from "../../components/TopBar";
import BottomBar from "../../components/BottomBar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Halo Chat App",
  description: "A Next.js 14 Chat App ",
  visualViewport:"width=device-width, initial-scale=1, viewport-fit=cover",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-blue-2`}>
        <Provider>
          <TopBar />
          {children}
          <BottomBar />
        </Provider>
      </body>
    </html>
  );
}