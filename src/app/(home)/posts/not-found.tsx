import Link from 'next/link';

export default function PostNotFound() {
  return (
    <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[70vh] bg-gray-900">
      <div className="max-w-lg text-center">
        <div className="mb-6">
          <svg 
            className="w-32 h-32 mx-auto text-red-500"
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        </div>
        <h1 className="text-3xl font-bold mb-2 text-white">آگهی مورد نظر یافت نشد</h1>
        <div className="h-1 w-24 bg-red-500 mx-auto my-4 rounded-full"></div>
        <p className="text-gray-300 mb-8 text-lg">
          متأسفانه آگهی که به دنبال آن هستید حذف شده یا منقضی شده است.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/" className="inline-block">
            <button className="bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg w-full">
              مشاهده آگهی‌های جدید
            </button>
          </Link>
          <Link href="/categories" className="inline-block">
            <button className="border border-red-500 text-red-400 hover:bg-gray-800 py-3 px-6 rounded-lg transition-all duration-300 w-full">
              جستجو در دسته‌بندی‌ها
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
} 