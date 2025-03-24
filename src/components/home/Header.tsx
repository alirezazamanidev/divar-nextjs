"use client";

import { MapPinIcon, MagnifyingGlassIcon, ChatBubbleLeftIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-gray-900 text-white shadow-md border-b border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <div className="flex items-center gap-4">
          <Link href="/" className="text-2xl font-bold text-red-500 hover:text-red-400 transition-colors">
            دیوار
          </Link>
          <div className="flex items-center gap-1">
            <MapPinIcon className="h-5 w-5 text-gray-300" />
            <span className="text-gray-300">مشهد</span>
          </div>
          <div className="hidden md:flex">
            <button className="flex items-center gap-1 text-sm text-gray-300 hover:text-white transition-colors">
              دسته‌ها <ChevronDownIcon className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Search bar */}
        <div className="flex-grow mx-4 hidden md:block">
          <div className="relative">
            <input
              type="text"
              className="w-full rounded-md border border-gray-700 bg-gray-800 py-2 px-10 placeholder-gray-500 focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none text-white transition-colors"
              placeholder="جستجو در همه آگهی‌ها"
            />
            <MagnifyingGlassIcon className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        {/* User actions */}
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-1 text-sm text-gray-300 hover:text-white transition-colors">
            <ChatBubbleLeftIcon className="h-5 w-5" />
            <span className="hidden md:inline">چت</span>
          </button>
          <button className="flex items-center gap-1 text-sm text-gray-300 hover:text-white transition-colors">
            <span className="hidden md:inline">دیوار من</span>
          </button>
          <button className="bg-red-700 text-white px-4 py-2 rounded-md text-sm hover:bg-red-600 transition-colors shadow-sm">
            ثبت آگهی
          </button>
        </div>
      </div>
    </header>
  );
} 