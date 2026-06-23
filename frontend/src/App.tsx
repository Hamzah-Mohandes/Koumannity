import type { AvatarType, TeamType } from "./types";
import { Link, Route, BrowserRouter as Router, Routes } from "react-router-dom";

import AdminPanel from "./views/AdminPanel";
import ProfileSetup from "./views/ProfileSetup"; // آدرس به پوشه views اصلاح شد
import Timeline from "./views/Timeline";
import { useState } from "react";

function App() {
  // ذخیره اطلاعات کاربر پس از تایید هویت اولیه
  const [userSession, setUserSession] = useState<{
    username: string;
    avatar: AvatarType;
    team: TeamType;
  } | null>(null);

  // اگر هنوز کاربر مشخصات خود را وارد نکرده، گیت ورودی را نشان بده
  if (!userSession) {
    return (
      <ProfileSetup
        onComplete={(data) => {
          setUserSession(data);
        }}
      />
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-[#121214] text-neutral-100 font-sans antialiased">
        {/* Navigation Bar */}
        <nav className="bg-[#1a1a1e] border-b border-neutral-800 sticky top-0 z-50 shadow-md">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="text-2xl md:text-3xl font-extrabold tracking-tight text-white hover:opacity-90 transition-opacity">
              Koumannity
            </Link>

            {/* نشان دادن اطلاعات اپراتور لاگین شده در هدر */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold text-neutral-300">
                Timeline
              </span>
              <div className="flex items-center gap-2 bg-[#26262b] border border-neutral-700 px-3 py-1.5 rounded-full text-xs font-bold text-neutral-200">
                <span>👤 {userSession.username}</span>
                <span className="opacity-60 uppercase">({userSession.team})</span>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Interface Wrapper */}
        <main className="max-w-7xl mx-auto px-4 md:px-6 py-10">
          <Routes>
            {/* پاس دادن اطلاعات کاربر فعال به تایم‌لاین */}
            <Route path="/" element={<Timeline currentUser={userSession} />} />
            {/* مسیر ادمین کاملاً مخفی است و فقط با زدن آدرس دستی /admin باز می‌شود */}
            <Route path="/admin" element={<AdminPanel />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;