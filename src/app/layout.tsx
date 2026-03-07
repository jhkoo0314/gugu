import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "두쫀모찌 연습장",
  description: "밝고 예쁜 분위기에서 구구단을 연습하는 웹앱"
};

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
