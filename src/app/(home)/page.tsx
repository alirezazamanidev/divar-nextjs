'use client';

import { useState } from 'react';
import Header from '@/components/home/Header';
import Footer from '@/components/home/Footer';
import AdCard from '@/components/home/AdCard';
import FilterSection from '@/components/home/FilterSection';
import MobileFilters from '@/components/home/MobileFilters';
import HorizontalCategories from '@/components/home/HorizontalCategories';
import { categories, filters, advertisements } from '@/data/mockData';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

export default function Home() {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);

  // وقتی روی دسته‌بندی کلیک می‌شود
  const handleCategoryClick = (categoryId: number | null) => {
    setActiveCategory(categoryId);
    // اگر در حالت موبایل دسته‌بندی انتخاب شد، فیلتر موبایل را باز کنیم
    if (categoryId !== null && window.innerWidth < 1024) {
      setMobileFiltersOpen(true);
    }
  };

  return (
    <div className="bg-gray-950 min-h-screen text-gray-100">
      <Header />

      <div className="container mx-auto px-4 py-6">
        <div className="text-right mb-6">
          <h2 className="text-lg font-medium text-gray-100">
            انواع آگهی‌ها و نیازمندی های مشهد
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row-reverse gap-6">
          {/* Main content */}
          <div className="flex-1">
            {/* Quick category selection for mobile */}
            <HorizontalCategories
              categories={categories}
              activeCategory={activeCategory}
              setActiveCategory={handleCategoryClick}
            />

            <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {advertisements.map((ad) => (
                <AdCard
                  key={ad.id}
                  id={ad.id}
                  title={ad.title}
                  subtitle={ad.subtitle}
                  price={ad.price}
                  location={ad.location}
                  image={ad.image}
                />
              ))}
            </div>
          </div>
          {/* Sidebar filter section */}
          <div className="lg:w-72">
            <div className="hidden lg:block">
              <FilterSection
                categories={categories}
                filters={filters}
                activeCategory={activeCategory}
                setActiveCategory={handleCategoryClick}
              />
            </div>

            {/* Mobile filter button */}
            <div className="flex items-center justify-between lg:hidden mb-4">
              <button
                type="button"
                className="text-gray-300 border border-gray-700 rounded-md py-2 px-4 flex items-center text-sm font-medium bg-gray-800 hover:bg-gray-700"
                onClick={() => setMobileFiltersOpen(true)}
              >
                <span>فیلترها</span>
                <ChevronDownIcon className="mr-1 h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Mobile filters */}
          <MobileFilters
            filters={filters}
            open={mobileFiltersOpen}
            setOpen={setMobileFiltersOpen}
            activeCategory={activeCategory}
            setActiveCategory={handleCategoryClick}
          />
        </div>
      </div>

      <Footer />
    </div>
  );
}
