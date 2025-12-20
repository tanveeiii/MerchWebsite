import "./globals.css";
import { Poppins } from "next/font/google";
import ChatWidget from "@/components/ChatWidget"; // <--- 1. Import the ChatWidget

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata = {
  title: "TeeCustoms",
  description: "Custom vibrant t-shirt designs",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={poppins.className}>
      <body className="bg-white text-gray-900">
        {children}
        
        <ChatWidget /> 
      </body>
    </html>
  );
}