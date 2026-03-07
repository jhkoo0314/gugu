import type { Metadata } from "next";
import { WrongNoteView } from "@/components/WrongNoteView";

export const metadata: Metadata = {
  title: "오답노트",
  description: "틀린 문제를 모아 다시 복습하는 오답노트"
};

export default function WrongNotePage() {
  return <WrongNoteView />;
}
