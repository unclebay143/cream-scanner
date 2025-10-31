"use client";

import type React from "react";
import { CameraCapture } from "./upload-screen/CameraCapture";
import { UploadOptions } from "./upload-screen/UploadOptions";
import { ImageGrid } from "./upload-screen/ImageGrid";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader } from "lucide-react";

interface UploadScreenProps {
  onUpload?: () => void;
  onImageUpload?: (files: File[]) => Promise<void>;
  isLoading: boolean;
}

export default function UploadScreen({
  onUpload,
  onImageUpload,
  isLoading,
}: UploadScreenProps) {
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null | undefined>(
    undefined
  );
  const [previewActive, setPreviewActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const showPreview = previewActive && !!capturedImage;
  const showCameraVideo = cameraActive && !previewActive;
  const showUploadOptions =
    !cameraActive && !previewActive && images.length === 0;
  const showImageGrid = !cameraActive && !previewActive && images.length > 0;

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

  const initCamera = async () => {
    if (videoRef.current) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { exact: "environment" } },
        });
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
        };
        return true;
      } catch (err) {
        // fallback to default camera if environment is not available
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
          });
          videoRef.current.srcObject = stream;
          streamRef.current = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play();
          };
          return true;
        } catch (err2) {
          setCameraError(
            "Unable to access camera. Please check permissions and try again."
          );
          setCameraActive(false);
          return false;
        }
      }
    }
    return false;
  };

  const startCamera = async () => {
    setCameraActive(true);
    setCameraError(null);
    setTimeout(() => {
      initCamera();
    }, 100);
  };

  const stopCamera = () => {
    setCameraActive(false);
    setCameraError(null);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/jpeg");
        setCapturedImage(dataUrl);
        setPreviewActive(true);
        stopCamera(); // Stop camera immediately after capture
      }
    }
  };

  const useCapturedImage = () => {
    if (capturedImage) {
      // Convert dataURL to File
      fetch(capturedImage)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], `captured-${images.length + 1}.jpg`, {
            type: "image/jpeg",
          });
          addImages([file]);
          setCapturedImage(null);
          setPreviewActive(false);
          // If less than 3 images, keep camera open for next capture
          if (images.length + 1 < 3) {
            setCameraActive(true);
            setTimeout(() => {
              initCamera();
            }, 100);
          } else {
            stopCamera();
          }
        });
    }
  };

  const discardCapturedImage = () => {
    setCapturedImage(null);
    setPreviewActive(false);
    setCameraActive(true);
    setTimeout(() => {
      initCamera();
    }, 100);
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleAnalyze = () => {
    stopCamera();

    if (images.length > 0) {
      if (onImageUpload) {
        onImageUpload(images);
      } else if (onUpload) {
        onUpload();
      }
    }
  };

  return (
    <div className='px-4 w-full'>
      <div className='max-w-lg mx-auto w-full'>
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-bold text-[#222] mb-2'>Scan Cream</h1>
          <p className='text-[#666]'>
            Take a photo or upload an image of your cream
          </p>
        </div>

        <Card
          className={`p-8 relative w-full border-2 border-dashed transition-colors min-h-[468px] flex flex-col items-center justify-center ${
            dragActive
              ? "border-[#FFA94D] bg-orange-50"
              : "border-[#E0E0E0] bg-white"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {(cameraActive || previewActive) && (
            <CameraCapture
              previewActive={previewActive}
              capturedImage={capturedImage}
              cameraError={cameraError}
              showCameraVideo={showCameraVideo}
              showPreview={showPreview}
              imagesCount={images.length}
              videoRef={videoRef}
              canvasRef={canvasRef}
              onCapturePhoto={capturePhoto}
              onStopCamera={stopCamera}
              onUseCapturedImage={useCapturedImage}
              onDiscardCapturedImage={discardCapturedImage}
            />
          )}
          {showUploadOptions && (
            <UploadOptions
              onChooseImage={() => fileInputRef.current?.click()}
              onUseCamera={startCamera}
              fileInputRef={fileInputRef as React.RefObject<HTMLInputElement>}
              onFileSelect={handleFileSelect}
            />
          )}
          {showImageGrid && (
            <ImageGrid
              images={images}
              isLoading={isLoading}
              onRemoveImage={removeImage}
              onChooseImage={() => fileInputRef.current?.click()}
              onUseCamera={startCamera}
              fileInputRef={fileInputRef as React.RefObject<HTMLInputElement>}
              onFileSelect={handleFileSelect}
            />
          )}
        </Card>

        {images.length > 0 && (
          <Button
            onClick={handleAnalyze}
            className={`w-full mt-6 bg-[#FFA94D] hover:bg-[#FF9933] text-white font-semibold py-3 rounded-lg flex items-center justify-center ${
              isLoading ? "opacity-70 cursor-not-allowed" : ""
            }`}
            disabled={isLoading || cameraActive || previewActive}
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
