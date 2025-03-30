'use client'
import { useEffect, useState } from 'react';
import { Field, ErrorMessage, useFormikContext } from 'formik';
import { getAllProvinces, getCitiesByProvinceId } from '@/libs/services/locationService';
import { City, Province } from '@/libs/models/location';

interface LocationSelectorProps {
  provinceFieldName: string;
  cityFieldName: string;
  provinceRequired?: boolean;
  cityRequired?: boolean;
}

const LocationSelector = ({
  provinceFieldName,
  cityFieldName,
  provinceRequired = true,
  cityRequired = true
}: LocationSelectorProps) => {
  const { values, setFieldValue } = useFormikContext<any>();
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [availableCities, setAvailableCities] = useState<City[]>([]);
  const [isLoadingProvinces, setIsLoadingProvinces] = useState(true);
  const [isLoadingCities, setIsLoadingCities] = useState(false);
  const [selectedProvinceId, setSelectedProvinceId] = useState<number | null>(null);
  const [selectedCityId, setSelectedCityId] = useState<number | null>(null);

  // بارگذاری لیست استان‌ها هنگام اولین رندر
  useEffect(() => {
    const loadProvinces = async () => {
      setIsLoadingProvinces(true);
      try {
        const data = await getAllProvinces();
        setProvinces(data);
      } catch (error) {
        console.error('خطا در بارگذاری استان‌ها:', error);
      } finally {
        setIsLoadingProvinces(false);
      }
    };

    loadProvinces();
  }, []);

  // بارگذاری شهرهای استان انتخاب شده
  useEffect(() => {
    const loadCities = async () => {
      if (!selectedProvinceId) {
        setAvailableCities([]);
        setFieldValue(cityFieldName, '');
        return;
      }
      
      setIsLoadingCities(true);
      try {
        const cities = await getCitiesByProvinceId(selectedProvinceId);
        setAvailableCities(cities);
        
        // اگر شهری قبلاً انتخاب شده، بررسی می‌کنیم که آیا در استان جدید وجود دارد
        if (selectedCityId) {
          const cityExists = cities.some(city => city.id === selectedCityId);
          if (!cityExists) {
            setFieldValue(cityFieldName, '');
            setSelectedCityId(null);
          }
        }
      } catch (error) {
        console.error('خطا در بارگذاری شهرها:', error);
      } finally {
        setIsLoadingCities(false);
      }
    };

    loadCities();
  }, [selectedProvinceId, setFieldValue, cityFieldName, selectedCityId]);

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const provinceId = Number(e.target.value);
    setSelectedProvinceId(provinceId);
    
    if (provinceId) {
      const selectedProvince = provinces.find(p => p.id === provinceId);
      if (selectedProvince) {
        setFieldValue(provinceFieldName, selectedProvince.name);
      }
    } else {
      setFieldValue(provinceFieldName, '');
    }
    
    // Reset city when province changes
    setFieldValue(cityFieldName, '');
    setSelectedCityId(null);
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cityId = Number(e.target.value);
    setSelectedCityId(cityId);
    
    if (cityId) {
      const selectedCity = availableCities.find(c => c.id === cityId);
      if (selectedCity) {
        setFieldValue(cityFieldName, selectedCity.name);
      }
    } else {
      setFieldValue(cityFieldName, '');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Province Select */}
      <div className="mb-4">
        <label className="block text-gray-200 text-sm font-medium mb-2 text-right" htmlFor={provinceFieldName}>
          استان{provinceRequired && <span className="text-red-500 mr-1">*</span>}
        </label>
        <div className="relative">
          <select
            id={`${provinceFieldName}_selector`}
            disabled={isLoadingProvinces}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none transition-all duration-200"
            onChange={handleProvinceChange}
            value={selectedProvinceId || ''}
          >
            <option value="">انتخاب استان</option>
            {provinces.map(province => (
              <option key={province.id} value={province.id}>
                {province.name}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-3 text-gray-400">
            {isLoadingProvinces ? (
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            )}
          </div>
        </div>
        {/* Hidden field to store the actual province name */}
        <Field type="hidden" name={provinceFieldName} />
        <ErrorMessage name={provinceFieldName} component="div" className="text-red-500 text-sm mt-1 text-right" />
      </div>

      {/* City Select */}
      <div className="mb-4">
        <label className="block text-gray-200 text-sm font-medium mb-2 text-right" htmlFor={cityFieldName}>
          شهر{cityRequired && <span className="text-red-500 mr-1">*</span>}
        </label>
        <div className="relative">
          <select
            id={`${cityFieldName}_selector`}
            disabled={isLoadingCities || availableCities.length === 0}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none transition-all duration-200"
            onChange={handleCityChange}
            value={selectedCityId || ''}
          >
            <option value="">انتخاب شهر</option>
            {availableCities.map(city => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-3 text-gray-400">
            {isLoadingCities ? (
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            )}
          </div>
        </div>
        {/* Hidden field to store the actual city name */}
        <Field type="hidden" name={cityFieldName} />
        <ErrorMessage name={cityFieldName} component="div" className="text-red-500 text-sm mt-1 text-right" />
      </div>
    </div>
  );
};

export default LocationSelector;