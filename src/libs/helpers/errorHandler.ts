import toast from 'react-hot-toast';
import { BaseException } from '../exceptions';
import { useRouter } from 'next/navigation';

export const handleApiError = (error: any) => {
  if (error instanceof BaseException) {
    // خطاهای شناخته شده را مدیریت می‌کنیم
    switch (error.statusCode) {
      case 400:
        // خطای درخواست نامعتبر
        showErrorToast(error.message || 'درخواست نامعتبر است');
        break;
      case 401:
        // خطای احراز هویت - کاربر را به صفحه لاگین هدایت می‌کنیم
        showErrorToast(error.message || 'لطفاً وارد حساب کاربری خود شوید');
        // می‌توان از useRouter برای هدایت کاربر استفاده کرد
        // const router = useRouter();
        // router.push('/auth/login');
        break;
      case 403:
        // خطای دسترسی غیرمجاز
        showErrorToast(error.message || 'شما دسترسی به این بخش را ندارید');
        break;
      case 404:
        // خطای منبع یافت نشد
        showErrorToast(error.message || 'اطلاعات درخواستی یافت نشد');
        break;
      case 422:
        // خطای اعتبارسنجی داده‌ها
        showErrorToast(error.message || 'اطلاعات وارد شده معتبر نیست');
        break;
      case 429:
        // محدودیت تعداد درخواست
        showErrorToast(error.message || 'تعداد درخواست‌های شما بیش از حد مجاز است. لطفاً کمی صبر کنید');
        break;
      case 500:
      case 502:
      case 503:
      case 504:
        // خطاهای سمت سرور
        showErrorToast(error.message || 'خطا در سرور رخ داده است. لطفاً بعداً تلاش کنید');
        break;
      default:
        // سایر خطاها
        showErrorToast(error.message || 'خطایی رخ داده است');
        break;
    }
  } else if (error.name === 'NetworkError' || error.message === 'Network Error') {
    // خطای شبکه
    showErrorToast('اتصال به اینترنت برقرار نیست. لطفاً اتصال خود را بررسی کنید');
  } else if (error.name === 'TimeoutError' || error.code === 'ECONNABORTED') {
    // خطای تایم‌اوت
    showErrorToast('زمان پاسخگویی سرور به پایان رسید. لطفاً بعداً تلاش کنید');
  } else if (error.name === 'AbortError') {
    // درخواست لغو شده
    showErrorToast('درخواست لغو شد');
  } else {
    // خطاهای پیش‌بینی نشده
    showErrorToast('خطای غیرمنتظره‌ای رخ داده است');
    console.error('Unhandled error:', error);
  }
  
  // ثبت خطا برای تحلیل بعدی
  logError(error);
};

// تابع کمکی برای نمایش پیام خطا
const showErrorToast = (message: string) => {
  toast.error(message, {
    duration: 4000,
    position: 'top-center',
    style: {
      borderRadius: '10px',
      background: '#FFF1F1',
      color: '#E11D48',
    },
  });
};

// ثبت خطا برای تحلیل بعدی
const logError = (error: any) => {
  // در محیط توسعه، خطا را در کنسول نمایش می‌دهیم
  if (process.env.NODE_ENV === 'development') {
    console.group('API Error Details');
    console.error('Error:', error);
    console.error('Message:', error.message);
    console.error('Status:', error instanceof BaseException ? error.statusCode : 'N/A');
    console.error('Stack:', error.stack);
    console.groupEnd();
  }
  
 
};