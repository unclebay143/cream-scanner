import React from "react";

interface UploadOptionsProps {
  onChooseImage: () => void;
  onUseCamera: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function UploadOptions({
  onChooseImage,
  onUseCamera,
  fileInputRef,
  onFileSelect,
}: UploadOptionsProps) {
  return (
    <div className='text-center'>
      <div className='text-5xl mb-4'>📷</div>
      <h2 className='text-lg font-semibold text-[#222] mb-3'>Take a photo</h2>
      {/* <p className="text-sm text-[#666] mb-2">or</p> */}
      <button
        onClick={onChooseImage}
        className='inline-block px-6 py-2 bg-[#FFA94D] hover:bg-[#FF9933] text-white font-semibold rounded-lg transition-colors'
      >
        Choose Image
      </button>
      <button
        onClick={onUseCamera}
        className='inline-block px-6 py-2 ml-3 bg-[#FFF7ED] hover:bg-[#FFE4C7] text-[#92400e] font-semibold rounded-lg border border-[#F3E8D2] transition-colors'
      >
        Use Camera
      </button>
      <input
        ref={fileInputRef}
        type='file'
        multiple
        accept='image/*'
        onChange={onFileSelect}
        className='hidden'
      />
      <p className='text-xs text-[#999] mt-4'>or drag and drop</p>
    </div>
  );
}
