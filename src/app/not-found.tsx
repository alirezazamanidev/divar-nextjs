import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 py-12 bg-gray-900">
      <div className="max-w-md">
        <h1 className="text-9xl font-bold text-red-500">404</h1>
        <div className="h-2 w-40 bg-red-500 mx-auto my-6 rounded-full"></div>
        <h2 className="text-2xl font-bold mb-6 text-white">صفحه مورد نظر یافت نشد!</h2>
        <p className="text-gray-300 mb-8">
          متاسفانه صفحه‌ای که به دنبال آن هستید وجود ندارد یا حذف شده است.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/" className="inline-block">
            <button 
              className="bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl w-full">
              بازگشت به صفحه اصلی
            </button>
          </Link>
          <Link href="/" className="inline-block">
            <button 
              className="border border-red-500 text-red-400 hover:bg-gray-800 py-3 px-6 rounded-lg transition-all duration-300 w-full">
              جستجوی آگهی‌ها
            </button>
          </Link>
        </div>
        <div className="mt-12">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900 z-10"></div>
            <svg 
              className="w-64 h-64 mx-auto text-gray-700"
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="0.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
} 