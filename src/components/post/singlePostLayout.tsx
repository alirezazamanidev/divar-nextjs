'use client';
import { Post } from "@/libs/models/post";
import { Bookmark, Share2, X, MapPin, Calendar, Phone, MessageCircle, Copy } from "lucide-react";
import { formatDateNow, formatPrice } from "@/libs/utils/functions.util";
import { useState, useEffect, useCallback, useMemo } from "react";
import { Dialog, DialogPanel, Transition } from "@headlessui/react";
import Image from "next/image";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import { useRouter } from "next/navigation";


import StartConversation from "@/components/chat/StartConversation";
import { useAuth } from "@/libs/hooks/useAuth";
import { SocketProvider } from "@/libs/hooks/useSocket";

// تنظیمات اسلایدر
const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: true,
  rtl: true, // برای پشتیبانی از راست‌به‌چپ
};

// بارگذاری پویای نقشه
const MapComponent = dynamic(
  () => import("react-leaflet").then((mod) => ({
    default: ({ center, zoom, children }: { center: [number, number]; zoom: number; children: React.ReactNode }) => (
      <mod.MapContainer center={center} zoom={zoom} style={{ height: "100%", width: "100%" }} scrollWheelZoom={false}>
        {children}
      </mod.MapContainer>
    ),
  })),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full flex items-center justify-center bg-gray-800 rounded-lg border border-gray-700">
        <span className="text-gray-400">در حال بارگذاری نقشه...</span>
      </div>
    ),
  }
);

const DynamicTileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const DynamicMarker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false });
const DynamicPopup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false });

