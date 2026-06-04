import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import StarryBackground from "@/components/layout/StarryBackground";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { ToastProvider } from "@/components/ui/Toast";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "个人网站 - 探索我的数字宇宙",
    template: "%s | 个人网站",
  },
  description: "我的个人网站 - 展示项目、分享技术、记录生活",
  keywords: ["个人网站", "作品集", "技术博客", "项目展示", "音乐", "日记"],
  authors: [{ name: "个人" }],
  openGraph: {
    title: "个人网站 - 探索我的数字宇宙",
    description: "我的个人网站 - 展示项目、分享技术、记录生活",
    type: "website",
    locale: "zh_CN",
    siteName: "个人网站",
  },
  twitter: {
    card: "summary_large_image",
    title: "个人网站 - 探索我的数字宇宙",
    description: "我的个人网站 - 展示项目、分享技术、记录生活",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col font-sans theme-transition">
        <ThemeProvider>
          <ToastProvider>
            <StarryBackground />
            <Header />
            <main className="flex-1 pt-16">{children}</main>
            <Footer />
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
