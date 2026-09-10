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
  metadataBase: new URL("https://www.temu.com"),
  alternates: {
    canonical: "https://www.temu.com",
  },
  openGraph: {
    title: "Temu | Discover Deals & Save on Everything",
    description:
      "Temu offers over a million products at up to 90% off. Shop trending items, home goods, fashion, electronics, and more.",
    url: "https://www.temu.com",
    siteName: "Temu",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/temu-og.svg",
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
    images: ["/temu-og.svg"],
  },
  themeColor: "#FB7802",
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
