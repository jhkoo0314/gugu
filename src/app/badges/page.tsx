import type { Metadata } from "next";
import { BadgesView } from "@/components/BadgesView";

export const metadata: Metadata = {
  title: "배지 컬렉션",
  description: "획득한 배지와 잠긴 배지를 확인하는 페이지"
};

export default function BadgesPage() {
  return <BadgesView />;
}
