'use client';

import { useRouter } from 'next/navigation';
import LoginForm from '@/libs/forms/auth/LoginForm';
import { useAuthStore } from '@/libs/store/auth';

export default function LoginPage() {
  const setPhone = useAuthStore((state) => state.setPhone);

  const router = useRouter();

  return (
    <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
      <div className="w-full max-w-md bg-zinc-800 rounded-2xl p-8 shadow-xl border border-zinc-700">
        <h1 className="text-center text-2xl font-bold text-white mb-8">
          ورود به حساب کاربری
        </h1>
        <LoginForm router={router} setPhone={setPhone} />
      </div>
    </div>
  );
}
