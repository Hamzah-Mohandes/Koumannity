import type { AvatarType, TeamType } from './types';
import React, { useState } from 'react';

import ProfileSetup from './views/ProfileSetup';
import Timeline from './views/Timeline';

function App() {
  const [user, setUser] = useState<{ username: string; avatar: AvatarType; team: TeamType } | null>(null);

  const handleProfileComplete = (username: string, avatar: AvatarType, team: TeamType) => {
    setUser({ username, avatar, team });
  };

  // اگر هنوز یوزر مشخص نشده، فرم پروفایل رو نشون بده
  if (!user) {
    return <ProfileSetup onComplete={handleProfileComplete} />;
  }

  // اگر لاگین موقت موفق بود، کل تایم‌لاین لایو رو لود کن
  return <Timeline user={user} />;
}

export default App;