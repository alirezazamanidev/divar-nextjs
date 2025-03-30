'use client';
import React, { useState, useEffect } from 'react';
import { Field, ErrorMessage, useFormikContext } from 'formik';
import {
  getAllProvinces,
  getCitiesByProvinceId,
} from '@/libs/services/locationService';
import { City, Province } from '@/libs/models/location';
import dynamic from 'next/dynamic';

import 'leaflet/dist/leaflet.css';

// بارگذاری پویای کامپوننت نقشه تا فقط در سمت کلاینت اجرا شود
const MapLayout = dynamic(() => import('./Map'), {
  ssr: false,
  loading: () => (
    <div className="h-60 sm:h-80 md:h-96 flex items-center justify-center bg-gray-800 rounded-lg border border-gray-700">
      <div className="flex flex-col items-center text-gray-400">
        <svg
          className="animate-spin h-10 w-10 mb-3 text-blue-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <span>در حال بارگذاری نقشه...</span>
      </div>
    </div>
  ),
});

const LocationSelector = () => {
  const { values, setFieldValue } = useFormikContext<any>();
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [selectedProvinceId, setSelectedProvinceId] = useState<number | null>(
    null,
  );
  const [locationQuery, setLocationQuery] = useState<string>('');

  const [loading, setLoading] = useState({
    provinces: false,
    cities: false,
  });

  // بارگذاری استان‌ها هنگام اولین رندر
  useEffect(() => {
    const fetchProvinces = async () => {
      setLoading((prev) => ({ ...prev, provinces: true }));
      try {
        const data = await getAllProvinces();
        setProvinces(data);
      } catch (error) {
        console.error('خطا در بارگذاری استان‌ها:', error);
      } finally {
        setLoading((prev) => ({ ...prev, provinces: false }));
      }
    };

    fetchProvinces();
  }, []);

  // بارگذاری شهرها هنگام تغییر استان
  useEffect(() => {
    const fetchCities = async () => {
      if (!selectedProvinceId) {
        setCities([]);
        return;
      }

      setLoading((prev) => ({ ...prev, cities: true }));
      try {
        const data = await getCitiesByProvinceId(selectedProvinceId);
        setCities(data);

        // پاک کردن مقدار شهر هنگام تغییر استان
        setFieldValue('city', '');
      } catch (error) {
        console.error('خطا در بارگذاری شهرها:', error);
      } finally {
        setLoading((prev) => ({ ...prev, cities: false }));
      }
    };

    fetchCities();
  }, [selectedProvinceId, setFieldValue]);

  // هندلر انتخاب استان
  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const provinceId = e.target.value;

    if (provinceId) {
      const id = parseInt(provinceId);
      const selectedProvince = provinces.find((province) => province.id === id);

      if (selectedProvince) {
        // ذخیره نام استان در فرم
        setFieldValue('province', selectedProvince.name);
        // بروزرسانی ID استان برای فیلتر کردن شهرها
        setSelectedProvinceId(id);

        // تنظیم موقعیت نقشه بر اساس نام استان
        setLocationQuery(`${selectedProvince.name}, ایران`);
      }
    } else {
      setFieldValue('province', '');
      setSelectedProvinceId(null);
      setLocationQuery('');
    }
  };

  // هندلر انتخاب شهر
  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cityId = e.target.value;

    if (cityId) {
      const id = parseInt(cityId);
      const selectedCity = cities.find((city) => city.id === id);

      if (selectedCity) {
        // ذخیره نام شهر در فرم
        setFieldValue('city', selectedCity.name);

        // تنظیم موقعیت نقشه بر اساس نام شهر و استان برای دقت بیشتر
        if (values.province) {
          setLocationQuery(`${selectedCity.name}, ${values.province}, ایران`);
        } else {
          setLocationQuery(`${selectedCity.name}, ایران`);
        }
      }
    } else {
      setFieldValue('city', '');
      // اگر استان انتخاب شده، نقشه را به استان برگردان
      if (values.province) {
        setLocationQuery(`${values.province}, ایران`);
      } else {
        setLocationQuery('');
      }
    }
  };

  return (
    <div className="mb-8 border rounded-lg bg-gray-900 p-4 sm:p-6">
      <h3 className="text-lg font-medium mb-4 text-right text-gray-300">
        موقعیت مکانی
      </h3>

      {/* انتخاب استان و شهر */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* انتخاب استان */}
        <div className="mb-4">
          <label className="block text-gray-200 text-sm font-medium mb-2 text-right">
            استان <span className="text-red-500 mr-1">*</span>
          </label>
          <div className="relative">
            <select
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none transition-all duration-200"
              onChange={handleProvinceChange}
              disabled={loading.provinces}
              value={selectedProvinceId || ''}
            >
              <option value="">انتخاب استان</option>
              {provinces.map((province) => (
                <option key={province.id} value={province.id}>
                  {province.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-3 text-gray-400">
              {loading.provinces ? (
                <svg
                  className="animate-spin h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              )}
            </div>
          </div>
          <ErrorMessage
            name="province"
            component="div"
            className="text-red-500 text-sm mt-1 text-right"
          />
        </div>

        {/* انتخاب شهر */}
        <div className="mb-4">
          <label className="block text-gray-200 text-sm font-medium mb-2 text-right">
            شهر <span className="text-red-500 mr-1">*</span>
          </label>
          <div className="relative">
            <select
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none transition-all duration-200"
              onChange={handleCityChange}
              disabled={loading.cities || !selectedProvinceId}
              value={
                values.city
                  ? cities.find((c) => c.name === values.city)?.id || ''
                  : ''
              }
            >
              <option value="">انتخاب شهر</option>
              {cities.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-3 text-gray-400">
              {loading.cities ? (
                <svg
                  className="animate-spin h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              )}
            </div>
          </div>
          <ErrorMessage
            name="city"
            component="div"
            className="text-red-500 text-sm mt-1 text-right"
          />
        </div>
      </div>
    
        <MapLayout locationQuery={locationQuery} />
      
    </div>
  );
};

export default LocationSelector;
