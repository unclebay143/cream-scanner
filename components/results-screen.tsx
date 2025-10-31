"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import GradeCard from "./grade-card";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import IngredientBreakdown from "./ingredient-breakdown";
import RiskMeters from "./risk-meters";

export interface AnalysisResult {
  grade: string;
  verdict: string;
  confidence: string | number;
  ingredients: Array<{
    name: string;
    description: string;
    safety: "safe" | "caution" | "avoid";
  }>;
  risks: {
    allergyRisk: number;
    toxicity: number;
    chemicalSensitivity: number;
    comedogenicity: number;
  };
  recommendations: string[];
}

interface ResultsScreenProps {
  result: AnalysisResult;
  onReset: () => void;
}

export default function ResultsScreen({ result, onReset }: ResultsScreenProps) {
  const [showConfetti, setShowConfetti] = useState(true);
  const recommendations = result?.recommendations || [];
  const ingredients = result?.ingredients || [];
  const risks = result?.risks || {
    allergyRisk: 0,
    toxicity: 0,
    chemicalSensitivity: 0,
    comedoGenicity: 0,
  };
  const confidence =
    typeof result.confidence === "number"
      ? result.confidence
      : parseInt(result.confidence || "0", 10);

  const handleReset = () => {
    localStorage.removeItem("creamAnalysisResult");
    onReset();
  };

  return (
    <div className='py-8 px-4'>
      <Confetti
        width={typeof window !== "undefined" ? window.innerWidth : 1200}
        height={typeof window !== "undefined" ? window.innerHeight : 800}
        recycle={false}
        colors={["#FFA94D"]}
      />
      <div className='max-w-2xl mx-auto'>
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-bold text-[#222] mb-2'>Your Results</h1>
          <p className='text-[#666]'>Here's what we found in your cream</p>
        </div>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <GradeCard
            grade={result.grade}
            verdict={result.verdict}
            confidence={confidence}
          />
        </motion.div>

        <div className='mt-8'>
          <h2 className='text-2xl font-bold text-[#222] mb-4'>
            Risk Assessment
          </h2>
          <RiskMeters risks={risks} />
        </div>

        {ingredients.length > 0 && (
          <div className='mt-8'>
            <h2 className='text-2xl font-bold text-[#222] mb-2'>
              Ingredient Breakdown
            </h2>
            <div className='mb-4 text-sm text-[#666] font-medium'>
              Total Ingredients:{" "}
              <span className='font-bold text-[#222]'>
                {ingredients.length}
              </span>
            </div>
            <IngredientBreakdown ingredients={ingredients} />
          </div>
        )}

        {recommendations.length > 0 && (
          <div className='mt-8'>
            <h2 className='text-2xl font-bold text-[#222] mb-4'>
              Recommendations
            </h2>
            <Card className='p-6 bg-white border border-[#E0E0E0]'>
              <ul className='space-y-3'>
                {recommendations.map((rec, idx) => (
                  <li key={idx} className='flex items-start gap-3'>
                    <span className='text-[#FFA94D] font-bold mt-1'>•</span>
                    <span className='text-[#333]'>{rec}</span>
                  </li>
                ))}
              </ul>
            </Card>
            <div className='mt-4 flex items-center justify-center'>
              <div className='flex items-center gap-2 px-4 py-2 bg-[#FFF7ED] border border-[#F3E8D2] rounded-lg text-xs text-[#92400e] font-medium shadow-sm'>
                {/* <span className='text-lg' aria-label='info'>
                  ℹ️
                </span> */}
                <span>
                  This analysis is for informational purposes only and not a
                  substitute for professional dermatological advice.
                </span>
              </div>
            </div>
          </div>
        )}

        <Button
          onClick={handleReset}
          className='w-full mt-4 bg-[#FFA94D] hover:bg-[#FF9933] text-white font-semibold py-3 rounded-lg'
        >
          Analyze Another Cream
        </Button>
      </div>
    </div>
  );
}
