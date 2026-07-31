import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Google Fonts Inter 적용
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "아궁진영의 수학교실 | 모던 네온 교육용 웹앱",
  description: "최신 트렌드의 세련된 네온 오락실 감성 교육용 수학교실 플랫폼입니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#0f172a] text-slate-100 selection:bg-[#ff007f] selection:text-white">
        {children}
      </body>
    </html>
  );
}
