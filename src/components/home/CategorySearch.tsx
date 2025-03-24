'use client';

import React, { useState, useEffect, useRef } from 'react';
import { categories, subcategories, subsubcategories, Category } from '@/data/mockData';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

// Extended Category interface to include matched subcategories
interface ExtendedCategory extends Category {
  matchedSubcategory?: number;
  matchedSubsubcategory?: number;
}

interface CategorySearchProps {
  onCategorySelect: (categoryId: number) => void;
  onSubcategorySelect: (categoryId: number, subcategoryId: number) => void;
  selectedCategory: number | null;
  selectedSubcategory: number | null;
  onCategoryChange: () => void;
}

export default function CategorySearch({
  onCategorySelect,
  onSubcategorySelect,
  selectedCategory,
  selectedSubcategory,
  onCategoryChange
}: CategorySearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCategories, setFilteredCategories] = useState<ExtendedCategory[]>(categories);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Filter categories based on search query
  useEffect(() => {
    if (!searchQuery) {
      setFilteredCategories(categories);
      return;
    }

    const query = searchQuery.toLowerCase();
    
    // Search in main categories
    const matchingCategories = categories.filter(cat => 
      cat.name.toLowerCase().includes(query)
    );

    // Search in subcategories and include their parent categories
    const matchingFromSubcategories: ExtendedCategory[] = [];
    subcategories.filter(subcat => 
      subcat.name.toLowerCase().includes(query)
    ).forEach(subcat => {
      const parentCategory = categories.find(cat => cat.id === subcat.parentId);
      if (parentCategory) {
        matchingFromSubcategories.push({
          ...parentCategory,
          matchedSubcategory: subcat.id
        });
      }
    });

    // Search in subsubcategories and include their parent categories
    const matchingFromSubsubcategories: ExtendedCategory[] = [];
    subsubcategories.filter(subsubcat => 
      subsubcat.name.toLowerCase().includes(query)
    ).forEach(subsubcat => {
      const parentSubcategory = subcategories.find(subcat => subcat.id === subsubcat.parentId);
      if (!parentSubcategory) return;
      
      const parentCategory = categories.find(cat => cat.id === parentSubcategory.parentId);
      if (parentCategory) {
        matchingFromSubsubcategories.push({
          ...parentCategory,
          matchedSubcategory: parentSubcategory.id,
          matchedSubsubcategory: subsubcat.id
        });
      }
    });

    // Combine and remove duplicates
    const allMatches: ExtendedCategory[] = [...matchingCategories];
    
    // Add matches from subcategories if they're not already included
    matchingFromSubcategories.forEach(match => {
      if (!allMatches.some(cat => cat.id === match.id)) {
        allMatches.push(match);
      }
    });
    
    // Add matches from subsubcategories if they're not already included
    matchingFromSubsubcategories.forEach(match => {
      if (!allMatches.some(cat => cat.id === match.id)) {
        allMatches.push(match);
      }
    });

    setFilteredCategories(allMatches);
  }, [searchQuery]);

  // Click outside handler to close search results
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle category selection
  const handleCategorySelect = (categoryId: number) => {
    onCategorySelect(categoryId);
    setShowResults(false);
    setSearchQuery('');
  };

  // Handle subcategory selection
  const handleSubcategorySelect = (categoryId: number, subcategoryId: number) => {
    onSubcategorySelect(categoryId, subcategoryId);
    setShowResults(false);
    setSearchQuery('');
  };

  return (
    <>
      {/* Category search box */}
      <div className="relative mb-8" ref={searchRef}>
        <div className="relative rounded-lg overflow-hidden">
          <input
            type="text"
            placeholder="املاک"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowResults(true);
            }}
            onFocus={() => setShowResults(true)}
            className="w-full py-3 px-10 bg-gray-800 text-gray-100 placeholder-gray-500 border border-gray-700 rounded-lg text-right"
          />
          {searchQuery && (
            <button 
              onClick={() => {
                setSearchQuery('');
                setShowResults(true);
              }}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          )}
          <MagnifyingGlassIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
        
        {/* Search results */}
        {showResults && (
          <div className="absolute z-10 mt-1 w-full bg-gray-800 border border-gray-700 rounded-lg shadow-lg max-h-96 overflow-y-auto">
            {filteredCategories.length > 0 ? (
              <ul className="py-2 divide-y divide-gray-700 text-right">
                {filteredCategories.map((category) => {
                  // Get subcategories for this category
                  const categorySubcategories = subcategories.filter(
                    (subcat) => subcat.parentId === category.id
                  );
                  
                  return (
                    <li key={category.id} className="px-3 py-2 hover:bg-gray-700">
                      <div 
                        className="flex items-center justify-end cursor-pointer text-gray-100 hover:text-white"
                        onClick={() => handleCategorySelect(category.id)}
                      >
                        <span className="font-medium">{category.name}</span>
                        <span className="ml-2 text-xl">{category.icon}</span>
                      </div>
                      
                      {/* Show subcategories if they exist */}
                      {categorySubcategories.length > 0 && (
                        <ul className="mt-2 pr-6 space-y-1">
                          {categorySubcategories.map((subcat) => (
                            <li 
                              key={subcat.id} 
                              className="text-gray-300 hover:text-white cursor-pointer py-1"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSubcategorySelect(category.id, subcat.id);
                              }}
                            >
                              {subcat.name}
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="py-3 px-4 text-gray-400 text-center">
                دسته‌بندی با این عنوان پیدا نشد
              </div>
            )}
            
            <div className="px-3 py-2 bg-gray-900 text-gray-400 text-center border-t border-gray-700">
              <button 
                className="hover:text-white"
                onClick={() => {
                  setShowResults(false);
                  // Navigate to all categories page
                  // router.push('/categories');
                }}
              >
                نمایش همهٔ دسته‌های دیوار
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Selected Category/Subcategory information */}
      {selectedCategory && (
        <div className="bg-gray-800 rounded-lg p-4 mb-6 text-right">
          <h3 className="font-medium text-lg mb-2">
            دسته انتخاب شده:
          </h3>
          <p className="text-gray-300">
            {categories.find(cat => cat.id === selectedCategory)?.name}
            {selectedSubcategory && (
              <> &gt; {subcategories.find(subcat => subcat.id === selectedSubcategory)?.name}</>
            )}
          </p>
          <button 
            className="mt-3 text-blue-400 hover:text-blue-300"
            onClick={onCategoryChange}
          >
            تغییر دسته
          </button>
        </div>
      )}
    </>
  );
} 