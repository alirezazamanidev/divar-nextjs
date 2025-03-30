"use client";

import CheckOtpForm from "@/libs/forms/auth/CheckOtpForm";
import { useAuthStore } from "@/libs/store/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";


export default function VerifyPage() {
    const { phone } = useAuthStore();
    const router = useRouter();
   
    useEffect(() => {
      if (!phone) {
        router.replace("/login");
      }
    }, [phone, router]);
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            تایید شماره موبایل
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            لطفا کد تایید ارسال شده به شماره موبایل خود را وارد کنید
          </p>
        </div>

       <CheckOtpForm router={router} phone={phone ?? ""}/>
      </div>
    </div>
  );
}

