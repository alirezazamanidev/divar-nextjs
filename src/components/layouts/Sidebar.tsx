'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { categories, subcategories, subsubcategories } from '@/data/mockData';
import { ChevronLeftIcon, ChevronDownIcon, ChevronUpIcon, XMarkIcon, ArrowLongRightIcon, AdjustmentsVerticalIcon } from '@heroicons/react/24/outline';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar = ({ isOpen = false, onClose }: SidebarProps) => {
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [activeSubcategory, setActiveSubcategory] = useState<number | null>(null);
  const [isMobileOpen, setIsMobileOpen] = useState(isOpen);
  const [showAllCategories, setShowAllCategories] = useState(true);
  const [showPriceFilter, setShowPriceFilter] = useState(true);
  const [showStatusFilter, setShowStatusFilter] = useState(true);
  const [showAfzoonehFilter, setShowAfzoonehFilter] = useState(false);

  // Update mobile open state when prop changes
  useEffect(() => {
    setIsMobileOpen(isOpen);
  }, [isOpen]);

  const toggleCategory = (categoryId: number) => {
    if (activeCategory === categoryId) {
      setActiveCategory(null);
      setActiveSubcategory(null);
      setShowAllCategories(true);
    } else {
      setActiveCategory(categoryId);
      setActiveSubcategory(null);
      setShowAllCategories(false);
    }
  };

  const toggleSubcategory = (subcategoryId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeSubcategory === subcategoryId) {
      setActiveSubcategory(null);
    } else {
      setActiveSubcategory(subcategoryId);
    }
  };

  const handleBackToAllCategories = () => {
    setActiveCategory(null);
    setActiveSubcategory(null);
    setShowAllCategories(true);
  };

  const handleCloseMobile = () => {
    setIsMobileOpen(false);
    if (onClose) onClose();
  };

  const renderSidebarFooter = () => (
    <div className="border-t border-gray-700 mt-3 pt-2 pb-3">
      <div className="px-3">
        {/* Quick Links - Compact and centered */}
        <div className="text-center">
          <div className="flex flex-wrap justify-center gap-x-2 gap-y-1 text-xs text-gray-400">
            <Link href="#" className="hover:text-white transition-colors">درباره دیوار</Link>
            <span className="text-gray-600">•</span>
            <Link href="#" className="hover:text-white transition-colors">دریافت برنامه</Link>
            <span className="text-gray-600">•</span>
            <Link href="#" className="hover:text-white transition-colors">پشتیبانی</Link>
          </div>
        </div>
        
        {/* Certification Badge - Single attractive badge */}
        <div className="flex justify-center mt-2">
          <div className="px-2 py-1 bg-gradient-to-r from-gray-800 to-gray-700 rounded-full text-xs flex items-center gap-1 shadow-inner">
            <span className="text-gray-300">پشتیبانی رسمی دیوار</span>
            <span className="text-blue-400 text-xs">✓</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderFilters = () => (
    <div className="border-t border-gray-700 pt-1 overflow-y-auto">
      <div className="text-sm font-medium mb-1 p-3 flex items-center text-white">
        <AdjustmentsVerticalIcon className="h-4 w-4 mr-1.5" />
        فیلترها
      </div>
      
      <div className="space-y-1">
        <div 
          onClick={() => setShowPriceFilter(!showPriceFilter)}
          className="mx-2 px-3 py-2 flex justify-between items-center cursor-pointer rounded-lg hover:bg-gray-800 transition-all"
        >
          <div className="text-sm font-medium flex items-center">
            <span className="text-red-500 mr-1">₹</span>
            محدوده قیمت
          </div>
          <ChevronDownIcon className={`h-4 w-4 text-gray-400 transition-transform ${showPriceFilter ? 'rotate-180' : ''}`} />
        </div>
        
        {showPriceFilter && (
          <div className="p-3 pt-0 space-y-2 bg-gray-850 mx-2 rounded-lg mb-2">
            <div className="flex flex-col">
              <label className="text-xs text-gray-400 mb-1">از</label>
              <input 
                type="text" 
                placeholder="0 تومان"
                className="rounded-md border border-gray-600 bg-gray-700 bg-opacity-50 text-white px-3 py-1.5 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-red-500 text-sm"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-xs text-gray-400 mb-1">تا</label>
              <input 
                type="text" 
                placeholder="بدون محدودیت"
                className="rounded-md border border-gray-600 bg-gray-700 bg-opacity-50 text-white px-3 py-1.5 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-red-500 text-sm"
              />
            </div>
          </div>
        )}
      </div>
      
      <div className="space-y-1">
        <div 
          onClick={() => setShowStatusFilter(!showStatusFilter)}
          className="mx-2 px-3 py-2 flex justify-between items-center cursor-pointer rounded-lg hover:bg-gray-800 transition-all"
        >
          <div className="text-sm font-medium flex items-center">
            <span className="text-yellow-500 mr-1">⚡</span>
            وضعیت آگهی
          </div>
          <ChevronDownIcon className={`h-4 w-4 text-gray-400 transition-transform ${showStatusFilter ? 'rotate-180' : ''}`} />
        </div>
        
        {showStatusFilter && (
          <div className="p-3 pt-0 space-y-2 bg-gray-850 mx-2 rounded-lg mb-2">
            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="immediate" 
                className="border-gray-600 bg-gray-800 text-red-500 rounded focus:ring-red-500 focus:ring-opacity-25"
              />
              <label htmlFor="immediate" className="text-sm ml-2 text-gray-300">فقط فوری‌ها</label>
            </div>
            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="hasimage" 
                className="border-gray-600 bg-gray-800 text-red-500 rounded focus:ring-red-500 focus:ring-opacity-25"
              />
              <label htmlFor="hasimage" className="text-sm ml-2 text-gray-300">فقط عکس‌دار</label>
            </div>
          </div>
        )}
      </div>
      
      <div className="space-y-1">
        <div 
          onClick={() => setShowAfzoonehFilter(!showAfzoonehFilter)}
          className="mx-2 px-3 py-2 flex justify-between items-center cursor-pointer rounded-lg hover:bg-gray-800 transition-all"
        >
          <div className="text-sm font-medium flex items-center">
            <span className="text-blue-500 mr-1">+</span>
            افزونه‌ها
          </div>
          <ChevronDownIcon className={`h-4 w-4 text-gray-400 transition-transform ${showAfzoonehFilter ? 'rotate-180' : ''}`} />
        </div>
        
        {showAfzoonehFilter && (
          <div className="p-3 pt-0 bg-gray-850 mx-2 rounded-lg mb-2">
            <div className="flex flex-wrap gap-2 text-xs">
              <Link href="#" className="bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded-md text-gray-300 hover:text-white transition-colors">درباره دیوار</Link>
              <Link href="#" className="bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded-md text-gray-300 hover:text-white transition-colors">دریافت برنامه</Link>
              <Link href="#" className="bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded-md text-gray-300 hover:text-white transition-colors">اتاق خبر</Link>
              <Link href="#" className="bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded-md text-gray-300 hover:text-white transition-colors">گزارش</Link>
              <Link href="#" className="bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded-md text-gray-300 hover:text-white transition-colors">دیوار حرفه‌ای</Link>
              <Link href="#" className="bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded-md text-gray-300 hover:text-white transition-colors">پشتیبانی</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderSubcategories = (categoryId: number) => {
    const categorySubcategories = subcategories.filter(
      (sub) => sub.parentId === categoryId
    );

    return (
      <ul className="py-1">
        {categorySubcategories.map((subcategory) => {
          const hasChildren = subsubcategories.some(
            (subsub) => subsub.parentId === subcategory.id
          );

          return (
            <li key={subcategory.id} className="relative">
              <div 
                className="flex items-center justify-between cursor-pointer px-3 py-1.5 hover:bg-gray-800 transition-colors"
                onClick={(e) => hasChildren ? toggleSubcategory(subcategory.id, e) : null}
              >
                <Link
                  href={`/category/${categoryId}/${subcategory.id}`}
                  className="block flex-grow text-gray-300 text-sm"
                  onClick={handleCloseMobile}
                >
                  {subcategory.name}
                </Link>
                {hasChildren && (
                  <span className="ml-1">
                    {activeSubcategory === subcategory.id ? (
                      <ChevronUpIcon className="h-3 w-3 text-gray-400" />
                    ) : (
                      <ChevronDownIcon className="h-3 w-3 text-gray-400" />
                    )}
                  </span>
                )}
              </div>
              {activeSubcategory === subcategory.id && hasChildren && (
                <ul className="py-1 pr-3">
                  {subsubcategories
                    .filter((subsub) => subsub.parentId === subcategory.id)
                    .map((subsubcategory) => (
                      <li key={subsubcategory.id}>
                        <Link
                          href={`/category/${categoryId}/${subcategory.id}/${subsubcategory.id}`}
                          className="block px-3 py-1.5 text-xs text-gray-400 hover:text-gray-200 transition-colors"
                          onClick={handleCloseMobile}
                        >
                          {subsubcategory.name}
                        </Link>
                      </li>
                    ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    );
  };

  const renderAllCategories = () => (
    <div className="text-gray-300">
      <div className="py-1.5 px-3 text-gray-400 text-xs font-medium">دسته‌ها</div>
      <ul>
        {categories.map((category) => {
          const categorySubcategories = subcategories.filter(
            (sub) => sub.parentId === category.id
          );

          return (
            <li key={category.id} className="border-b border-gray-800">
              <div
                onClick={() => toggleCategory(category.id)}
                className="flex items-center justify-between p-2 cursor-pointer hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">{category.icon}</span>
                  <span className="text-sm">{category.name}</span>
                </div>
                {categorySubcategories.length > 0 && (
                  <ChevronLeftIcon className="h-3.5 w-3.5 text-gray-500" />
                )}
              </div>
            </li>
          );
        })}
      </ul>
      {/* Add filters section below categories */}
      {renderFilters()}
      {/* Add footer at the bottom of sidebar */}
      {renderSidebarFooter()}
    </div>
  );

  const renderCategoryDetail = () => {
    if (!activeCategory) return null;

    const category = categories.find(cat => cat.id === activeCategory);
    if (!category) return null;

    return (
      <div className="text-gray-300">
        <button
          onClick={handleBackToAllCategories}
          className="flex items-center p-2 text-sm text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLongRightIcon className="h-4 w-4 ml-1" />
          <span>همه آگهی‌ها</span>
        </button>
        
        <div className="border-b border-gray-800 p-2 flex items-center gap-2">
          <span className="text-base">{category.icon}</span>
          <span className="font-medium text-sm">{category.name}</span>
        </div>
        
        {renderSubcategories(category.id)}
        {/* Add filters section below subcategories */}
        {renderFilters()}
        {/* Add footer at the bottom of sidebar */}
        {renderSidebarFooter()}
      </div>
    );
  };

  const sidebarContent = (
    <div className="h-full">
      {showAllCategories ? renderAllCategories() : renderCategoryDetail()}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:block h-full  bg-gray-900 rounded-lg shadow-lg ">
        {sidebarContent}
      </div>

      {/* Mobile Sidebar */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity md:hidden ${
          isMobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={handleCloseMobile}
      />
      
      <div 
        className={`fixed inset-y-0 right-0 max-w-xs w-full bg-gray-900 shadow-xl z-50 transform transition-transform md:hidden ${
          isMobileOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h2 className="text-lg font-bold text-gray-300">دسته‌ها</h2>
          <button 
            onClick={handleCloseMobile}
            className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        
        <div className="h-full pb-20 overflow-hidden">
          {sidebarContent}
        </div>
      </div>
    </>
  );
};

export default Sidebar; 