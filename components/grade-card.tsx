"use client";

import { Card } from "@/components/ui/card";

interface GradeCardProps {
  grade: string;
  verdict: string;
}

const gradeColors: Record<string, { bg: string; text: string; emoji: string }> =
  {
    A: { bg: "bg-green-100", text: "text-green-700", emoji: "🟢" },
    B: { bg: "bg-blue-100", text: "text-blue-700", emoji: "🔵" },
    C: { bg: "bg-yellow-100", text: "text-yellow-700", emoji: "🟡" },
    D: { bg: "bg-orange-100", text: "text-orange-700", emoji: "🟠" },
    F: { bg: "bg-red-100", text: "text-red-700", emoji: "🔴" },
  };

export default function GradeCard({ grade, verdict }: GradeCardProps) {
  const gradeBase = grade.charAt(0);
  const colors = gradeColors[gradeBase] || gradeColors["C"];

  return (
    <Card
      className={`p-8 text-center lg:w-2xl ${colors.bg} border border-[#f0f0f0]`}
    >
      <div className='text-5xl mb-4'>{colors.emoji}</div>
      <h2 className={`text-5xl font-bold ${colors.text} mb-2`}>
        Grade: {grade}
      </h2>
      <p className={`text-lg mx-auto ${colors.text}`}>{verdict}</p>
    </Card>
  );
}
