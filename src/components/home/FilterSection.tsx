'use client';

import { useState, useEffect } from 'react';
import { Disclosure, Switch } from '@headlessui/react';
import { ChevronDownIcon, ChevronLeftIcon, AdjustmentsVerticalIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { subcategories, subsubcategories } from '@/data/mockData';

interface FilterOption {
  value: string;
  label: string;
}

interface FilterSection {
  id: string;
  name: string;
  options: FilterOption[];
}

interface CategoryItem {
  id: number;
  name: string;
  icon: string;
}

interface Subcategory {
  id: number;
  name: string;
  parentId: number;
}

interface Subsubcategory {
  id: number;
  name: string;
  parentId: number;
}

interface FilterSectionProps {
  categories: CategoryItem[];
  filters: FilterSection[];
  activeCategory: number | null;
  setActiveCategory: (id: number | null) => void;
}

export default function FilterSection({
  categories,
  filters,
  activeCategory,
  setActiveCategory,
}: FilterSectionProps) {
  // تشخیص حالت موبایل
  const [isMobile, setIsMobile] = useState(false);
  // حالت باز یا بسته بودن فیلتر در موبایل
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  
  // ذخیره زیردسته فعال
  const [activeSubcategory, setActiveSubcategory] = useState<number | null>(null);
  
  // حالت نمایش دسته‌بندی‌ها
  const [viewMode, setViewMode] = useState<'all' | 'category' | 'subcategory'>('all');

  // تشخیص اندازه صفحه و تنظیم حالت موبایل
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // تنظیم اولیه
    handleResize();
    
    // اضافه کردن event listener
    window.addEventListener('resize', handleResize);
    
    // پاکسازی event listener
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // فیلتر کردن زیردسته‌ها برای دسته فعال
  const filteredSubcategories = subcategories.filter(
    (subcategory) => subcategory.parentId === activeCategory,
  );

  // فیلتر کردن زیرزیردسته‌ها برای زیردسته فعال
  const filteredSubsubcategories = subsubcategories.filter(
    (subsubcategory) => subsubcategory.parentId === activeSubcategory,
  );

  // تنظیمات فیلتر قیمت
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [hideNegotiables, setHideNegotiables] = useState<boolean>(false);
  
  // برای برگشت به صفحه اصلی یا سطح بالاتر
  const handleBack = () => {
    if (viewMode === 'subcategory') {
      setViewMode('category');
      setActiveSubcategory(null);
    } else if (viewMode === 'category') {
      setViewMode('all');
      setActiveCategory(null);
    }
  };
  
  // برای انتخاب دسته اصلی
  const handleCategorySelect = (categoryId: number) => {
    setActiveCategory(categoryId);
    setActiveSubcategory(null);
    setViewMode('category');
    if (isMobile) {
      setMobileFilterOpen(false);
    }
  };
  
  // برای انتخاب زیردسته
  const handleSubcategorySelect = (subcategoryId: number) => {
    setActiveSubcategory(subcategoryId);
    setViewMode('subcategory');
    if (isMobile) {
      setMobileFilterOpen(false);
    }
  };
  
  // دکمه همه آگهی‌ها
  const handleAllAds = () => {
    setViewMode('all');
    setActiveCategory(null);
    setActiveSubcategory(null);
    if (isMobile) {
      setMobileFilterOpen(false);
    }
  };

  // محتوای اصلی فیلتر
  const filterContent = (
    <>
      {/* نمایش نوار برگشت و عنوان */}
      <div className="flex items-center justify-between mb-4">
        {isMobile && (
          <button
            onClick={() => setMobileFilterOpen(false)}
            className="md:hidden text-gray-400 hover:text-white cursor-pointer"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        )}
        
        {viewMode !== 'all' && (
          <button 
            onClick={handleAllAds}
            className="flex items-center text-red-500 hover:text-red-400 transition-colors duration-200 font-medium cursor-pointer"
          >
            <ChevronLeftIcon className="h-5 w-5 transform scale-x-[-1]" />
            <span className="mr-1 text-sm sm:text-base">همه آگهی‌ها</span>
          </button>
        )}
        
        <h3 className="text-base sm:text-lg font-medium text-gray-100 truncate max-w-[150px] sm:max-w-none">
          {viewMode === 'all' ? 'دسته‌ها' : 
           viewMode === 'category' ? categories.find(c => c.id === activeCategory)?.name : 
           subcategories.find(s => s.id === activeSubcategory)?.name}
        </h3>
        
        {/* خالی برای حفظ تراز بندی - رسپانسیو */}
        <div className="w-5 sm:w-20"></div>
      </div>
      
      <div className="space-y-2 overflow-y-auto max-h-[50vh] md:max-h-[60vh] pr-1 -mr-1">
        {/* نمایش همه دسته‌ها */}
        {viewMode === 'all' && (
          <>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategorySelect(category.id)}
                className="flex items-center w-full px-2 sm:px-3 py-1.5 sm:py-2 text-right rounded-md cursor-pointer text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
              >
                <span className="mr-2 text-lg sm:text-xl">{category.icon}</span>
                <span className="text-sm sm:text-base">{category.name}</span>
              </button>
            ))}
          </>
        )}
        
        {/* نمایش زیردسته‌ها برای دسته انتخاب شده */}
        {viewMode === 'category' && (
          <>
            {filteredSubcategories.map((subcategory) => (
              <button
                key={subcategory.id}
                onClick={() => handleSubcategorySelect(subcategory.id)}
                className="flex items-center justify-between w-full px-2 sm:px-3 py-1.5 sm:py-2 text-right rounded-md cursor-pointer text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
              >
                <span className="text-sm sm:text-base">{subcategory.name}</span>
                {subsubcategories.some(sub => sub.parentId === subcategory.id) && (
                  <ChevronLeftIcon className="h-4 w-4 transform scale-x-[-1]" />
                )}
              </button>
            ))}
          </>
        )}
        
        {/* نمایش زیرزیردسته‌ها برای زیردسته انتخاب شده */}
        {viewMode === 'subcategory' && (
          <>
            {filteredSubsubcategories.map((subsubcategory) => (
              <button
                key={subsubcategory.id}
                className="flex items-center w-full px-2 sm:px-3 py-1.5 sm:py-2 text-right rounded-md cursor-pointer text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
              >
                <span className="text-sm sm:text-base">{subsubcategory.name}</span>
              </button>
            ))}
          </>
        )}
      </div>

      {/* فیلترها */}
      <div className="mt-4 sm:mt-6 border-t border-gray-700 pt-4 sm:pt-6">
        <h3 className="text-base sm:text-lg font-medium text-gray-100 mb-3 sm:mb-4">فیلترها</h3>

        {/* قیمت */}
        <Disclosure
          as="div"
          className="border-b border-gray-700 py-4 sm:py-6"
          defaultOpen={true}
        >
          {({ open }) => (
            <>
              <h3 className="-my-3 flow-root">
                <Disclosure.Button className="flex w-full items-center justify-between py-2 sm:py-3 text-sm text-gray-400 hover:text-gray-200 cursor-pointer">
                  <span className="font-medium text-gray-100">قیمت</span>
                  <span className="ml-6 flex items-center">
                    <ChevronDownIcon
                      className={`h-5 w-5 ${
                        open ? '-rotate-180' : ''
                      } transition-transform duration-200`}
                      aria-hidden="true"
                    />
                  </span>
                </Disclosure.Button>
              </h3>
              <Disclosure.Panel className="pt-4 sm:pt-6">
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        placeholder="مثلا ۱۰,۰۰۰,۰۰۰"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        className="w-full rounded-md border border-gray-700 bg-gray-800 py-2 px-2 text-xs sm:text-sm text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
                      />
                      <div className="absolute inset-y-0 left-0 flex items-center">
                        <button className="flex items-center justify-center h-full px-1 sm:px-2 border-r border-gray-700 text-gray-500 text-xs sm:text-sm cursor-pointer">
                          تومان
                          <ChevronDownIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        placeholder="مثلا ۱۰۰,۰۰۰,۰۰۰"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className="w-full rounded-md border border-gray-700 bg-gray-800 py-2 px-2 text-xs sm:text-sm text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
                      />
                      <div className="absolute inset-y-0 left-0 flex items-center">
                        <button className="flex items-center justify-center h-full px-1 sm:px-2 border-r border-gray-700 text-gray-500 text-xs sm:text-sm cursor-pointer">
                          تومان
                          <ChevronDownIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm text-gray-400">حذف توافقی‌ها</span>
                    <Switch
                      checked={hideNegotiables}
                      onChange={setHideNegotiables}
                      className={`${
                        hideNegotiables ? 'bg-red-600' : 'bg-gray-700'
                      } relative inline-flex h-5 sm:h-6 w-9 sm:w-11 items-center rounded-full transition-colors cursor-pointer`}
                    >
                      <span
                        className={`${
                          hideNegotiables ? 'translate-x-5 sm:translate-x-6' : 'translate-x-1'
                        } inline-block h-3 sm:h-4 w-3 sm:w-4 transform rounded-full bg-white transition-transform rtl:-scale-x-100`}
                      />
                    </Switch>
                  </div>
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>

        {/* سایر فیلترها */}
        {filters.map((section) => (
          <Disclosure
            as="div"
            key={section.id}
            className="border-b border-gray-700 py-4 sm:py-6"
          >
            {({ open }) => (
              <>
                <h3 className="-my-3 flow-root">
                  <Disclosure.Button className="flex w-full items-center justify-between py-2 sm:py-3 text-sm text-gray-400 hover:text-gray-200 cursor-pointer">
                    <span className="font-medium text-gray-100">
                      {section.name}
                    </span>
                    <span className="ml-6 flex items-center">
                      <ChevronDownIcon
                        className={`h-5 w-5 ${
                          open ? '-rotate-180' : ''
                        } transition-transform duration-200`}
                        aria-hidden="true"
                      />
                    </span>
                  </Disclosure.Button>
                </h3>
                <Disclosure.Panel className="pt-4 sm:pt-6">
                  <div className="space-y-3 sm:space-y-4">
                    {section.options.map((option, optionIdx) => (
                      <div key={option.value} className="flex items-center">
                        <input
                          id={`filter-${section.id}-${optionIdx}`}
                          name={`${section.id}[]`}
                          defaultValue={option.value}
                          type="checkbox"
                          className="h-3 w-3 sm:h-4 sm:w-4 rounded border-gray-600 text-red-600 focus:ring-red-500 bg-gray-800 cursor-pointer"
                        />
                        <label
                          htmlFor={`filter-${section.id}-${optionIdx}`}
                          className="mr-2 sm:mr-3 text-xs sm:text-sm text-gray-300 cursor-pointer"
                        >
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        ))}
      </div>
    </>
  );

  // برای نمایش در حالت موبایل
  if (isMobile) {
    return (
      <>
        {/* دکمه فیلتر در حالت موبایل */}
        <button 
          onClick={() => setMobileFilterOpen(true)}
          className="fixed bottom-4 right-4 z-30 bg-red-600 text-white p-3 rounded-full shadow-lg hover:bg-red-700 transition-colors duration-200 md:hidden"
        >
          <AdjustmentsVerticalIcon className="h-6 w-6" />
        </button>
        
        {/* پنل فیلتر در حالت موبایل */}
        {mobileFilterOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex md:hidden">
            <div 
              className="bg-gray-900 text-white w-4/5 max-w-xs h-full overflow-y-auto ml-auto animate-slide-right p-4"
              onClick={(e) => e.stopPropagation()}
            >
              {filterContent}
            </div>
            {/* برای بستن پنل با کلیک روی بیرون */}
            <div 
              className="flex-1"
              onClick={() => setMobileFilterOpen(false)}
            ></div>
          </div>
        )}
      </>
    );
  }

  // نمایش عادی در دسکتاپ
  return (
    <div className="bg-gray-900 text-white rounded-lg shadow-lg border border-gray-800 p-4 sticky top-6 hidden md:block">
      {filterContent}
    </div>
  );
}
