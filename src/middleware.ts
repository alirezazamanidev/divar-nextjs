import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const verifyToken = async (token: string | undefined) => {
  if (!token) return false;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/check-login`, {
      method: "GET",
      credentials: "include",
    });

    return res.ok;
  } catch (error) {
    console.error("Token verification failed:", error);
    return false;
  }
};

const refreshAccessToken = async (req: NextRequest) => {
  const refreshToken = req.cookies.get("refresh_token")?.value;
  if (!refreshToken) return false;

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });

    return response.ok;
  } catch (error) {
    console.error("Refresh token error:", error);
    return false;
  }
};

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const publicPaths = ["/login", "/register", "/"];
  if (publicPaths.includes(path)) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get("access_token")?.value;

  if (!accessToken) {
    const refreshSuccess = await refreshAccessToken(request);
    if (!refreshSuccess) {
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("access_token");
      response.cookies.delete("refresh_token");
      return response;
    }
    return NextResponse.next();
  }

  const isValid = await verifyToken(accessToken);
  if (isValid) {
    return NextResponse.next();
  }

  const refreshSuccess = await refreshAccessToken(request);
  if (!refreshSuccess) {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("access_token");
    response.cookies.delete("refresh_token");
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|public).*)"],
};