import { Roboto } from "next/font/google";
import "./globals.css";
import { Headers } from "../components/layout/Headers";
import { SessionProvider } from "next-auth/react";
import { AppProvider } from "../components/AppContext";
import { Toaster } from 'react-hot-toast';
import pizzaFavicon from "../../public/Pizza_icon.jpeg"

const roboto = Roboto({ subsets: ["latin"], weight: ["400", "500", "700"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <title>Slice Haven</title>
        <link rel="icon" href="/Pizza_icon_2.jpeg" type="image/jpeg" />
      </head>
      <body className={roboto.className}>
        <div className="max-w-6xl mx-auto p-4">
          <AppProvider>
            <Toaster />
            <Headers />            
            {children}
            <footer className="border-t p-8 text-center text-gray-500 mt-16">
              &copy; 2024 All rights reserved
            </footer>
          </AppProvider>
        </div>
      </body>
    </html>
  );
}
