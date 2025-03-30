type RequestOptions = RequestInit & {
    /** پارامترهای Query string */
    params?: Record<string, string>;
    /** استراتژی کش */
    cache?: RequestCache;
    /** تنظیمات Next.js */
    next?: { 
      tags?: string[]; 
      revalidate?: number 
    };
  };
  
export async function Feacher<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const { params, next, ...fetchOptions } = options;
  
    // ساخت URL کامل
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
    let url = `${baseUrl}${endpoint}`;
  
    // افزودن پارامترهای Query
    if (params && Object.keys(params).length > 0) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value) searchParams.append(key, value);
      });
      url += `?${searchParams.toString()}`;
    }
  
   
    
    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...fetchOptions.headers,
        },
        next,
      });
  
      if (!response.ok) {
        const errorData = await response.text()
          .catch(() => 'خطایی در دریافت جزئیات خطا رخ داد');
        console.error(`خطای API (${response.status}):`, errorData);
        throw new Error(`خطای API: ${response.status} - ${errorData}`);
      }
  
  
      return  response.json()
    } catch (error) {
      console.error('خطا در فراخوانی API:', error);
      throw error instanceof Error 
        ? error 
        : new Error('خطای ناشناخته در فراخوانی API');
    }
  }