import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const gotham = localFont({
  src: [
    { path: "../../public/fonts/gotham/GothamHTF-Book.otf",      weight: "400", style: "normal" },
    { path: "../../public/fonts/gotham/GothamHTF-BookItalic.otf", weight: "400", style: "italic" },
    { path: "../../public/fonts/gotham/GothamHTF-Medium.otf",     weight: "500", style: "normal" },
    { path: "../../public/fonts/gotham/GothamHTF-Bold.otf",       weight: "700", style: "normal" },
    { path: "../../public/fonts/gotham/GothamHTF-Black.otf",      weight: "900", style: "normal" },
  ],
  variable: "--font-gotham",
});

export const metadata: Metadata = {
  title: "Roomchang Dental Hospital",
  description: "Premium multilingual dental care in Phnom Penh.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${gotham.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
