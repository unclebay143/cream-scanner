export const Footer = () => {
  return (
    <footer className='mb-4 w-full flex justify-center items-center pointer-events-none'>
      <div className='bg-white/80 rounded-lg px-4 py-2 shadow flex items-center gap-2 pointer-events-auto'>
        <a
          href='https://deepmind.google/models/gemini/'
          target='_blank'
          rel='noopener'
          className='text-xs text-[#222] font-medium'
        >
          Powered by Gemini AI
        </a>
        <hr className='h-4 border-l border-gray-300' />
        <a
          href='https://x.com/intent/user?screen_name=unclebigbay143'
          target='_blank'
          rel='noopener'
          className='flex items-center'
          aria-label='Follow on X'
        >
          <svg
            width='18'
            height='18'
            viewBox='0 0 24 24'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              d='M17.98 3H21.5L14.62 10.56L22.75 21H16.44L11.41 14.62L5.72 21H2.18L9.46 13.01L1.61 3H8.03L12.59 8.82L17.98 3ZM16.87 19.13H18.62L7.02 4.77H5.13L16.87 19.13Z'
              fill='#222'
            />
          </svg>
        </a>
      </div>
    </footer>
  );
};
