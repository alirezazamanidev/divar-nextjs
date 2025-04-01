'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Sidebar from '@/components/layouts/Sidebar';
import { MagnifyingGlassIcon, MapPinIcon, PlusCircleIcon, ChevronDownIcon, BellIcon, UserCircleIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';

interface HeaderProps {}

export default function Header({}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [locationDropdown, setLocationDropdown] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const pathname = usePathname();
  
  const isNewPage = pathname === '/new';
  const isHomePage = pathname === '/' || pathname === '/home';
  
  const handleMenuClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleLocationDropdown = () => {
    setLocationDropdown(!locationDropdown);
    if (profileDropdown) setProfileDropdown(false);
  };

  const toggleProfileDropdown = () => {
    setProfileDropdown(!profileDropdown);
    if (locationDropdown) setLocationDropdown(false);
  };

  // به‌روزرسانی متغیر وضعیت سایدبار هر بار که تغییر می‌کند
  useEffect(() => {
    const sidebarState = document.querySelector('.sidebar-state');
    if (sidebarState) {
      sidebarState.setAttribute('data-open', sidebarOpen.toString());
    }
  }, [sidebarOpen]);

  // کلیک خارج از دراپ‌داون‌ها برای بستن آنها
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // بستن دراپ‌داون‌ها در صورت کلیک خارج از آنها
      if (locationDropdown || profileDropdown) {
        setLocationDropdown(false);
        setProfileDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [locationDropdown, profileDropdown]);

  return (
    <>
      <header className="bg-gradient-to-r from-gray-900 to-gray-800 py-2.5 px-4 shadow-lg sticky top-0 z-20 border-b border-gray-700 h-[64px]">
        <div className="container mx-auto flex items-center justify-between">
          {/* لوگو و موقعیت */}
          <div className="flex items-center gap-3">
            {/* منوی موبایل */}
            <div className="md:hidden">
              <button
                onClick={toggleSidebar}
                className="text-gray-300 hover:text-white p-1"
              >
                {isMenuOpen ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
            
            <Link href="/" className="text-2xl font-bold text-red-500 hover:text-red-400 transition-colors">
              دیوار
            </Link>
            
            <div className="relative">
              <button 
                onClick={toggleLocationDropdown}
                className="flex items-center gap-1 text-gray-300 bg-gray-800 hover:bg-gray-700 px-2 py-1 rounded-md transition-all"
              >
                <MapPinIcon className="h-4 w-4" />
                <span className="text-sm">تهران</span>
                <ChevronDownIcon className={`h-3 w-3 transition-transform ${locationDropdown ? 'rotate-180' : ''}`} />
              </button>
              
              {/* لوکیشن دراپ‌داون */}
              {locationDropdown && (
                <div className="absolute top-full mt-1 right-0 bg-gray-800 rounded-md shadow-lg py-2 min-w-[180px] text-right z-30 border border-gray-700">
                  <div className="px-3 py-1 text-xs text-gray-400 border-b border-gray-700">انتخاب شهر</div>
                  {['تهران', 'مشهد', 'اصفهان', 'کرج', 'شیراز', 'تبریز', 'اهواز', 'قم'].map((city) => (
                    <a 
                      key={city}
                      href="#" 
                      className="block px-3 py-1.5 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                    >
                      {city}
                    </a>
                  ))}
                  <div className="border-t border-gray-700 mt-1 pt-1">
                    <a href="#" className="block px-3 py-1.5 text-xs text-red-400 hover:bg-gray-700">
                      همه شهرها
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* سرچ بار */}
          <div className="hidden md:block flex-grow mx-6 max-w-xl">
            <div className="relative">
              <input
                type="text"
                className="w-full rounded-md border border-gray-700 bg-gray-800 py-2.5 px-10 placeholder-gray-500 focus:ring-1 focus:ring-red-500 focus:outline-none text-white transition-colors shadow-md"
                placeholder="جستجو در همه آگهی‌ها"
              />
              <MagnifyingGlassIcon className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* سرچ آیکون موبایل */}
          <div className="md:hidden">
            <button className="text-gray-300 p-1.5 hover:bg-gray-800 rounded-full">
              <MagnifyingGlassIcon className="h-5 w-5" />
            </button>
          </div>

          {/* منوی دسکتاپ */}
          <div className="flex items-center gap-3">
            {/* دکمه‌های آیکون (فقط در دسکتاپ) */}
            <div className="hidden md:flex items-center gap-2 ml-1">
              <button className="text-gray-300 p-1.5 hover:bg-gray-800 rounded-full transition-colors">
                <ChatBubbleLeftRightIcon className="h-5 w-5" />
              </button>
              <button className="text-gray-300 p-1.5 hover:bg-gray-800 rounded-full transition-colors">
                <BellIcon className="h-5 w-5" />
              </button>
            </div>
            
            {/* ثبت آگهی */}
            {!isNewPage && (
              <Link href="/new" className="bg-red-500 hover:bg-red-600 text-white px-3.5 py-1.5 rounded-md flex items-center gap-1 transition-colors shadow-md">
                <PlusCircleIcon className="h-5 w-5" />
                <span>ثبت آگهی</span>
              </Link>
            )}
            
            {/* پروفایل/ورود (دسکتاپ) */}
            <div className="hidden md:block relative">
              <button 
                onClick={toggleProfileDropdown}
                className="flex items-center gap-1 text-gray-300 hover:bg-gray-800 p-1.5 rounded-md transition-all"
              >
                <UserCircleIcon className="h-6 w-6" />
                <span className="text-sm">دیوار من</span>
                <ChevronDownIcon className={`h-3 w-3 transition-transform ${profileDropdown ? 'rotate-180' : ''}`} />
              </button>
              
              {/* منوی کاربری */}
              {profileDropdown && (
                <div className="absolute top-full left-0 mt-1 bg-gray-800 rounded-md shadow-lg py-2 min-w-[220px] text-right z-30 border border-gray-700">
                  <Link href="/login" className="block px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white font-medium">
                    ورود به حساب کاربری
                  </Link>
                  <div className="border-t border-gray-700 my-1"></div>
                  <Link href="/chat" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white">
                    <ChatBubbleLeftRightIcon className="h-4 w-4" />
                    چت
                  </Link>
                  <Link href="/ads" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
                    </svg>
                    آگهی‌های من
                  </Link>
                  <Link href="/saved" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                    </svg>
                    نشان‌شده‌ها
                  </Link>
                  <Link href="/support" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                    </svg>
                    پشتیبانی
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* نوار جستجوی موبایل */}
      <div className="md:hidden sticky top-[64px] z-10 bg-gray-800 px-4 py-2 shadow-md border-b border-gray-700">
        <div className="relative">
          <input
            type="text"
            className="w-full rounded-md border border-gray-700 bg-gray-900 py-2 px-9 placeholder-gray-500 focus:ring-1 focus:ring-red-500 focus:outline-none text-gray-300 transition-colors shadow-md text-sm"
            placeholder="جستجو در همه آگهی‌ها"
          />
          <MagnifyingGlassIcon className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
        </div>
      </div>

      {/* متغیر وضعیت سایدبار - برای هماهنگی با سایر کامپوننت‌ها */}
      <div className="sidebar-state hidden" data-open={sidebarOpen.toString()}></div>
      
      {/* سایدبار موبایل - فقط در صفحه اصلی */}
      {isHomePage && (
        <div className="md:hidden fixed inset-0 z-50 transform transition-transform duration-300" style={{
          transform: sidebarOpen ? 'translateX(0)' : 'translateX(100%)'
        }}>
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)}></div>
          <div className="relative h-full w-4/5 max-w-sm bg-gray-800 shadow-xl z-20 mr-auto">
            <Sidebar isOpen={true} onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
} 