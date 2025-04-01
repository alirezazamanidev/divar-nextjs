import React from 'react';
import ListingCard, { Listing } from './ListingCard';

interface ListingsGridProps {
  listings: Listing[];
  columns?: number;
}

const ListingsGrid: React.FC<ListingsGridProps> = ({ 
  listings, 
  columns = 4 // پیش‌فرض 4 ستون
}) => {
  // تعیین کلاس‌های گرید براساس تعداد ستون‌های مورد نیاز
  const getGridColsClass = () => {
    switch(columns) {
      case 1: return 'grid-cols-1';
      case 2: return 'grid-cols-1 sm:grid-cols-2';
      case 3: return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3';
      case 4: 
      default: return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4';
    }
  };

  return (
    <div className={`grid ${getGridColsClass()} gap-4`}>
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
};

export default ListingsGrid; 