export function SinglePostLayout({ post }: { post: Post }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [showAllDetails, setShowAllDetails] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const {user,isLoading}=useAuth()

  // تنظیمات Leaflet برای رفع باگ آیکون‌ها
  useEffect(() => {
    if (typeof window !== "undefined" && !mapLoaded) {
      import('leaflet').then(L => {
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.3/images/marker-icon-2x.png",
          iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.3/images/marker-icon.png",
          shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.3/images/marker-shadow.png",
        });
        setMapLoaded(true);
      });
    }
  }, [mapLoaded]);

  const defaultLocation: [number, number] = [35.6892, 51.3890]; // مختصات تهران
  const mapLocation = useMemo(
    () => (post.location 
      ? [post.location.lat || defaultLocation[0], post.location.lng || defaultLocation[1]] as [number, number] 
      : defaultLocation),
    [post.location]
  );

 

  const isPriceRelated = useCallback((key: string) => {
    const priceKeywords = ["قیمت", "ودیعه", "اجاره", "رهن", "ماهانه", "تومان", "ریال", "هزینه"];
    return priceKeywords.some((keyword) => key.includes(keyword));
  }, []);

  const formatBooleanValue = useCallback((value: any) => {
    if (typeof value === "boolean") return value ? "دارد" : "ندارد";
    return value || "نامشخص";
  }, []);

  const pricePerMeter = useMemo(() => {
    if (!post.options) return null;
    const priceEntry = Object.entries(post.options).find(([key]) => key.includes("قیمت") && !key.includes("متر"));
    const areaEntry = Object.entries(post.options).find(([key]) => key.includes("متراژ"));
    if (priceEntry && areaEntry) {
      const price = Number(priceEntry[1]);
      const area = Number(areaEntry[1]);
      if (!isNaN(price) && !isNaN(area) && area > 0) return Math.round(price / area);
    }
    return null;
  }, [post.options]);

  const isVideo = (url: string) => url.endsWith(".mp4") || url.endsWith(".webm") || url.includes("youtube");

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  const navigateToChat = () => {
    router.push(`/chat?postId=${post.id}`);
  };

  // بررسی اینکه آیا کاربر صاحب آگهی است یا خیر
  const isPostOwner = useMemo(() => {
  

    return post.userId===user?.id
    
  }, [post.user,isLoading]);

  return (
    <div className="flex flex-col bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl shadow-2xl overflow-hidden w-full max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900/70 to-indigo-900/70 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white order-2 sm:order-1 mt-2 sm:mt-0">{post.title}</h1>
          <div className="flex items-center gap-2 sm:gap-3 order-1 sm:order-2 self-end sm:self-auto">
            <button aria-label="اشتراک‌گذاری" className="p-2 sm:p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200">
              <Share2 size={16} className="text-white sm:hidden" />
              <Share2 size={18} className="text-white hidden sm:block" />
            </button>
            <button aria-label="نشان کردن" className="p-2 sm:p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200">
              <Bookmark size={16} className="text-white sm:hidden" />
              <Bookmark size={18} className="text-white hidden sm:block" />
            </button>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2 sm:mt-3 text-gray-200 text-xs sm:text-sm">
          <div className="flex items-center gap-1 sm:gap-1.5">
            <MapPin size={14} className="text-purple-300 sm:hidden" />
            <MapPin size={16} className="text-purple-300 hidden sm:block" />
            <span>{post.province} - {post.city}</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-1.5">
            <Calendar size={14} className="text-purple-300 sm:hidden" />
            <Calendar size={16} className="text-purple-300 hidden sm:block" />
            <span>{formatDateNow(post.created_at)}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Left Section - Gallery */}
        <div className="w-full lg:w-3/5 p-4 sm:p-6">
          <div className="relative w-full h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px] bg-gray-800 rounded-xl overflow-hidden shadow-lg">
            {post.mediaFiles?.length > 0 ? (
              <>
                {isVideo(post.mediaFiles[0].url) ? (
                  <video
                    src={post.mediaFiles[0].url}
                    className="w-full h-full object-cover cursor-pointer"
                    onClick={() => setIsOpen(true)}
                  />
                ) : (
                  <Image
                    width={800}
                    height={600}
                    src={post.mediaFiles[0].url}
                    alt={post.title}
                    className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-500"
                    onClick={() => setIsOpen(true)}
                  />
                )}
                <div className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-purple-600/80 text-white text-xs font-medium px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full">
                  {post.mediaFiles.length} تصویر
                </div>
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-800">
                <span className="text-gray-400 text-sm sm:text-base">تصویری موجود نیست</span>
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {post.mediaFiles && post.mediaFiles.length > 1 && (
            <div className="flex gap-1.5 sm:gap-2 mt-2 sm:mt-3 overflow-x-auto scrollbar-hidden pb-2">
              {post.mediaFiles.map((media, index) => (
                <div
                  key={index}
                  onClick={() => setIsOpen(true)}
                  className={`w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 flex-shrink-0 cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                    index === 0 ? "border-purple-500" : "border-transparent hover:border-purple-500/70"
                  }`}
                >
                  {isVideo(media.url) ? (
                    <div className="relative w-full h-full bg-gray-700">
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white bg-opacity-80 flex items-center justify-center">
                          <div className="w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-l-[8px] border-l-purple-600 ml-0.5" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Image
                      width={100}
                      height={100}
                      src={media.url}
                      alt={`تصویر ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Description */}
          {post.description && (
            <div className="mt-6 sm:mt-8 bg-gray-800/50 p-3 sm:p-5 rounded-xl border border-gray-700/50">
              <h3 className="text-base sm:text-lg font-bold text-right mb-3 sm:mb-4 text-purple-300 flex items-center justify-end">
                <span>توضیحات</span>
                <div className="w-6 sm:w-8 h-1 bg-purple-500 rounded-full ml-2" />
              </h3>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed whitespace-pre-line text-right">{post.description}</p>
            </div>
          )}

          {/* Location */}
          {post.location && mapLoaded && (
            <div className="mt-4 sm:mt-6 bg-gray-800/50 p-3 sm:p-5 rounded-xl border border-gray-700/50">
              <h3 className="text-base sm:text-lg font-bold text-right mb-3 sm:mb-4 text-purple-300 flex items-center justify-end">
                <span>موقعیت مکانی</span>
                <div className="w-6 sm:w-8 h-1 bg-purple-500 rounded-full ml-2" />
              </h3>
              <div className="h-[150px] sm:h-[200px] bg-gray-700 rounded-lg overflow-hidden">
                <MapComponent center={mapLocation} zoom={13}>
                  <DynamicTileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <DynamicMarker position={mapLocation}>
                    <DynamicPopup>{post.province} - {post.city}</DynamicPopup>
                  </DynamicMarker>
                </MapComponent>
              </div>
            </div>
          )}
        </div>

        {/* Right Section - Details */}
        <div className="w-full lg:w-2/5 bg-gray-900/50 p-4 sm:p-6 border-t lg:border-t-0 lg:border-r border-gray-800">
       
          {/* Price Section */}
          {post.options && (
            <div className="mb-4 sm:mb-6">
              {Object.entries(post.options)
                .filter(([key]) => isPriceRelated(key))
                .map(([key, value]) => (
                  <div key={key} className="mb-2 sm:mb-3 bg-gradient-to-r from-purple-900/40 to-indigo-900/40 rounded-xl px-3 sm:px-5 py-3 sm:py-4 border border-purple-800/30">
                    <div className="flex justify-between items-center">
                      <span className="text-purple-300 font-bold text-base sm:text-xl">{formatPrice(value)} تومان</span>
                      <span className="text-gray-400 text-xs sm:text-sm">{key}</span>
                    </div>
                  </div>
                ))}
              {pricePerMeter && (
                <div className="mb-2 sm:mb-3 bg-gradient-to-r from-purple-900/40 to-indigo-900/40 rounded-xl px-3 sm:px-5 py-3 sm:py-4 border border-purple-800/30">
                  <div className="flex justify-between items-center">
                    <span className="text-purple-300 font-bold text-base sm:text-xl">{formatPrice(pricePerMeter)} تومان</span>
                    <span className="text-gray-400 text-xs sm:text-sm">قیمت هر متر مربع</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Contact Buttons */}
          <div className="flex flex-col gap-2 sm:gap-3 mb-5 sm:mb-8">
            <div className="flex gap-2 sm:gap-3">
              <button
                onClick={() => setShowContact(!showContact)}
                className="flex-1 py-2.5 sm:py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-colors duration-300 font-medium shadow-lg shadow-purple-900/30 flex items-center justify-center gap-1 sm:gap-2 text-sm sm:text-base"
                aria-label="نمایش اطلاعات تماس"
              >
                <Phone size={16} className="sm:hidden" />
                <Phone size={18} className="hidden sm:block" />
                <span>اطلاعات تماس</span>
              </button>
              {post.allowChatMessages && !isPostOwner && (
                <button
                  onClick={navigateToChat}
                  className="flex-1 py-2.5 sm:py-3 bg-gray-800 border border-gray-700 rounded-xl hover:bg-gray-700 transition-colors duration-300 font-medium flex items-center justify-center gap-1 sm:gap-2 text-sm sm:text-base"
                  aria-label="ارسال پیام چت"
                >
                  <MessageCircle size={16} className="sm:hidden" />
                  <MessageCircle size={18} className="hidden sm:block" />
                  <span>چت</span>
                </button>
              )}
            </div>
          </div>
          
          {/* Contact Info */}
          {showContact && (
            <div className="mb-4 sm:mb-6 bg-gradient-to-r from-purple-900/20 to-indigo-900/20 rounded-xl p-3 sm:p-4 border border-purple-800/30 animate-fadeIn">
              <h3 className="text-base sm:text-lg font-bold text-right mb-2 sm:mb-3 text-purple-300">اطلاعات تماس</h3>
              <div className="flex justify-between items-center p-2 bg-gray-800/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-white text-sm sm:text-base">{post.user?.phone || "09*********"}</span>
               
                </div>
                <button 
                    onClick={() => copyToClipboard(post.user?.phone || "")}
                    className="p-1.5 rounded-md bg-purple-600/70 hover:bg-purple-600 transition-colors duration-200 relative"
                    aria-label="کپی شماره تماس"
                  >
                    <Copy size={16} className="text-white" />
                    {copySuccess && (
                      <span className="absolute -top-8 right-0 text-xs bg-green-600 text-white px-2 py-1 rounded-md whitespace-nowrap">
                        کپی شد!
                      </span>
                    )}
                  </button>
              </div>
            </div>
          )}

          {/* Post Options */}
          {post.options && (
            <div className="mb-4 sm:mb-6">
              <h3 className="text-base sm:text-lg font-bold text-right mb-3 sm:mb-4 text-purple-300 flex items-center justify-end">
                <span>ویژگی‌ها</span>
                <div className="w-6 sm:w-8 h-1 bg-purple-500 rounded-full ml-2" />
              </h3>
              <div className="grid grid-cols-1 gap-2 sm:gap-3 text-right">
                {Object.entries(post.options)
                  .filter(([key]) => !isPriceRelated(key))
                  .slice(0, showAllDetails ? undefined : 6)
                  .map(([key, value]) => {
                    const formattedValue = formatBooleanValue(value);
                    const isBooleanValue = typeof value === "boolean";
                    const bgColorClass = isBooleanValue
                      ? value
                        ? "bg-green-900/30 border-green-800/30"
                        : "bg-red-900/30 border-red-800/30"
                      : "bg-gray-800/30 border-gray-700/30";
                    const textColorClass = isBooleanValue ? (value ? "text-green-400" : "text-red-400") : "text-gray-200";
                    return (
                      <div
                        key={key}
                        className={`flex justify-between items-center ${bgColorClass} rounded-xl px-3 sm:px-4 py-2 sm:py-3 border hover:border-purple-700/50 transition-all duration-200`}
                      >
                        <span className={`${textColorClass} font-medium text-sm sm:text-base`}>{formattedValue}</span>
                        <span className="text-gray-400 text-xs sm:text-sm">{key}</span>
                      </div>
                    );
                  })}
              </div>
              {Object.entries(post.options).filter(([key]) => !isPriceRelated(key)).length > 6 && (
                <button
                  onClick={() => setShowAllDetails(!showAllDetails)}
                  className="mt-3 sm:mt-4 w-full py-2 sm:py-2.5 text-purple-400 bg-gray-800/30 border border-gray-700/30 rounded-xl hover:bg-gray-800/50 transition-all duration-200 flex items-center justify-center gap-1 text-xs sm:text-sm"
                  aria-label={showAllDetails ? "نمایش موارد کمتر" : "نمایش همه جزئیات"}
                >
                  <span>{showAllDetails ? "نمایش موارد کمتر" : "نمایش همه جزئیات"}</span>
                </button>
              )}
            </div>
          )}

          {/* Category */}
          <div className="mt-5 sm:mt-8">
            <div className="flex justify-between items-center mb-2 sm:mb-3 p-2 sm:p-3 bg-gray-800/30 rounded-xl border border-gray-700/30">
              <span className="text-purple-300 font-medium text-sm sm:text-base">{post.category?.title || "دسته‌بندی نشده"}</span>
              <span className="text-gray-400 text-xs sm:text-sm">دسته‌بندی</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal with Slider */}
      <Transition appear show={isOpen} as="div">
        <Dialog as="div" className="relative z-50" onClose={() => setIsOpen(false)}>
          <Transition
          show={isOpen}
            as="div"
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-95" />
          </Transition>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-2 sm:p-4 text-center">
              <Transition
              show={isOpen}
                as="div"
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <DialogPanel className="w-full max-w-3xl sm:max-w-4xl lg:max-w-5xl transform overflow-hidden rounded-xl sm:rounded-2xl bg-black bg-opacity-70 p-3 sm:p-6 text-left align-middle shadow-xl transition-all">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-2 left-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 p-2 text-white transition-all duration-200"
                    aria-label="بستن مودال"
                  >
                    <X size={24} />
                  </button>
                  {post.mediaFiles && post.mediaFiles.length > 0 && (
                    <Slider {...sliderSettings} className="h-[50vh] sm:h-[60vh] md:h-[70vh]">
                      {post.mediaFiles.map((media, index) => (
                        <div key={index} className="flex justify-center items-center h-full">
                          {isVideo(media.url) ? (
                            <video
                              src={media.url}
                              controls
                              autoPlay
                              className="max-w-full max-h-[50vh] sm:max-h-[60vh] md:max-h-[70vh] object-contain"
                            />
                          ) : (
                            <Image
                              width={1200}
                              height={800}
                              src={media.url}
                              alt={`تصویر ${index + 1}`}
                              className="max-w-full max-h-[50vh] sm:max-h-[60vh] md:max-h-[70vh] object-contain"
                            />
                          )}
                        </div>
                      ))}
                    </Slider>
                  )}
                </DialogPanel>
              </Transition>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}