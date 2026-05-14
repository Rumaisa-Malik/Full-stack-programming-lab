import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Rustik Plank Furniture",
  description: "Dynamic furniture eCommerce application built with Next.js and Node.js.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-[#ededed] text-[#2f2f2f]">
        <Providers>
          <div className="min-h-screen">
            <Header />
            <main className="mx-auto w-full max-w-[1600px]">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
