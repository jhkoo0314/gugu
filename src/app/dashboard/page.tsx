import type { Metadata } from "next";
import { DashboardView } from "@/components/DashboardView";

export const metadata: Metadata = {
  title: "학습 대시보드",
  description: "단별 성취도와 추천 학습을 확인하는 대시보드"
};

export default function DashboardPage() {
  return <DashboardView />;
}
