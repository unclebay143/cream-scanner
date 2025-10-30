import React, { useRef } from "react";

interface CameraCaptureProps {
  previewActive: boolean;
  capturedImage: string | null;
  cameraError: string | null;
  showCameraVideo: boolean;
  showPreview: boolean;
  imagesCount: number;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  onCapturePhoto: () => void;
  onStopCamera: () => void;
  onUseCapturedImage: () => void;
  onDiscardCapturedImage: () => void;
}

export function CameraCapture({
  capturedImage,
  cameraError,
  showCameraVideo,
  showPreview,
  imagesCount,
  videoRef,
  canvasRef,
  onCapturePhoto,
  onStopCamera,
  onUseCapturedImage,
  onDiscardCapturedImage,
}: CameraCaptureProps) {
  return (
    <div className='flex flex-col items-center w-full'>
      {showCameraVideo && (
        <div
          className='w-full max-h-80 rounded-lg bg-black flex items-center justify-center'
          style={{ minHeight: 320 }}
        >
          <video
            ref={videoRef}
            className='rounded-lg w-full max-h-80 bg-black'
            autoPlay
            playsInline
            style={{ background: cameraError ? "#fff7ed" : undefined }}
          />
        </div>
      )}
      <canvas ref={canvasRef} className='hidden' />
      {cameraError && (
        <div className='text-[#92400e] bg-[#fff7ed] rounded-lg p-4 mt-4 w-full text-center'>
          {cameraError}
        </div>
      )}
      {showCameraVideo && !cameraError && (
        <div className='flex gap-4 mt-4 w-full'>
          <button
            onClick={onCapturePhoto}
            disabled={!!capturedImage || imagesCount >= 3}
            className='w-full px-6 py-2 bg-[#FFA94D] hover:bg-[#FF9933] text-white font-semibold rounded-lg transition-colors disabled:opacity-50'
          >
            Capture
          </button>
          <button
            onClick={onStopCamera}
            className='w-full px-6 py-2 bg-gray-200 hover:bg-gray-300 text-[#222] font-semibold rounded-lg transition-colors'
          >
            {imagesCount > 0 ? "Done" : "Cancel"}
          </button>
        </div>
      )}
      {showPreview && (
        <div className='flex flex-col items-center w-full'>
          <div className='rounded-lg overflow-hidden h-80 w-full mb-4'>
            <img
              src={capturedImage || undefined}
              alt='Captured'
              className='w-full h-full object-cover'
            />
          </div>
          <div className='flex flex-col sm:flex-row gap-3 w-full'>
            <button
              onClick={onUseCapturedImage}
              className='w-full px-6 py-2 bg-[#FFA94D] hover:bg-[#FF9933] text-white font-semibold rounded-lg transition-colors'
            >
              Use Photo
            </button>
            <button
              onClick={onDiscardCapturedImage}
              className='w-full px-6 py-2 bg-gray-200 hover:bg-gray-300 text-[#222] font-semibold rounded-lg transition-colors'
            >
              Retake
            </button>
          </div>
        </div>
      )}
      <div className='text-xs text-[#92400e] mt-2'>
        {imagesCount + (capturedImage ? 1 : 0)} / 3 photos
      </div>
    </div>
  );
}
