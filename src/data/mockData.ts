export interface Advertisement {
  id: number;
  title: string;
  subtitle?: string;
  price?: string;
  location: string;
  image?: string;
}

export interface Subcategory {
  id: number;
  name: string;
  parentId: number;
}

export interface Subsubcategory {
  id: number;
  name: string;
  parentId: number;
}

export interface Category {
  id: number;
  name: string;
  icon: string;
}

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterSection {
  id: string;
  name: string;
  options: FilterOption[];
}

// Categories
export const categories: Category[] = [
  { id: 1, name: 'املاک', icon: '🏠' },
  { id: 2, name: 'وسایل نقلیه', icon: '🚗' },
  { id: 3, name: 'کالای دیجیتال', icon: '📱' },
  { id: 4, name: 'خانه و آشپزخانه', icon: '🏡' },
  { id: 5, name: 'خدمات', icon: '🔧' },
  { id: 6, name: 'وسایل شخصی', icon: '👔' },
  { id: 7, name: 'سرگرمی و فراغت', icon: '🎮' },
  { id: 8, name: 'اجتماعی', icon: '👥' },
  { id: 9, name: 'تجهیزات و صنعتی', icon: '🏭' },
  { id: 10, name: 'استخدام و کاریابی', icon: '💼' },
];

// Subcategories
export const subcategories: Subcategory[] = [
  // املاک
  { id: 101, name: 'فروش مسکونی', parentId: 1 },
  { id: 102, name: 'اجاره مسکونی', parentId: 1 },
  { id: 103, name: 'فروش اداری و تجاری', parentId: 1 },
  { id: 104, name: 'اجاره اداری و تجاری', parentId: 1 },
  { id: 105, name: 'اجاره کوتاه‌مدت', parentId: 1 },
  { id: 106, name: 'پروژه‌های ساخت‌وساز', parentId: 1 },
  
  // وسایل نقلیه
  { id: 201, name: 'خودرو', parentId: 2 },
  { id: 202, name: 'موتورسیکلت', parentId: 2 },
  { id: 203, name: 'قطعات یدکی', parentId: 2 },
  
  // کالای دیجیتال
  { id: 301, name: 'موبایل', parentId: 3 },
  { id: 302, name: 'تبلت', parentId: 3 },
  { id: 303, name: 'لپ تاپ', parentId: 3 },
  { id: 304, name: 'کامپیوتر', parentId: 3 },
  { id: 305, name: 'دوربین', parentId: 3 },
  
  // خانه و آشپزخانه
  { id: 401, name: 'لوازم خانگی برقی', parentId: 4 },
  { id: 402, name: 'ظروف و لوازم آشپزخانه', parentId: 4 },
  { id: 403, name: 'خواب و حمام', parentId: 4 },
  { id: 404, name: 'مبلمان و صندلی', parentId: 4 },
  
  // خدمات
  { id: 501, name: 'موتور و ماشین', parentId: 5 },
  { id: 502, name: 'پیشه و مهارت', parentId: 5 },
  { id: 503, name: 'آموزشی', parentId: 5 },
  
  // وسایل شخصی
  { id: 601, name: 'کیف، کفش و لباس', parentId: 6 },
  { id: 602, name: 'آرایشی، بهداشتی و درمانی', parentId: 6 },
  { id: 603, name: 'کودک و نوزاد', parentId: 6 },
  
  // سرگرمی و فراغت
  { id: 701, name: 'بلیط، تور و چارتر', parentId: 7 },
  { id: 702, name: 'کتاب و مجله', parentId: 7 },
  { id: 703, name: 'دوچرخه', parentId: 7 },
  { id: 704, name: 'حیوانات', parentId: 7 },
  
  // اجتماعی
  { id: 801, name: 'رویداد', parentId: 8 },
  { id: 802, name: 'داوطلبانه', parentId: 8 },
  { id: 803, name: 'گمشده‌ها', parentId: 8 },
  
  // تجهیزات و صنعتی
  { id: 901, name: 'مصالح ساختمانی', parentId: 9 },
  { id: 902, name: 'ابزارآلات', parentId: 9 },
  { id: 903, name: 'ماشین‌آلات صنعتی', parentId: 9 },
  
  // استخدام و کاریابی
  { id: 1001, name: 'اداری و مدیریت', parentId: 10 },
  { id: 1002, name: 'سرایداری و نظافت', parentId: 10 },
  { id: 1003, name: 'معماری و مهندسی', parentId: 10 },
  { id: 1004, name: 'رایانه و فناوری اطلاعات', parentId: 10 },
];

