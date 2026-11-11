import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  // Note: next/font/google fetches font files from Google servers at build time
  // and self-hosts them. No runtime CDN call is made.
});

export const metadata: Metadata = {
  title: "AI YouTube Content Studio",
  description:
    "Research trends, generate ideas, write scripts, produce thumbnails, and analyse performance — all in one AI-powered workflow.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
