import type { Metadata } from "next";
import { AllDanPractice } from "@/components/AllDanPractice";

export const metadata: Metadata = {
  title: "전체 구구단 연습 공간",
  description: "2단부터 9단까지 전체 구구단을 보고 눌러보며 연습하는 공간"
};

export default function AllDanPage() {
  return <AllDanPractice />;
}
