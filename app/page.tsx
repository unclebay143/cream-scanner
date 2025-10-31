"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <main className='grow flex flex-col items-center justify-center px-4 py-12'>
      <div className='text-center max-w-md'>
        <div className='mb-8 flex justify-center'>
          {/* <div className='w-16 h-16 bg-[#FFA94D] rounded-2xl flex items-center justify-center'> */}
          <div className='w-16 h-16 flex items-center justify-center'>
            <span className='text-8xl'>🧴</span>
          </div>
        </div>
        <h1 className='text-4xl font-bold text-[#222] mb-4 leading-tight'>
          Scan. Analyze. Know.
        </h1>
        <p className='text-lg text-[#666] mb-8 leading-relaxed'>
          Upload a photo of your skincare cream and get instant ingredient
          analysis with safety ratings.
        </p>
        <div className='space-y-3 flex flex-col w-full'>
          <Link
            href='/app?mode=upload'
            className='w-full bg-[#FFA94D] hover:bg-[#FF9933] text-white font-semibold py-3 rounded-lg text-base transition-colors'
          >
            Scan Cream
          </Link>
          <Link
            className='w-full border-2 border-[#E0E0E0] text-[#222] font-semibold py-3 rounded-lg text-base bg-white hover:bg-white/75 transition-colors'
            href='/app?mode=manual'
          >
            Enter Manually
          </Link>
        </div>
      </div>
    </main>
  );
}
