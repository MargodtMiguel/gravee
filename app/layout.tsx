import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/app/nav";
import { Footer } from "@/components/app/footer";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://gravee.cc"),
  title: {
    default: "Gravee — Gravelroutes in Vlaanderen",
    template: "%s | Gravee",
  },
  description:
    "Vind de perfecte gravelroute voor jouw niveau en stijl, gecureerd door gravel-liefhebbers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Nav />
        {children}
        <Footer />
      </body>

      <Script
        defer
        src="https://analytics.app.twoave.be/script.js"
        data-website-id="ac3dd175-9ee1-48c1-b0d6-5c2c13dca8b4"
      ></Script>
    </html>
  );
}
