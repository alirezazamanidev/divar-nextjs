import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import {
  UnauthorizedException,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  ValidationException,
  InternalServerException,
} from "../exceptions";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

const axiosInstance: AxiosInstance = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true // Enable sending cookies with requests
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

   
    // اگر خطای 401 بود و قبلاً تلاش برای رفرش نشده بود و روت مربوط به auth نباشد
    if (
      error.response?.status === 401 && 
      !originalRequest._retry && 
      originalRequest.url?.includes('/auth/check-login')
    ) {
      originalRequest._retry = true;
      try {
        console.log("refresh");

        const response = await axios.get(`${baseURL}/auth/refresh`, {
          withCredentials: true,
        });

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        throw new UnauthorizedException(
         refreshError instanceof Error ? refreshError.message : "خطایی رخ داده است"
        );
      }
    }

    // تبدیل خطاهای HTTP به اکسپشن‌های سفارشی
    if (error.response) {
      const { status, data } = error.response;
      const errorMessage =
        (data as { message?: string })?.message || "خطایی رخ داده است";

      switch (status) {
        case 400:
          throw new BadRequestException(errorMessage);
        case 401:
          throw new UnauthorizedException(errorMessage);
        case 403:
          throw new ForbiddenException(errorMessage);
        case 404:
          throw new NotFoundException(errorMessage);
        case 422:
          throw new ValidationException(errorMessage);
        default:
          throw new InternalServerException(errorMessage);
      }
    }

    throw new InternalServerException("خطا در برقراری ارتباط با سرور");
  }
);
export const callApi=axiosInstance;