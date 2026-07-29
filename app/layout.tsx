import type { Metadata } from "next";
import "./globals.css";

const staticBasePath = process.env.GITHUB_PAGES === "true" ? "/barogging" : "";

export const metadata: Metadata = {
  metadataBase: new URL("https://padojoop-plogging.workspace-925535.chatgpt.site"),
  title: "바로깅 | 플로깅 리워드",
  description: "플로깅과 스마트 쓰레기통을 연결하는 해양 환경 리워드 서비스",
  icons: { icon: `${staticBasePath}/favicon.svg`, shortcut: `${staticBasePath}/favicon.svg` },
  openGraph: {
    title: "바로깅 | 걷고, 줍고, 바다를 바꾸다",
    description: "플로깅과 스마트 쓰레기통을 연결하는 해양 환경 리워드 서비스",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "바로깅 서비스 소개" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "바로깅 | 플로깅 리워드",
    description: "걷고, 줍고, 바다를 바꾸다",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
