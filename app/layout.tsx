import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "파도줍 | 플로깅 리워드",
  description: "플로깅과 스마트 쓰레기통을 연결하는 해양 환경 리워드 서비스",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
