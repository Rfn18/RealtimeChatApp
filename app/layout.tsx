import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "./contexts/auth-context";
import Navbar from "@/components/Navbar";
import { Poppins } from "next/font/google";

export const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Wasaphoo - Find Match",
  description:
    "Connect with like-minded people through live streaming, meaningful conversations, and authentic connections on StreamMatch.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${poppins.variable} antialiased h-full`}>
        <AuthProvider>
          <div className="h-full flex flex-col">
            <Navbar />
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
