'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Phone number:', phoneNumber);
  };

  return (
    <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
      <div className="w-full max-w-md bg-zinc-800 rounded-2xl p-8 shadow-xl border border-zinc-700">
        <h1 className="text-center text-2xl font-bold text-white mb-8">
          ورود به حساب کاربری
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full bg-zinc-700 border border-zinc-600 rounded-lg py-4 px-4 text-left text-white placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
              placeholder="شمارۀ موبایل"
              dir="ltr"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-red-500 text-white py-4 rounded-lg font-medium hover:bg-red-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-zinc-800"
          >
            ورود
          </button>
        </form>
      </div>
    </div>
  );
}
