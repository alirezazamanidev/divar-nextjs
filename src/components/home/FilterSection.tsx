'use client';

import { useState } from 'react';
import { Disclosure, Switch } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
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
  // ذخیره زیردسته فعال
  const [activeSubcategory, setActiveSubcategory] = useState<number | null>(
    null,
  );

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

  return (
    <div className="bg-gray-900 text-white rounded-lg shadow-lg border border-gray-800 p-4 sticky top-6">
      <h3 className="text-lg font-medium text-gray-100 mb-4">دسته‌ها</h3>
      <div className="space-y-2">
        {categories.map((category) => (
          <div key={category.id} className="space-y-1">
            <button
              onClick={() => {
                setActiveCategory(
                  activeCategory === category.id ? null : category.id,
                );
                setActiveSubcategory(null); // زمانی که دسته عوض می‌شود، زیردسته را ریست کنیم
              }}
              className={`flex items-center w-full px-3 py-2 text-right rounded-md cursor-pointer ${
                activeCategory === category.id
                  ? 'bg-red-800 text-white font-medium shadow-md'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <span className="mr-2">{category.icon}</span>
              <span>{category.name}</span>
            </button>

            {/* نمایش زیردسته‌ها */}
            {activeCategory === category.id &&
              filteredSubcategories.length > 0 && (
                <div className="mr-6 border-r border-gray-700 pr-2 space-y-1 mt-1">
                  {filteredSubcategories.map((subcategory) => (
                    <div key={subcategory.id} className="space-y-1">
                      <button
                        onClick={() =>
                          setActiveSubcategory(
                            activeSubcategory === subcategory.id
                              ? null
                              : subcategory.id,
                          )
                        }
                        className={`flex items-center w-full px-3 py-1.5 text-right rounded-md text-sm cursor-pointer ${
                          activeSubcategory === subcategory.id
                            ? 'bg-red-700 text-white font-medium shadow-sm'
                            : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                        }`}
                      >
                        <span>{subcategory.name}</span>
                      </button>

                      {/* نمایش زیرزیردسته‌ها */}
                      {activeSubcategory === subcategory.id &&
                        filteredSubsubcategories.length > 0 && (
                          <div className="mr-6 border-r border-gray-700 pr-2 space-y-1 mt-1">
                            {filteredSubsubcategories.map((subsubcategory) => (
                              <button
                                key={subsubcategory.id}
                                className="flex items-center w-full px-3 py-1 text-right rounded-md text-xs text-gray-300 hover:bg-red-600 hover:text-white transition-colors cursor-pointer"
                              >
                                <span>{subsubcategory.name}</span>
                              </button>
                            ))}
                          </div>
                        )}
                    </div>
                  ))}
                </div>
              )}
          </div>
        ))}
      </div>

      <div className="mt-6 border-t border-gray-700 pt-6">
        <h3 className="text-lg font-medium text-gray-100 mb-4">فیلترها</h3>

        {/* قیمت */}
        <Disclosure
          as="div"
          className="border-b border-gray-700 py-6"
          defaultOpen={true}
        >
          {({ open }) => (
            <>
              <h3 className="-my-3 flow-root">
                <Disclosure.Button className="flex w-full items-center justify-between py-3 text-sm text-gray-400 hover:text-gray-200 cursor-pointer">
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
              <Disclosure.Panel className="pt-6">
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        placeholder="مثلا ۱۰,۰۰۰,۰۰۰"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        className="w-full rounded-md border border-gray-700 bg-gray-800 py-2 px-2 text-sm text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
                      />
                      <div className="absolute inset-y-0 left-0 flex items-center">
                        <button className="flex items-center justify-center h-full px-2 border-r border-gray-700 text-gray-500 text-sm cursor-pointer">
                          تومان
                          <ChevronDownIcon className="h-4 w-4 mr-1" />
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
                        className="w-full rounded-md border border-gray-700 bg-gray-800 py-2 px-2 text-sm text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
                      />
                      <div className="absolute inset-y-0 left-0 flex items-center">
                        <button className="flex items-center justify-center h-full px-2 border-r border-gray-700 text-gray-500 text-sm cursor-pointer">
                          تومان
                          <ChevronDownIcon className="h-4 w-4 mr-1" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">حذف توافقی‌ها</span>
                    <Switch
                      checked={hideNegotiables}
                      onChange={setHideNegotiables}
                      className={`${
                        hideNegotiables ? 'bg-red-600' : 'bg-gray-700'
                      } relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer`}
                    >
                      <span
                        className={`${
                          hideNegotiables ? 'translate-x-6' : 'translate-x-1'
                        } inline-block h-4 w-4 transform rounded-full bg-white transition-transform rtl:-scale-x-100`}
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
            className="border-b border-gray-700 py-6"
          >
            {({ open }) => (
              <>
                <h3 className="-my-3 flow-root">
                  <Disclosure.Button className="flex w-full items-center justify-between py-3 text-sm text-gray-400 hover:text-gray-200 cursor-pointer">
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
                <Disclosure.Panel className="pt-6">
                  <div className="space-y-4">
                    {section.options.map((option, optionIdx) => (
                      <div key={option.value} className="flex items-center">
                        <input
                          id={`filter-${section.id}-${optionIdx}`}
                          name={`${section.id}[]`}
                          defaultValue={option.value}
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-600 text-red-600 focus:ring-red-500 bg-gray-800 cursor-pointer"
                        />
                        <label
                          htmlFor={`filter-${section.id}-${optionIdx}`}
                          className="mr-3 text-sm text-gray-300 cursor-pointer"
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
    </div>
  );
}
