import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "모두의창업",
  description: "AI 기반 F&B 창업 실행 리포트 데모"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
