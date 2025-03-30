import { City, Province } from '@/libs/models/location';

/**
 * بازیابی همه استان‌های ایران
 */
export const getAllProvinces = async (): Promise<Province[]> => {
  try {
    const response = await fetch('/data/json/provinces.json');
    if (!response.ok) {
      throw new Error('خطا در دریافت لیست استان‌ها');
    }
    const provinces: Province[] = await response.json();
    return provinces;
  } catch (error) {
    console.error('Error loading provinces:', error);
    return [];
  }
};

/**
 * بازیابی همه شهرهای یک استان خاص
 */
export const getCitiesByProvinceId = async (provinceId: number): Promise<City[]> => {
  try {
    const response = await fetch('/data/json/cities.json');
    if (!response.ok) {
      throw new Error('خطا در دریافت لیست شهرها');
    }
    const allCities: City[] = await response.json();
    return allCities.filter(city => city.province_id === provinceId);
  } catch (error) {
    console.error('Error loading cities:', error);
    return [];
  }
}; 