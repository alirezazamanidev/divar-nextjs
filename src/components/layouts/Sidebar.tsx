'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  XMarkIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ArrowLongRightIcon,
  AdjustmentsVerticalIcon,
} from '@heroicons/react/24/outline';
import {
  ListCategories,
  getCategories,
} from '@/libs/services/category.service';
import { useRouter } from 'next/navigation';
import { useQueryState } from 'nuqs';
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  categoriesData: ListCategories;
}

const Sidebar = ({ isOpen = false, onClose, categoriesData }: SidebarProps) => {
  const [isMobileOpen, setIsMobileOpen] = useState(isOpen);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [hasImage, setHasImage] = useState(false);
  const [isUrgent, setIsUrgent] = useState(false);
  const [categoryData, setCategoryData] =
    useState<ListCategories>(categoriesData);
  const [categorySlug, setCategorySlug] = useQueryState('category');
  const [price, setPrice] = useQueryState('price');
  const [categoryLevel, setCategoryLevel] = useState(0);
  const router = useRouter();

  // Update mobile open state when prop changes
  useEffect(() => {
    setIsMobileOpen(isOpen);
  }, [isOpen]);

  // Update category data when the props change
  useEffect(() => {
    if (categoryLevel <= 2) {
      getCategoryData(categorySlug || '');
    }
  }, [categorySlug, categoryLevel]);

  // Apply price filter when price inputs change
  useEffect(() => {
    if (minPrice || maxPrice) {
      if (minPrice && +minPrice < 0) setMinPrice('');
      if (maxPrice && +maxPrice < 0) setMaxPrice('');
      const priceValue = `${minPrice || ''}-${maxPrice || ''}`;
      setPrice(priceValue);
    }
  }, [minPrice, maxPrice]);

  const handleBackToParent = async () => {
    if (categoryData.showBack) {
      setCategorySlug(null);
      await getCategoryData('');
      setCategoryLevel(0);
    }
  };

  const getCategoryData = async (slug: string) => {
    const cateData = await getCategories({ slug, });
    setCategoryData(cateData);
  };

  const handleCloseMobile = () => {
    setIsMobileOpen(false);
    if (onClose) onClose();
  };

  const applyStatusFilter = () => {
    let queryParams = new URLSearchParams();

    // Add existing category if present
    if (categorySlug) {
      queryParams.append('category', categorySlug);
    }

    // Add price filter if present
    if (minPrice || maxPrice) {
      const priceQuery = `${maxPrice || '0'}-${minPrice || '0'}`;
      queryParams.append('price', priceQuery);
    }

    // Add status filters
    if (hasImage) {
      queryParams.append('hasImage', 'true');
    }

    if (isUrgent) {
      queryParams.append('urgent', 'true');
    }

    // Navigate with all filters
    router.push(`/?${queryParams.toString()}`);
    if (onClose) onClose();
  };

  const renderSidebarFooter = () => (
    <div className="border-t border-gray-700 mt-3 pt-2 pb-3">
      <div className="px-3">
        {/* Quick Links - Compact and centered */}
        <div className="text-center">
          <div className="flex flex-wrap justify-center gap-x-2 gap-y-1 text-xs text-gray-400">
            <Link href="#" className="hover:text-white transition-colors">
              درباره دیوار
            </Link>
            <span className="text-gray-600">•</span>
            <Link href="#" className="hover:text-white transition-colors">
              دریافت برنامه
            </Link>
            <span className="text-gray-600">•</span>
            <Link href="#" className="hover:text-white transition-colors">
              پشتیبانی
            </Link>
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
    <div className="border-t border-gray-700 pt-1 ">
      <div className="text-sm font-medium mb-1 p-3 flex items-center text-white">
        <AdjustmentsVerticalIcon className="h-4 w-4 mr-1.5" />
        فیلترها
      </div>

      <div className="space-y-1">
        <Disclosure>
          {({ open }) => (
            <div>
              <DisclosureButton className="mx-2 px-3 py-2 flex justify-between items-center w-full cursor-pointer rounded-lg hover:bg-gray-800 transition-all">
                <div className="text-sm font-medium flex items-center">
                  <ChevronDownIcon
                    className={`h-4 w-4 text-gray-400 transition-transform ${
                      open ? 'rotate-180' : ''
                    }`}
                  />
                  قیمت
                </div>
                {price && (
                  <span
                    className=" text-xs text-red-500 cursor-pointer"
                    onClick={() => setPrice(null)}
                  >
                    حذف
                  </span>
                )}
              </DisclosureButton>
              <DisclosurePanel className="p-3 pt-0 space-y-2 bg-gray-850 mx-2 rounded-lg mb-2">
                <div className="flex flex-col">
                  <label className="text-xs text-gray-400 mb-1">از</label>
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    placeholder="0 تومان"
                    className="rounded-md border border-gray-600 bg-gray-700 bg-opacity-50 text-white px-3 py-1.5 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-red-500 text-sm"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-xs text-gray-400 mb-1">تا</label>
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder="بدون محدودیت"
                    className="rounded-md border border-gray-600 bg-gray-700 bg-opacity-50 text-white px-3 py-1.5 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-red-500 text-sm"
                  />
                </div>
              </DisclosurePanel>
            </div>
          )}
        </Disclosure>
      </div>

      <div className="space-y-1">
        <Disclosure>
          {({ open }) => (
            <div>
              <DisclosureButton className="mx-2 px-3 py-2 flex justify-between items-center w-full cursor-pointer rounded-lg hover:bg-gray-800 transition-all">
                <div className="text-sm font-medium flex items-center">
                  <span className="text-yellow-500 mr-1">⚡</span>
                  وضعیت آگهی
                </div>
                <ChevronDownIcon
                  className={`h-4 w-4 text-gray-400 transition-transform ${
                    open ? 'rotate-180' : ''
                  }`}
                />
              </DisclosureButton>
              <DisclosurePanel className="p-3 pt-0 space-y-2 bg-gray-850 mx-2 rounded-lg mb-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="immediate"
                    checked={isUrgent}
                    onChange={(e) => setIsUrgent(e.target.checked)}
                    className="border-gray-600 bg-gray-800 text-red-500 rounded focus:ring-red-500 focus:ring-opacity-25"
                  />
                  <label
                    htmlFor="immediate"
                    className="text-sm ml-2 text-gray-300"
                  >
                    فقط فوری‌ها
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="hasimage"
                    checked={hasImage}
                    onChange={(e) => setHasImage(e.target.checked)}
                    className="border-gray-600 bg-gray-800 text-red-500 rounded focus:ring-red-500 focus:ring-opacity-25"
                  />
                  <label
                    htmlFor="hasimage"
                    className="text-sm ml-2 text-gray-300"
                  >
                    فقط عکس‌دار
                  </label>
                </div>
                <button
                  onClick={applyStatusFilter}
                  className="mt-2 w-full bg-red-500 hover:bg-red-600 text-white py-1.5 rounded-md text-sm transition-colors"
                >
                  اعمال فیلتر
                </button>
              </DisclosurePanel>
            </div>
          )}
        </Disclosure>
      </div>
    </div>
  );

  const renderCategoryContents = () => (
    <div className="text-gray-300">
      {categoryData.showBack && (
        <button
          onClick={handleBackToParent}
          className="flex items-center p-2 cursor-pointer text-sm text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLongRightIcon className="h-4 w-4 ml-1" />
          <span>بازگشت</span>
        </button>
      )}

      {categoryData.currentCategory && (
        <div className="border-b border-gray-800 p-2 flex items-center gap-2">
          <span className="font-medium  text-gray-500 text-sm">
            {categoryData.currentCategory.title}
          </span>
        </div>
      )}

      <ul>
        {categoryData.categories.map((category) => (
          <li key={category.id} className="border-b border-gray-800">
            <div
              onClick={() => {
                setCategorySlug(category.slug);
                setCategoryLevel(categoryLevel + 1);
              }}
              className={`flex items-center justify-between p-2 cursor-pointer hover:bg-gray-800 transition-colors`}
            >
              <div className="flex items-center gap-2">
                {category.icon && (
                  <span className="text-base">{category.icon.toString()}</span>
                )}
                <span className="text-sm">{category.title}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* Add filters section */}
      {renderFilters()}

      {/* Add footer */}
      {renderSidebarFooter()}
    </div>
  );

  const sidebarContent = (
    <div className="h-full">{renderCategoryContents()}</div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden mt-16 md:block h-full bg-gray-900 rounded-lg shadow-lg">
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

        <div className="h-full pb-20 overflow-auto">{sidebarContent}</div>
      </div>
    </>
  );
};

export default Sidebar;
