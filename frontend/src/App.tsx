import type { AvatarType, TeamType } from "./types";
// ۱. این خط رو در بالای فایل تغییر بده (BrowserRouter حذف و HashRouter اضافه شد)
import { Link, Route, HashRouter as Router, Routes } from "react-router-dom";

import AdminPanel from "./views/AdminPanel";
import ProfileSetup from "./views/ProfileSetup";
import Timeline from "./views/Timeline";
import { useState } from "react";

function App() {
  const [userSession, setUserSession] = useState<{
    username: string;
    avatar: AvatarType;
    team: TeamType;
  } | null>(null);

  const [isAdmin, setIsAdmin] = useState(false);

  if (isAdmin) {
    return (
      <div className="min-h-screen matrix-wave-bg text-neutral-100 font-sans antialiased p-6">
        <AdminPanel />
      </div>
    );
  }

  if (!userSession) {
    return (
      <div className="min-h-screen matrix-wave-bg flex items-center justify-center font-sans antialiased p-4">
        <ProfileSetup
          onComplete={(data) => {
            if (data.username === "admin_matrix") {
              setIsAdmin(true);
            } else {
              setUserSession(data);
            }
          }}
        />
      </div>
    );
  }

  return (
    // ۲. تگ Router اینجا بدون تغییر می‌مونه چون اسمش رو بالا عوض کردیم
    <Router>
      <div className="min-h-screen matrix-wave-bg text-neutral-100 font-sans antialiased">
        {/* Navigation Bar */}
        <nav className="bg-[#1a1a1e]/80 backdrop-blur-xl border-b border-neutral-800 sticky top-0 z-50 shadow-lg">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <Link to="/" className="text-2xl md:text-3xl font-extrabold tracking-tight text-white hover:opacity-90 transition-opacity">
              Koumannity
            </Link>

            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold text-neutral-300">
                Timeline
              </span>
              <div className="flex items-center gap-2 bg-[#26262b]/90 border border-neutral-700 px-3 py-1.5 rounded-full text-xs font-bold text-neutral-200 shadow-md">
                <span>👤 {userSession.username}</span>
                <span className="opacity-60 uppercase">({userSession.team})</span>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Interface Wrapper */}
        <main className="max-w-7xl mx-auto px-4 md:px-6 py-10">
          <Routes>
            <Route path="/" element={<Timeline currentUser={userSession} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;