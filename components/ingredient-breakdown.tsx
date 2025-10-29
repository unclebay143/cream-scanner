"use client";

import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

interface Ingredient {
  name: string;
  description: string;
  safety: "safe" | "caution" | "avoid";
}

interface IngredientBreakdownProps {
  ingredients: Ingredient[];
}

const safetyIndicators = {
  safe: { emoji: "🟢", label: "Safe", color: "text-green-600" },
  caution: { emoji: "🟡", label: "Caution", color: "text-yellow-600" },
  avoid: { emoji: "🔴", label: "Avoid", color: "text-red-600" },
};

export default function IngredientBreakdown({
  ingredients,
}: IngredientBreakdownProps) {
  const groupsBySafety = ["safe", "caution", "avoid"].map((safety) => {
    return {
      safety: safety as keyof typeof safetyIndicators,
      items: ingredients.filter((i) => i.safety === safety),
    };
  });

  return (
    <div className='space-y-6'>
      {groupsBySafety.map(
        (group) =>
          group.items.length > 0 && (
            <div key={group.safety}>
              <div className='mb-2 flex items-center gap-1'>
                <span className='text-sm text-[#222]/70'>
                  {safetyIndicators[group.safety].label}
                </span>
                <span className='text-xs text-[#666]'>
                  ({group.items.length})
                </span>
              </div>
              <div className='space-y-3'>
                {group.items.map((ingredient, idx) => (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.5 }}
                    key={ingredient.name + idx}
                  >
                    <Card className='p-4 bg-white border border-[#f0f0f0] hover:shadow-md transition-shadow'>
                      <div className='flex items-start gap-4'>
                        <div className='text-2xl'>
                          {safetyIndicators[group.safety].emoji}
                        </div>
                        <div className='flex-1'>
                          <div className='w-full flex justify-between items-start sm:items-center gap-5'>
                            <h3 className='font-semibold text-[#222]'>
                              {ingredient.name}
                            </h3>
                            <span
                              className={`text-sm font-medium ${
                                safetyIndicators[group.safety].color
                              } whitespace-nowrap`}
                            >
                              {safetyIndicators[group.safety].label}
                            </span>
                          </div>
                          <p className='text-sm text-[#666] mt-1 md:pr-24 block'>
                            {ingredient.description}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          )
      )}
    </div>
  );
}
