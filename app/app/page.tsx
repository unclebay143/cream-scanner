"use client";

import { useState } from "react";
import { useEffect } from "react";
import ResultsScreen from "@/components/results-screen";
import UploadScreen from "@/components/upload-screen";
import ManualIngredientsForm from "../../components/manual-ingredients-form";
import { useSearchParams } from "next/navigation";

interface AnalysisResult {
  grade: string;
  verdict: string;
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

export default function Page() {
  const [manualModalOpen, setManualModalOpen] = useState(true); // always open for inline view
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null
  );
  const param = useSearchParams();
  const mode = param.get("mode");
  const [currentMode, setCurrentMode] = useState<string | null>(mode);

  // On mount, check localStorage for result if mode is 'result'
  useEffect(() => {
    if (currentMode === "result") {
      const stored = localStorage.getItem("creamAnalysisResult");
      if (stored) {
        try {
          setAnalysisResult(JSON.parse(stored));
        } catch {}
      }
    }
  }, [currentMode]);

  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyze = async (input: File[] | string) => {
    let res, data;
    try {
      setIsLoading(true);
      if (Array.isArray(input)) {
        // Image upload
        if (!input || input.length === 0) return;
        const formData = new FormData();
        input.forEach((file) => {
          formData.append("images", file);
        });
        res = await fetch("/api/analyze-cream", {
          method: "POST",
          body: formData,
        });
      } else {
        // Manual text
        res = await fetch("/api/analyze-cream", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ingredientsText: input }),
        });
      }
      data = await res.json();
      if (data.error) {
        setAnalysisResult(null);
        alert(data.error);
      } else {
        setAnalysisResult(data);
        localStorage.setItem("creamAnalysisResult", JSON.stringify(data));
        setCurrentMode("result");
        // Update the URL query param for mode
        const url = new URL(window.location.href);
        url.searchParams.set("mode", "result");
        window.history.replaceState({}, "", url.toString());
      }
    } catch (err) {
      setAnalysisResult(null);
      alert("Failed to analyze");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setAnalysisResult(null);
    setCurrentMode(null);
    // Clear mode from URL
    const url = new URL(window.location.href);
    url.searchParams.delete("mode");
    window.history.replaceState({}, "", url.toString());
  };

  return (
    <main className='flex justify-center items-center grow h-auto'>
      {!analysisResult && currentMode === "manual" && (
        <ManualIngredientsForm
          open={manualModalOpen}
          setOpen={setManualModalOpen}
          onSubmit={handleAnalyze}
          isLoading={isLoading}
        />
      )}

      {!analysisResult && currentMode === "upload" && (
        <UploadScreen onImageUpload={handleAnalyze} isLoading={isLoading} />
      )}

      {analysisResult && currentMode === "result" && (
        <ResultsScreen result={analysisResult} onReset={handleReset} />
      )}
    </main>
  );
}
