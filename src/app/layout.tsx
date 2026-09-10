import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.temuonline.store"),

  title: "Temu | Discover Deals & Save on Everything",

  description:
    "Temu offers over a million products at up to 90% off. Shop trending items, home goods, fashion, electronics, and more. Free shipping on eligible orders.",

  keywords: [
    "Temu",
    "shopping",
    "deals",
    "discounts",
    "electronics",
    "fashion",
    "home",
    "gifts",
  ],

  authors: [{ name: "Temu" }],
  creator: "Temu",
  publisher: "Temu",

  alternates: {
    canonical: "https://www.temuonline.store",
  },

  openGraph: {
    title: "Temu | Discover Deals & Save on Everything",

    description:
      "Temu offers over a million products at up to 90% off. Shop trending items, home goods, fashion, electronics, and more.",

    url: "https://www.temuonline.store",

    siteName: "Temu",

    locale: "en_US",

    type: "website",

    images: [
      {
        url: "https://www.temuonline.store/temu-og.png",
        width: 1200,
        height: 630,
        alt: "Temu - Discover Deals & Save",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title: "Temu | Discover Deals & Save on Everything",

    description:
      "Temu offers over a million products at up to 90% off. Shop trending items, home goods, fashion, electronics, and more.",

    site: "@temu",
    creator: "@temu",

    images: ["https://www.temuonline.store/temu-og.png"],
  },

  themeColor: "#FB7802",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body>{children}</body>
    </html>
  );
}