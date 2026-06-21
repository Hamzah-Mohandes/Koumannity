import type { AvatarType, TeamType } from './types';
import React, { useState } from 'react';

import ProfileSetup from './views/ProfileSetup';

function App() {
  const [user, setUser] = useState<{ username: string; avatar: AvatarType; team: TeamType } | null>(null);

  const handleProfileComplete = (username: string, avatar: AvatarType, team: TeamType) => {
    setUser({ username, avatar, team });
  };

  if (!user) {
    return <ProfileSetup onComplete={handleProfileComplete} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-yellow-500 mb-2">Welcome, {user.username}! 🎉</h1>
        <p className="text-gray-400">You belong to {user.team} now.</p>
      </div>
    </div>
  );
}

export default App;