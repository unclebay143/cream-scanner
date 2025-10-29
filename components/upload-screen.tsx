"use client";

import type React from "react";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader } from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadScreenProps {
  onUpload?: () => void;
  onImageUpload?: (files: File[]) => Promise<void>;
  isLoading: boolean;
}

export default function UploadScreen({
  onUpload,
  onImageUpload,
  isLoading = true,
}: UploadScreenProps) {
  const [images, setImages] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith("image/")
    );

    addImages(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addImages(Array.from(e.target.files));
    }
  };

  const addImages = (newFiles: File[]) => {
    const combined = [...images, ...newFiles].slice(0, 3);
    setImages(combined);
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleAnalyze = () => {
    if (images.length > 0) {
      if (onImageUpload) {
        onImageUpload(images);
      } else if (onUpload) {
        onUpload();
      }
    }
  };

  return (
    <div className='py-8 px-4 w-full'>
      <div className='max-w-lg mx-auto w-full'>
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-bold text-[#222] mb-2'>Scan Cream</h1>
          <p className='text-[#666]'>
            Take a photo or upload an image of your cream
          </p>
        </div>

        <Card
          className={`p-8 relative w-full border-2 border-dashed transition-colors min-h-[400px] flex flex-col items-center justify-center ${
            dragActive
              ? "border-[#FFA94D] bg-orange-50"
              : "border-[#E0E0E0] bg-white"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {images.length === 0 ? (
            <div className='text-center'>
              <div className='text-5xl mb-4'>📷</div>
              <h2 className='text-lg font-semibold text-[#222] mb-1'>
                Take a photo
              </h2>
              <p className='text-sm text-[#666] mb-2'>and upload</p>

              <button
                onClick={() => fileInputRef.current?.click()}
                className='inline-block px-6 py-2 bg-[#FFA94D] hover:bg-[#FF9933] text-white font-semibold rounded-lg transition-colors'
              >
                Choose Image
              </button>

              <input
                ref={fileInputRef}
                type='file'
                multiple
                accept='image/*'
                onChange={handleFileSelect}
                className='hidden'
              />

              <p className='text-xs text-[#999] mt-4'>or drag and drop</p>
            </div>
          ) : (
            <div className='w-full flex flex-col justify-between grow gap-4'>
              {isLoading && (
                <div className='absolute left-0 top-0 w-full h-full pointer-events-none z-10 flex items-center justify-center'>
                  <div className='relative w-full h-full'>
                    <div
                      className='absolute left-0 w-full'
                      style={{
                        animation:
                          "scanY 1.2s cubic-bezier(.4,0,.2,1) infinite alternate",
                      }}
                    >
                      <div className='mx-auto w-full h-2 bg-linear-to-r from-[#FFA94D] via-[#FF9933] to-[#FFA94D] shadow-lg opacity-80' />
                    </div>
                  </div>
                </div>
              )}
              <style jsx global>{`
                @keyframes scanY {
                  0% {
                    top: 7%;
                  }
                  100% {
                    top: 92%;
                  }
                }
              `}</style>
              <div
                className={cn(
                  "w-full grow flex",
                  images.length === 1 && "flex-col",
                  images.length === 2 && "flex-col md:flex-row gap-3",
                  images.length === 3 && "grid grid-cols-2 gap-3"
                )}
              >
                {images.length === 1 && (
                  <div className='relative w-full'>
                    <img
                      src={URL.createObjectURL(images[0]) || "/placeholder.svg"}
                      alt={`Upload 1`}
                      className={cn(
                        "w-full h-68 object-cover rounded-lg",
                        isLoading && "h-[332px]"
                      )}
                    />
                    {isLoading && (
                      <div className='absolute inset-0 bg-white/40 animate-pulse flex items-center justify-center rounded-lg' />
                    )}
                    <button
                      onClick={() => removeImage(0)}
                      className='absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold hover:bg-red-600'
                      disabled={isLoading}
                    >
                      ×
                    </button>
                  </div>
                )}
                {images.length === 2 &&
                  images.map((img, idx) => (
                    <div key={idx} className='relative md:w-1/2'>
                      <img
                        src={URL.createObjectURL(img) || "/placeholder.svg"}
                        alt={`Upload ${idx + 1}`}
                        className={`w-full h-40 md:h-[332px] object-cover rounded-lg`}
                      />
                      {isLoading && (
                        <div className='absolute inset-0 bg-white/40 animate-pulse flex items-center justify-center rounded-lg' />
                      )}
                      <button
                        onClick={() => removeImage(idx)}
                        className='absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold hover:bg-red-600'
                        disabled={isLoading}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                {images.length === 3 && (
                  <>
                    <div className='relative col-span-2'>
                      <img
                        src={
                          URL.createObjectURL(images[0]) || "/placeholder.svg"
                        }
                        alt={`Upload 1`}
                        className={`w-full h-60 object-cover rounded-lg`}
                      />
                      {isLoading && (
                        <div className='absolute inset-0 bg-white/40 animate-pulse flex items-center justify-center rounded-lg' />
                      )}
                      <button
                        onClick={() => removeImage(0)}
                        className='absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold hover:bg-red-600'
                        disabled={isLoading}
                      >
                        ×
                      </button>
                    </div>
                    <div className='relative'>
                      <img
                        src={
                          URL.createObjectURL(images[1]) || "/placeholder.svg"
                        }
                        alt={`Upload 2`}
                        className={`w-full h-24 object-cover rounded-lg`}
                      />
                      {isLoading && (
                        <div className='absolute inset-0 bg-white/40 animate-pulse flex items-center justify-center rounded-lg' />
                      )}
                      <button
                        onClick={() => removeImage(1)}
                        className='absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold hover:bg-red-600'
                        disabled={isLoading}
                      >
                        X
                      </button>
                    </div>
                    <div className='relative'>
                      <img
                        src={
                          URL.createObjectURL(images[2]) || "/placeholder.svg"
                        }
                        alt={`Upload 3`}
                        className={`w-full h-24 object-cover rounded-lg`}
                      />
                      {isLoading && (
                        <div className='absolute inset-0 bg-white/40 animate-pulse flex items-center justify-center rounded-lg' />
                      )}
                      <button
                        onClick={() => removeImage(2)}
                        className='absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold hover:bg-red-600'
                        disabled={isLoading}
                      >
                        ×
                      </button>
                    </div>
                  </>
                )}
              </div>
              {isLoading || (
                <button
                  disabled={images.length >= 3 || isLoading}
                  onClick={() => fileInputRef.current?.click()}
                  className={cn(
                    "w-full py-2 border border-[#E0E0E0] text-[#222] font-semibold rounded-lg hover:bg-[#F5F5F5] transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
                    images.length === 3 && "hidden"
                  )}
                >
                  Add More
                </button>
              )}
              <input
                ref={fileInputRef}
                type='file'
                multiple
                accept='image/*'
                onChange={handleFileSelect}
                className='hidden'
              />
            </div>
          )}
        </Card>

        {images.length > 0 && (
          <Button
            onClick={handleAnalyze}
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
        )}
      </div>
    </div>
  );
}
