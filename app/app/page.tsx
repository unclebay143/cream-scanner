"use client";

import { useRef, useState } from "react";
import { useEffect } from "react";
import ResultsScreen, { AnalysisResult } from "@/components/results-screen";
import UploadScreen from "@/components/upload-screen";
import ManualIngredientsForm from "../../components/manual-ingredients-form";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

export default function Page() {
  const [manualModalOpen, setManualModalOpen] = useState(true);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null
  );
  const param = useSearchParams();
  const mode = param.get("mode");

  const [currentMode, setCurrentMode] = useState<string | null>(mode);
  const [isLoading, setIsLoading] = useState(false);
  const analysisTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [showToast, setShowToast] = useState(false);
  const isLoadingRef = useRef(false);

  const switchScreenModeTo = (screen: "upload" | "result") => {
    const url = new URL(window.location.href);
    setCurrentMode(screen);
    url.searchParams.set("mode", screen);
    window.history.replaceState({}, "", url.toString());
  };

  useEffect(() => {
    if (currentMode === "result") {
      const stored = localStorage.getItem("creamAnalysisResult");
      if (stored) {
        try {
          setAnalysisResult(JSON.parse(stored));
        } catch {}
      } else {
        switchScreenModeTo("upload");
      }
    }

    if (!currentMode) {
      switchScreenModeTo("upload");
    }
  }, [currentMode]);

  const handleAnalyze = async (input: File[] | string) => {
    let res, data;
    try {
      setIsLoading(true);
      isLoadingRef.current = true;

      analysisTimeoutRef.current = setTimeout(() => {
        if (isLoadingRef.current) {
          setShowToast(true);
        }
      }, 10000);

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
        switchScreenModeTo("result");
      }
    } catch (err) {
      setAnalysisResult(null);
      alert("Failed to analyze");
    } finally {
      setIsLoading(false);
      isLoadingRef.current = false;
      setShowToast(false);
    }
  };

  const handleReset = () => {
    setAnalysisResult(null);
    switchScreenModeTo("upload");
  };

  return (
    <main className='flex flex-col relative justify-center items-center grow h-auto'>
      {showToast && (
        <motion.div
          initial={{ scale: 0.96, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.96, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className='w-full absolute top-0 left-0 px-3 z-50'
        >
          <div
            className='max-w-lg w-full mx-auto mt-6 mb-2 px-4 py-3 sm:px-6 sm:py-4 rounded-2xl text-center flex flex-col items-center sm:gap-2 shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-[#facc15]'
            style={{ background: "#fff7ed", color: "#92400e" }}
          >
            <div className='flex items-start sm:items-center gap-2 mb-1'>
              <span className='mt-0.5 sm:mt-0 inline-flex h-3 w-3 rounded-full bg-[#facc15] animate-dot-pulse'></span>
              <span className='font-semibold text-xs sm:text-base tracking-wide'>
                Still scanning your cream...
                <br className='sm:hidden' /> hang tight 🌿
              </span>
            </div>
            <div className='text-xs sm:text-sm font-medium opacity-80'>
              ...this may take up to a minute during high traffic.
            </div>
            <style jsx>{`
              @keyframes dotPulse {
                0% {
                  opacity: 0.3;
                  transform: scale(1);
                }
                50% {
                  opacity: 1;
                  transform: scale(1.3);
                }
                100% {
                  opacity: 0.3;
                  transform: scale(1);
                }
              }
              .animate-dot-pulse {
                animation: dotPulse 1.2s infinite cubic-bezier(0.4, 0, 0.2, 1);
              }
            `}</style>
          </div>
        </motion.div>
      )}

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
