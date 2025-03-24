"use client";

import { Category } from '@/data/mockData';

interface HorizontalCategoriesProps {
  categories: Category[];
  activeCategory: number | null;
  setActiveCategory: (categoryId: number | null) => void;
}

export default function HorizontalCategories({
  categories,
  activeCategory,
  setActiveCategory,
}: HorizontalCategoriesProps) {
  return (
    <div className="lg:hidden overflow-x-auto mb-4 pb-2 -mx-4 px-4">
      <div className="flex space-x-3 rtl:space-x-reverse">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(activeCategory === category.id ? null : category.id)}
            className={`flex flex-col items-center px-3 py-2 rounded-md whitespace-nowrap min-w-[70px] transition-colors cursor-pointer ${
              activeCategory === category.id 
                ? 'bg-red-800 text-white shadow-md' 
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
            }`}
          >
            <span className="text-xl mb-1">{category.icon}</span>
            <span className="text-xs">{category.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
} 