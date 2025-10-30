import React from "react";
import { ScannerLoader } from "./ScannerLoader";

interface ImageGridProps {
  images: File[];
  isLoading: boolean;
  onRemoveImage: (index: number) => void;
  onChooseImage: () => void;
  onUseCamera: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ImageGrid({
  images,
  isLoading,
  onRemoveImage,
  onChooseImage,
  onUseCamera,
  fileInputRef,
  onFileSelect,
}: ImageGridProps) {
  return (
    <div className='w-full flex flex-col justify-between grow gap-4'>
      <ScannerLoader isLoading={isLoading} />
      <div
        className={
          images.length === 1
            ? "w-full grow flex flex-col"
            : images.length === 2
            ? "w-full grow flex flex-col md:flex-row gap-3"
            : images.length === 3
            ? "w-full grow grid grid-cols-2 gap-3"
            : "w-full grow flex"
        }
      >
        {images.length === 1 && (
          <div className='relative w-full'>
            <img
              src={URL.createObjectURL(images[0]) || "/placeholder.svg"}
              alt={`Upload 1`}
              className={
                "w-full h-[332px] object-cover rounded-lg" +
                (isLoading ? " h-[332px]" : "")
              }
            />
            {isLoading && (
              <div className='absolute inset-0 bg-white/40 animate-pulse flex items-center justify-center rounded-lg' />
            )}
            <button
              onClick={() => onRemoveImage(0)}
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
                className='w-full h-40 md:h-[332px] object-cover rounded-lg'
              />
              {isLoading && (
                <div className='absolute inset-0 bg-white/40 animate-pulse flex items-center justify-center rounded-lg' />
              )}
              <button
                onClick={() => onRemoveImage(idx)}
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
                src={URL.createObjectURL(images[0]) || "/placeholder.svg"}
                alt={`Upload 1`}
                className='w-full h-60 object-cover rounded-lg'
              />
              {isLoading && (
                <div className='absolute inset-0 bg-white/40 animate-pulse flex items-center justify-center rounded-lg' />
              )}
              <button
                onClick={() => onRemoveImage(0)}
                className='absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold hover:bg-red-600'
                disabled={isLoading}
              >
                ×
              </button>
            </div>
            <div className='relative'>
              <img
                src={URL.createObjectURL(images[1]) || "/placeholder.svg"}
                alt={`Upload 2`}
                className='w-full h-24 object-cover rounded-lg'
              />
              {isLoading && (
                <div className='absolute inset-0 bg-white/40 animate-pulse flex items-center justify-center rounded-lg' />
              )}
              <button
                onClick={() => onRemoveImage(1)}
                className='absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold hover:bg-red-600'
                disabled={isLoading}
              >
                ×
              </button>
            </div>
            <div className='relative'>
              <img
                src={URL.createObjectURL(images[2]) || "/placeholder.svg"}
                alt={`Upload 3`}
                className='w-full h-24 object-cover rounded-lg'
              />
              {isLoading && (
                <div className='absolute inset-0 bg-white/40 animate-pulse flex items-center justify-center rounded-lg' />
              )}
              <button
                onClick={() => onRemoveImage(2)}
                className='absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold hover:bg-red-600'
                disabled={isLoading}
              >
                ×
              </button>
            </div>
          </>
        )}
      </div>
      {isLoading ||
        (images.length < 3 && (
          <div className='flex flex-col sm:flex-row gap-3 w-full mt-2'>
            <button
              disabled={isLoading}
              onClick={onChooseImage}
              className='w-full py-2 border border-[#E0E0E0] text-[#222] font-semibold rounded-lg hover:bg-[#F5F5F5] transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
            >
              Choose Image
            </button>
            <button
              disabled={isLoading}
              onClick={onUseCamera}
              className='w-full py-2 border border-[#FFE4C7] bg-[#FFF7ED] text-[#92400e] font-semibold rounded-lg hover:bg-[#FFE4C7] transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
            >
              Use Camera
            </button>
          </div>
        ))}
      <input
        ref={fileInputRef}
        type='file'
        multiple
        accept='image/*'
        onChange={onFileSelect}
        className='hidden'
      />
    </div>
  );
}
