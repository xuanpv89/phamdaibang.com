import { config } from "@/config";
import { signOgImageUrl } from "@/lib/og-image";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "./providers";

const fontSans = Inter({ subsets: ["latin"], variable: "--font-sans" });
const fontDisplay = localFont({
  src: "../../public/fonts/CalSans-SemiBold.ttf",
  variable: "--font-calsans",
});

export const metadata: Metadata = {
  metadataBase: new URL(config.baseUrl),
  title: {
    default: "Pham Dai Bang",
    template: "%s | phamdaibang.com",
  },
  description:
    "Trang cá nhân của Phạm Đại Bàng: bài viết, công việc, portfolio và thông tin liên hệ.",
  alternates: {
    canonical: "/",
    languages: {
      vi: "/vi",
      en: "/en",
    },
    types: {
      "application/rss+xml": "/rss",
    },
  },
  openGraph: {
    type: "website",
    url: config.baseUrl,
    siteName: "phamdaibang.com",
    title: "Pham Dai Bang",
    description:
      "Trang cá nhân của Phạm Đại Bàng: bài viết, công việc, portfolio và thông tin liên hệ.",
    images: [
      signOgImageUrl({
        title: "Pham Dai Bang",
      }),
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
          fontDisplay.variable
        )}
      >
        <Providers>
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
