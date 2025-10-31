import React from "react";

type Props = { isLoading: boolean };

export const ScannerLoader = ({ isLoading }: Props) => {
  return (
    <>
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
    </>
  );
};
