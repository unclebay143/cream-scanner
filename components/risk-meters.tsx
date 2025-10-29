"use client";

import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

interface RiskMetersProps {
  risks: {
    allergyRisk: number;
    toxicity: number;
    chemicalSensitivity: number;
    comedogenicity: number;
  };
}

const riskLabels = {
  allergyRisk: "Allergy Risk",
  toxicity: "Toxicity",
  chemicalSensitivity: "Chemical Sensitivity",
  comedogenicity: "Comedogenicity",
};

const riskIcons = {
  allergyRisk: (
    <span className='mr-1' style={{ color: "#6B7280" }}>
      🌸
    </span>
  ),
  toxicity: (
    <span className='mr-1' style={{ color: "#6B7280" }}>
      🧬
    </span>
  ),
  chemicalSensitivity: (
    <span className='mr-1' style={{ color: "#6B7280" }}>
      ⚗️
    </span>
  ),
  comedogenicity: (
    <span className='mr-1' style={{ color: "#6B7280" }}>
      💧
    </span>
  ),
};

const getRiskColor = (value: number) => {
  if (value <= 33) return "bg-green-500";
  if (value <= 66) return "bg-yellow-500";
  return "bg-red-500";
};

export default function RiskMeters({ risks }: RiskMetersProps) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className='p-6 bg-white border border-[#E0E0E0]'>
        <div className='space-y-6'>
          {Object.entries(risks).map(([key, value]) => (
            <div key={key}>
              <div className='flex justify-between items-center mb-2'>
                <label className='font-semibold text-[#222] flex items-center'>
                  {riskIcons[key as keyof typeof riskIcons]}
                  {riskLabels[key as keyof typeof riskLabels]}
                </label>
                <span className='text-sm font-bold text-[#666]'>{value}%</span>
              </div>
              <div className='w-full bg-[#E0E0E0] rounded-full h-3 overflow-hidden'>
                <div
                  className={`h-full ${getRiskColor(value)} transition-all`}
                  style={{ width: `${value}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
}
