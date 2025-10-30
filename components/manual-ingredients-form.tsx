"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScannerLoader } from "./upload-screen/ScannerLoader";
import { Loader } from "lucide-react";
import { cn } from "@/lib/utils";

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
        <div className='relative'>
          <ScannerLoader isLoading={isLoading} />
          <textarea
            className={cn(
              "w-full min-h-[300px] border border-[#E0E0E0] rounded-lg p-3 text-base focus:outline-none focus:ring-2 focus:ring-[#FFA94D]",
              isLoading && "animate-pulse"
            )}
            placeholder='e.g. Water, Glycerin, Cetyl Alcohol, Fragrance, ...'
            value={manualIngredients}
            onChange={(e) => setManualIngredients(e.target.value)}
            disabled={isLoading}
          />
        </div>

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
              <Loader className='animate-spin text-white' />
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
