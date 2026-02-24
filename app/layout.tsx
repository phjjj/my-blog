import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const notoSansKR = Noto_Sans_KR({
  variable: "--font-muji",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "데브.로그",
    template: "%s | 데브.로그",
  },
  description:
    "생각과 코드 조각, 그리고 아키텍처 탐구에 대한 디지털 아카이브. 소프트웨어를 만들어가는 여정을 기록합니다.",
  openGraph: {
    type: "website",
    locale: "ko_KR",
    title: "데브.로그",
    description:
      "생각과 코드 조각, 그리고 아키텍처 탐구에 대한 디지털 아카이브.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${notoSansKR.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
