import moment from 'moment-jalaali';
moment.loadPersian({ usePersianDigits: true });
// Function to format price with thousands separators
export const formatPrice = (price: string | number) => {
  if (!price) return '';
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
export function debounce<T extends (...args: any[]) => void>(func: T, wait: number) {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, wait);
  };
}

export const formatDateNow = (date: Date) => {
  return moment(date).fromNow();
};
