import moment from "moment-jalaali";
moment.loadPersian({ usePersianDigits: true });
// Function to format price with thousands separators
export const formatPrice = (price: string | number) => {
    if (!price) return '';
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };


export const formatDateNow = (date: Date) => {
    return moment(date).fromNow();
  };