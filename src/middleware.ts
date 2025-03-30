import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// تنظیمات مسیرها
const PATHS = {
  PUBLIC: ["/login", "/verify", "/"],
  PROTECTED: ["/dashboard", "/profile", "/settings",'/new'],
  LOGIN: ["/login", "/verify"],
  DASHBOARD: "/dashboard",
};

// تابع کمکی برای چک کردن توکن با درخواست به سرور
const verifyToken = async (token: string | undefined): Promise<boolean> => {
  if (!token) return false;

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/check-login`, {
      method: "GET",
      headers: {
       'Cookie':`access_token=${token}`
      },
      credentials: "include", 
    });
    

    return response.ok; // اگه وضعیت 200 باشه یعنی توکن معتبره
  } catch (error) {
    console.error("Error verifying token:", error);
    return false;
  }
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // گرفتن توکن از کوکی‌ها
  const authToken = request.cookies.get("access_token")?.value;

  // چک کردن وضعیت احراز هویت با درخواست به سرور
  const isAuthenticated = await verifyToken(authToken);

  
  // بررسی مسیرهای محافظت‌شده
  const isProtectedRoute = PATHS.PROTECTED.some((path) =>
    pathname === path || pathname.startsWith(path + "/")
  );

  // بررسی مسیرهای لاگین
  const isLoginRoute = PATHS.LOGIN.some((path) =>
    pathname === path || pathname.startsWith(path + "/")
  );

  // اگر کاربر لاگین نکرده و قصد دسترسی به مسیر محافظت‌شده را دارد
  if (!isAuthenticated && isProtectedRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // اگر کاربر لاگین کرده و قصد دسترسی به صفحه لاگین را دارد
  if (isAuthenticated && isLoginRoute) {
    return NextResponse.redirect(new URL(PATHS.DASHBOARD, request.url));
  }

  // در غیر این صورت، درخواست را بدون تغییر عبور می‌دهیم
  return NextResponse.next();
}
// تنظیمات config ساده‌تر برای تست
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"], // بدون public برای تست
};