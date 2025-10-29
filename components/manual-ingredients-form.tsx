"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface ManualIngredientsModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSubmit: (ingredientsText: string) => Promise<void>;
  isLoading: boolean;
}

export default function ManualIngredientsModal({
  onSubmit,
  isLoading,
}: ManualIngredientsModalProps) {
  const [manualIngredients, setManualIngredients] = useState("");

  return (
    <div className='max-w-lg mx-auto w-full'>
      <div className='text-center mb-8'>
        <h1 className='text-3xl font-bold text-[#222] mb-2'>
          Enter Ingredients
        </h1>
        <p className='text-[#666]'>
          Paste or type the full list of ingredients
        </p>
      </div>
      <div className='w-full max-w-lg mx-auto p-8 bg-white rounded-lg min-h-[400px] border-2 border-dashed border-[#E0E0E0]'>
        <textarea
          className='w-full min-h-[300px] border border-[#E0E0E0] rounded-lg p-3 text-base focus:outline-none focus:ring-2 focus:ring-[#FFA94D]'
          placeholder='e.g. Water, Glycerin, Cetyl Alcohol, Fragrance, ...'
          value={manualIngredients}
          onChange={(e) => setManualIngredients(e.target.value)}
          disabled={isLoading}
        />

        <Button
          onClick={async () => {
            await onSubmit(manualIngredients);
            setManualIngredients("");
          }}
          className={`w-full mt-6 bg-[#FFA94D] hover:bg-[#FF9933] text-white font-semibold py-3 rounded-lg flex items-center justify-center ${
            isLoading ? "opacity-70 cursor-not-allowed" : ""
          }`}
          disabled={isLoading}
        >
          {isLoading ? (
            <span className='flex items-center justify-center gap-2'>
              <svg
                className='animate-spin h-5 w-5 text-white'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
              >
                <circle
                  className='opacity-25'
                  cx='12'
                  cy='12'
                  r='10'
                  stroke='currentColor'
                  strokeWidth='4'
                ></circle>
                <path
                  className='opacity-75'
                  fill='currentColor'
                  d='M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z'
                ></path>
              </svg>
              Analyzing...
            </span>
          ) : (
            "Analyze Cream"
          )}
        </Button>
      </div>
    </div>
  );
}
