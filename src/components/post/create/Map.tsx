'use client';

import { useRef, useState, useEffect } from 'react';
import { MapContainer, Marker, TileLayer, useMapEvents, useMap } from 'react-leaflet';
import { useFormikContext } from 'formik';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// تنظیم آیکون پیش‌فرض برای مارکر
const defaultIcon = L.icon({
  iconUrl: '/images/marker-icon.png',
  shadowUrl: '/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// کامپوننت اصلی برای مدیریت نقشه و مارکر
function MapController({ locationQuery }: { locationQuery: string }) {
  const map = useMap();
  const { setFieldValue, values } = useFormikContext<any>();
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  // تابع برای تبدیل نام مکان به مختصات جغرافیایی
  const geocodeLocation = async (
    locationQuery: string,
  ): Promise<[number, number] | null> => {
    if (!locationQuery) return null;

    try {
      // استفاده از Nominatim OpenStreetMap برای جستجوی مختصات
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          locationQuery,
        )}`,
      );
      const data = await response.json();

      if (data && data.length > 0) {
        return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
      }
      return null;
    } catch (error) {
      console.error('خطا در دریافت مختصات:', error);
      return null;
    }
  };

  // وقتی locationQuery تغییر می‌کند، مختصات جدید را پیدا کرده و مارکر را تنظیم می‌کند
  useEffect(() => {
    if (!locationQuery) return;

    const findLocation = async () => {
      setIsSearching(true);
      const coordinates = await geocodeLocation(locationQuery);
      
      if (coordinates) {
        // تنظیم موقعیت مارکر و تغییر دید نقشه
        setPosition(coordinates);
        map.setView(coordinates, 12);
        
        // ذخیره مختصات در فرم
        setFieldValue('location', { lat: coordinates[0], lng: coordinates[1] });
      }
      setIsSearching(false);
    };

    findLocation();
  }, [locationQuery, map, setFieldValue]);

  // رویداد کلیک روی نقشه
  useMapEvents({
    click: (e) => {
      if (isSearching) return; // در حین جستجو، کلیک‌ها را نادیده بگیر
      
      const { lat, lng } = e.latlng;
      // تنظیم موقعیت مارکر
      setPosition([lat, lng]);
      // ذخیره مختصات در فرم
      setFieldValue('location', { lat, lng });
    },
  });

  // نمایش مارکر در موقعیت انتخاب شده
  return position ? <Marker position={position} icon={defaultIcon} /> : null;
}

interface MapLayoutProps {
  locationQuery?: string;
}

export default function MapLayout({ locationQuery = '' }: MapLayoutProps) {
  const { values } = useFormikContext<any>();
  const mapRef = useRef(null);

  const [initialPosition] = useState<[number, number]>([
    35.699739, 51.338097,
  ]);

  return (
    <div className="flex flex-col gap-4">
      <div className="h-96 rounded-lg overflow-hidden transition-all duration-500 border border-gray-700">
        <MapContainer
          center={initialPosition}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapController locationQuery={locationQuery} />
        </MapContainer>
      </div>

      {values.location && (
        <p className="text-sm text-gray-400">
          موقعیت انتخابی: {values.location.lat.toFixed(6)},{' '}
          {values.location.lng.toFixed(6)}
        </p>
      )}
    </div>
  );
}
