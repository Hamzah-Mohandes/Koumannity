import type { AvatarType, TeamType } from './types';
import React, { useState } from 'react';

import AdminPanel from './views/AdminPanel';
import ProfileSetup from './views/ProfileSetup';
import Timeline from './views/Timeline';

function App() {
  const [user, setUser] = useState<{ username: string; avatar: AvatarType; team: TeamType } | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  // تابع بررسی رمز ورود به پنل ادمین
  const handleAdminAccess = () => {
    const password = prompt('ENTER MATRIX OVERLORD KEY | رمز عبور ادمین را وارد کنید:');
    // رمز عبور را اینجا می‌توانید تغییر دهید (مثلاً گذاشتیم: admin123)
    if (password === 'admin123') {
      setIsAdmin(true);
    } else {
      alert('ACCESS DENIED | دسترسی رد شد!');
    }
  };

  const handleProfileComplete = (profileData: { username: string; avatar: AvatarType; team: TeamType }) => {
    setUser(profileData);
  };

  // اگر رمز ادمین درست بود، پنل ادمین را نشان بده
  if (isAdmin) {
    return (
      <div className="relative">
        {/* دکمه بازگشت از پنل ادمین به تایم‌لاین */}
        <button
          onClick={() => setIsAdmin(false)}
          className="fixed bottom-4 right-4 z-50 bg-white text-black font-black text-xs px-4 py-2 rounded-xl shadow-xl hover:bg-neutral-200 cursor-pointer"
        >
          ⬅️ Exit Admin | خروج از ادمین
        </button>
        <AdminPanel />
      </div>
    );
  }

  // اگر هنوز یوزر مشخص نشده، فرم پروفایل رو نشون بده
  if (!user) {
    return (
      <div className="relative min-h-screen bg-[#0d0e12]">
        <ProfileSetup onComplete={handleProfileComplete} />
        {/* دکمه مخفی ادمین در گوشه پایین سمت چپ */}
        <button
          onClick={handleAdminAccess}
          className="absolute bottom-4 left-4 text-[10px] text-neutral-800 hover:text-red-800 font-mono transition cursor-pointer"
        >
          [matrix_core]
        </button>
      </div>
    );
  }

  // اگر لاگین موفق بود، کل تایم‌لاین لایو رو لود کن
  return (
    <div className="relative">
      <Timeline user={user} />
      {/* دکمه مخفی ادمین در صفحه تایم‌لاین */}
      <button
        onClick={handleAdminAccess}
        className="fixed bottom-4 left-4 z-50 text-[10px] text-neutral-800 hover:text-red-800 font-mono transition cursor-pointer"
      >
        [matrix_core]
      </button>
    </div>
  );
}

export default App;