// زیرزیردسته‌ها (سطح سوم)
export const subsubcategories: Subsubcategory[] = [
  // زیرزیردسته‌های فروش مسکونی
  { id: 10101, name: 'آپارتمان', parentId: 101 },
  { id: 10102, name: 'خانه و ویلا', parentId: 101 },
  { id: 10103, name: 'زمین و کلنگی', parentId: 101 },
  
  // زیرزیردسته‌های اجاره مسکونی
  { id: 10201, name: 'آپارتمان', parentId: 102 },
  { id: 10202, name: 'خانه و ویلا', parentId: 102 },
  
  // زیرزیردسته‌های فروش اداری و تجاری
  { id: 10301, name: 'دفتر کار، اتاق اداری و مطب', parentId: 103 },
  { id: 10302, name: 'مغازه و غرفه', parentId: 103 },
  { id: 10303, name: 'صنعتی، کشاورزی و تجاری', parentId: 103 },
  
  // زیرزیردسته‌های اجاره اداری و تجاری
  { id: 10401, name: 'دفتر کار، اتاق اداری و مطب', parentId: 104 },
  { id: 10402, name: 'مغازه و غرفه', parentId: 104 },
  { id: 10403, name: 'صنعتی، کشاورزی و تجاری', parentId: 104 },
  
  // زیرزیردسته‌های خودرو
  { id: 20101, name: 'سواری', parentId: 201 },
  { id: 20102, name: 'شاسی بلند', parentId: 201 },
  { id: 20103, name: 'وانت', parentId: 201 },
  
  // زیرزیردسته‌های موبایل
  { id: 30101, name: 'اپل', parentId: 301 },
  { id: 30102, name: 'سامسونگ', parentId: 301 },
  { id: 30103, name: 'شیائومی', parentId: 301 },
  { id: 30104, name: 'هوآوی', parentId: 301 },

  // زیرزیردسته‌های لپ تاپ
  { id: 30301, name: 'ایسوس', parentId: 303 },
  { id: 30302, name: 'اپل', parentId: 303 },
  { id: 30303, name: 'لنوو', parentId: 303 },
  { id: 30304, name: 'اچ‌پی', parentId: 303 },
  { id: 30305, name: 'دل', parentId: 303 },
];

// Filter options
export const filters: FilterSection[] = [
  {
    id: 'location',
    name: 'محل',
    options: [
      { value: 'all', label: 'همه' },
      { value: 'mashad', label: 'مشهد' },
      { value: 'tehran', label: 'تهران' },
      { value: 'esfahan', label: 'اصفهان' },
    ],
  },
  {
    id: 'status',
    name: 'وضعیت آگهی',
    options: [
      { value: 'all', label: 'همه' },
      { value: 'new', label: 'جدید' },
      { value: 'used', label: 'کارکرده' },
    ],
  },
  {
    id: 'type',
    name: 'انواعها',
    options: [
      { value: 'all', label: 'همه انواع' },
      { value: 'personal', label: 'شخصی' },
      { value: 'store', label: 'فروشگاه' },
    ],
  },
];

// Advertisements
export const advertisements: Advertisement[] = [
  {
    id: 1,
    title: 'کشمش درز کشمش',
    subtitle: 'آفتابی گردو کشمش شراب',
    price: '85,000 تومان',
    location: 'پله شده در الهیه',
    image: '/placeholder.jpg'
  },
  {
    id: 2,
    title: 'عکاسی فضای باز',
    subtitle: 'نردبان شده در دانلفر عباسی',
    price: '220,000 تومان',
    location: 'لحظاتی پیش در کشاورز',
    image: '/placeholder.jpg'
  },
  {
    id: 3,
    title: 'کیشون فابریک تیبا',
    subtitle: '',
    price: '',
    location: 'لحظاتی پیش در کشاورز',
    image: '/placeholder.jpg'
  },
  {
    id: 4,
    title: 'بخاری',
    subtitle: 'کارکرده',
    price: '3,000,000 تومان',
    location: 'لحظاتی پیش در سعدی',
    image: '/placeholder.jpg'
  },
  {
    id: 5,
    title: 'تیشرت دورس حوضی لباس',
    subtitle: 'پدر مادر پسری (جی جاپ)',
    price: '350,000 تومان',
    location: 'نردبان شده | فروشگاه در قاسم',
    image: '/placeholder.jpg'
  },
  {
    id: 6,
    title: 'لوبیا قرمز محلی',
    subtitle: '',
    price: '111,111,111 تومان',
    location: 'لحظاتی پیش در بلوار توس',
    image: '/placeholder.jpg'
  },
  {
    id: 7,
    title: 'دوچرخه سایز۲۰',
    subtitle: '',
    price: '950,000 تومان',
    location: 'لحظاتی پیش در کشاورز',
    image: '/placeholder.jpg'
  },
  {
    id: 8,
    title: 'دندان مصنوعی ثابت',
    subtitle: 'کارد فلکسیبل',
    price: '',
    location: 'نردبان شده در امام رضا',
    image: '/placeholder.jpg'
  },
  {
    id: 9,
    title: 'برج سرن انتخاب زندگی',
    subtitle: 'هوشمندقلب وحانیه',
    price: '8,400,000,000 تومان',
    location: 'نردبان شده در الهیه',
    image: '/placeholder.jpg'
  },
]; 