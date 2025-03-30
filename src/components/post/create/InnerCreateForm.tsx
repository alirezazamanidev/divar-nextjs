'use client';
import { Category } from '@/libs/models/category';
import { ErrorMessage, Field, Form, FormikProps } from 'formik';
import { FormField } from '@/libs/models/formFiled';
import { useState, useEffect } from 'react';
import {
  XMarkIcon,
  PhotoIcon,
  VideoCameraIcon,
} from '@heroicons/react/24/outline';
import FormFileds from './FormFileds';
import LocationSelector from './LocationSelector';
import Image from 'next/image';

type props = FormikProps<any> & {
  category: Category;
};

export default function InnerCreatePostForm({
  category,
  values,
  setFieldValue,
  errors,
  touched,
  isSubmitting,
}: props) {
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [previewVideos, setPreviewVideos] = useState<string[]>([]);

  // Initialize previews from existing values when component mounts
  useEffect(() => {
    if (values.images && values.images.length > 0) {
      const existingPreviews = values.images
        .filter((file: File) => file instanceof File)
        .map((file: File) => URL.createObjectURL(file));

      if (existingPreviews.length > 0) {
        setPreviewImages(existingPreviews);
      }
    }

    if (values.videos && values.videos.length > 0) {
      const existingPreviews = values.videos
        .filter((file: File) => file instanceof File)
        .map((file: File) => URL.createObjectURL(file));

      if (existingPreviews.length > 0) {
        setPreviewVideos(existingPreviews);
      }
    }

    // Cleanup function to revoke object URLs
    return () => {
      previewImages.forEach((url) => URL.revokeObjectURL(url));
      previewVideos.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: string,
    type: 'image' | 'video',
  ) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);

      // Limit the number of files
      const maxFiles = type === 'image' ? 10 : 1;
      const currentFiles = values[fieldName] || [];
      const totalFiles = [...currentFiles, ...files];

      if (totalFiles.length > maxFiles) {
        alert(
          `شما می‌توانید حداکثر ${maxFiles} ${
            type === 'image' ? 'تصویر' : 'ویدیو'
          } آپلود کنید`,
        );
        return;
      }

      setFieldValue(fieldName, [...currentFiles, ...files]);

      // Create previews
      files.forEach((file) => {
        const objectUrl = URL.createObjectURL(file);
        if (type === 'image') {
          setPreviewImages((prev) => [...prev, objectUrl]);
        } else {
          setPreviewVideos((prev) => [...prev, objectUrl]);
        }
      });
    }
  };

  const removeFile = (
    index: number,
    fieldName: string,
    type: 'image' | 'video',
  ) => {
    const updatedFiles = [...values[fieldName]];
    updatedFiles.splice(index, 1);
    setFieldValue(fieldName, updatedFiles);

    if (type === 'image') {
      const updatedPreviews = [...previewImages];
      URL.revokeObjectURL(updatedPreviews[index]);
      updatedPreviews.splice(index, 1);
      setPreviewImages(updatedPreviews);
    } else {
      const updatedPreviews = [...previewVideos];
      URL.revokeObjectURL(updatedPreviews[index]);
      updatedPreviews.splice(index, 1);
      setPreviewVideos(updatedPreviews);
    }
  };

  return (
    <Form className="w-full max-w-3xl mx-auto p-6 md:p-8 bg-gray-900 rounded-xl shadow-xl text-gray-100">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2 text-right">
          <span>ثبت آگهی در دسته </span>
          <span className="text-blue-400">{category.title}</span>
        </h2>
        <div className="h-1 w-20 bg-blue-500 rounded-full mr-auto"></div>
      </div>

      {/* 1. موقعیت مکانی - Location */}
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4 text-right text-gray-300">
          موقعیت مکانی
        </h3>
        <LocationSelector />
      </div>

      {/* 2. آپلود رسانه - Media Upload Section */}
      <div className="mb-8 border-t border-gray-800 pt-6">
        <h3 className="text-lg font-medium mb-4 text-right text-gray-300">
          رسانه‌ها
        </h3>

        {/* Images Upload */}
        <div className="mb-6">
          <label className="block text-gray-200 text-sm font-medium mb-2 text-right">
            تصاویر آگهی{' '}
            <span className="text-gray-400 text-xs">(حداکثر 10 تصویر)</span>
          </label>
          <div className="border-dashed border-2 border-gray-700 rounded-lg text-center hover:border-blue-500 transition-all duration-300 bg-gray-800/50 overflow-hidden group">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleFileChange(e, 'images', 'image')}
              className="hidden"
              id="imageUpload"
            />
            <label
              htmlFor="imageUpload"
              className="cursor-pointer block w-full h-full p-8 group-hover:bg-gray-800/80 transition-all duration-300"
            >
              <div className="flex flex-col items-center justify-center text-gray-400 transform group-hover:scale-105 transition-transform duration-300">
                <PhotoIcon className="w-16 h-16 mb-4 text-blue-500 group-hover:text-blue-400" />
                <span className="text-sm mb-2 font-medium">
                  برای آپلود تصاویر کلیک کنید یا فایل‌ها را اینجا رها کنید
                </span>
                <span className="text-xs text-gray-500 bg-gray-800/70 px-3 py-1 rounded-full">
                  فرمت‌های مجاز: JPG، PNG، WEBP
                </span>
              </div>
            </label>
          </div>
          <ErrorMessage
            name="images"
            component="div"
            className="text-red-500 text-sm mt-1 text-right"
          />

          {/* Image previews */}
          {previewImages.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-4">
              {previewImages.map((src, index) => (
                <div
                  key={index}
                  className="relative group h-28 bg-gray-800 rounded-lg overflow-hidden border border-gray-700 shadow-md hover:shadow-lg transition-all duration-300 hover:border-blue-500"
                >
                  <Image
                  height={100}
                  width={100}
                    src={src}
                    alt={`Preview ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeFile(index, 'images', 'image')}
                    className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer transform hover:scale-110"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Videos Upload */}
        <div className="mb-6">
          <label className="block text-gray-200 text-sm font-medium mb-2 text-right">
            ویدیو{' '}
            <span className="text-gray-400 text-xs">(حداکثر 1 ویدیو)</span>
          </label>
          <div className="border-dashed border-2 border-gray-700 rounded-lg text-center hover:border-blue-500 transition-all duration-300 bg-gray-800/50 overflow-hidden group">
            <input
              type="file"
              accept="video/*"
              onChange={(e) => handleFileChange(e, 'videos', 'video')}
              className="hidden"
              id="videoUpload"
            />
            <label
              htmlFor="videoUpload"
              className="cursor-pointer block w-full h-full p-8 group-hover:bg-gray-800/80 transition-all duration-300"
            >
              <div className="flex flex-col items-center justify-center text-gray-400 transform group-hover:scale-105 transition-transform duration-300">
                <VideoCameraIcon className="w-16 h-16 mb-4 text-purple-500 group-hover:text-purple-400" />
                <span className="text-sm mb-2 font-medium">
                  برای آپلود ویدیو کلیک کنید یا فایل را اینجا رها کنید
                </span>
                <span className="text-xs text-gray-500 bg-gray-800/70 px-3 py-1 rounded-full">
                  فرمت‌های مجاز: MP4، WEBM (حداکثر 50MB)
                </span>
              </div>
            </label>
          </div>
          <ErrorMessage
            name="videos"
            component="div"
            className="text-red-500 text-sm mt-1 text-right"
          />

          {/* Video previews */}
          {previewVideos.length > 0 && (
            <div className="mt-4">
              {previewVideos.map((src, index) => (
                <div
                  key={index}
                  className="relative group bg-gray-800 rounded-lg overflow-hidden border border-gray-700 shadow-md hover:shadow-lg transition-all duration-300 hover:border-purple-500"
                >
                  <video
                    src={src}
                    controls
                    className="w-full h-auto max-h-[200px] cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={() => removeFile(index, 'videos', 'video')}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer transform hover:scale-110"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 3. فیلدهای اضافی - Dynamic Form Fields */}
      {category.formFields && category.formFields.length > 0 && (
        <div className="mb-8 border-t border-gray-800 pt-6">
          <h3 className="text-lg font-medium mb-4 text-right text-gray-300">
            اطلاعات تکمیلی
          </h3>
          <FormFileds fields={category.formFields} />
        </div>
      )}
      {/* 5. تنظیمات چت و پیام - Chat Settings */}
      <div className="mb-8 border-t border-gray-800 pt-6">
        <h3 className="text-lg font-medium mb-4 text-right text-gray-300">
          تنظیمات پیام و چت
        </h3>

        {/* Allow Chat Messages - Using Headless UI Checkbox */}
        <div className="mb-4 flex flex-row-reverse items-center justify-end">
          <label className="text-gray-200 text-sm font-medium cursor-pointer mr-3" htmlFor="allowChatMessages">
            دریافت پیام در چت را فعال کن
          </label>
          <div className="relative">
            <input
              type="checkbox"
              id="allowChatMessages"
              checked={values.allowChatMessages}
              onChange={(e) => setFieldValue('allowChatMessages', e.target.checked)}
              className="sr-only" // Hidden but accessible
            />
            <div 
              onClick={() => setFieldValue('allowChatMessages', !values.allowChatMessages)}
              className={`${
                values.allowChatMessages ? 'bg-blue-600 border-blue-600' : 'bg-gray-700 border-gray-600'
              } w-5 h-5 border rounded cursor-pointer transition-colors duration-200 flex items-center justify-center focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-900`}
              aria-hidden="true"
            >
              {values.allowChatMessages && (
                <svg 
                  className="w-3.5 h-3.5 text-white" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2.5" 
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* 4. عنوان و توضیحات - Title and Description */}
      <div className="mb-8 border-t border-gray-800 pt-6">
        <h3 className="text-lg font-medium mb-4 text-right text-gray-300">
          اطلاعات اصلی آگهی
        </h3>

        {/* Title */}
        <div className="mb-5">
          <label
            className="block text-gray-200 text-sm font-medium mb-2 text-right"
            htmlFor="title"
          >
            عنوان آگهی<span className="text-red-500 mr-1">*</span>
          </label>
          <Field
            type="text"
            name="title"
            id="title"
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            placeholder="عنوان آگهی خود را وارد کنید"
          />
          <ErrorMessage
            name="title"
            component="div"
            className="text-red-500 text-sm mt-1 text-right"
          />
        </div>

        {/* Description */}
        <div className="mb-6">
          <label
            className="block text-gray-200 text-sm font-medium mb-2 text-right"
            htmlFor="description"
          >
            توضیحات<span className="text-red-500 mr-1">*</span>
          </label>
          <Field
            as="textarea"
            name="description"
            id="description"
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 min-h-[150px]"
            placeholder="توضیحات کامل آگهی خود را بنویسید"
          />
          <ErrorMessage
            name="description"
            component="div"
            className="text-red-500 text-sm mt-1 text-right"
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="mt-8">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer transform hover:translate-y-[-2px] active:translate-y-[1px] shadow-lg hover:shadow-blue-500/30"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
              در حال ثبت...
            </span>
          ) : (
            'ثبت آگهی'
          )}
        </button>
      </div>
    </Form>
  );
}
