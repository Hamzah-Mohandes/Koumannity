import type { AvatarType, TeamType } from '../types';

import { useState } from 'react';

interface ProfileSetupProps {
    onComplete: (data: { username: string; avatar: AvatarType; team: TeamType }) => void;
}

export default function ProfileSetup({ onComplete }: ProfileSetupProps) {
    const [username, setUsername] = useState('');
    const [avatar, setAvatar] = useState<AvatarType>('kourosh_matrix');
    const [team, setTeam] = useState<TeamType>('kourosh');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!username.trim()) {
            setError('Username cannot be empty! | نام کاربری نمی‌تواند خالی باشد!');
            return;
        }
        if (username.length > 15) {
            setError('Max 15 characters allowed! | حداکثر ۱۵ کاراکتر مجاز است!');
            return;
        }

        // بک‌آپ برای هویت ادمین مخفی
        onComplete({ username: username.trim(), avatar, team });
    };

    return (
        <div className="min-h-screen bg-[#121214] text-white flex items-center justify-center p-4 md:p-8 font-sans antialiased select-none">
            <div className="max-w-md w-full bg-[#1a1a1e] border border-neutral-800/80 rounded-2xl p-6 md:p-8 shadow-2xl space-y-6">

                {/* هدر باکس تنظیمات */}
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-black tracking-wider bg-gradient-to-r from-amber-500 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                        INITIALIZE MATRIX
                    </h1>
                    <p className="text-xs text-neutral-400 font-bold uppercase tracking-tight">
                        Setup your identity in Koumannity
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* بخش نام کاربری */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                            👤 Username | نام کاربری
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => {
                                setUsername(e.target.value);
                                setError('');
                            }}
                            placeholder="e.g. Commando_007"
                            className="w-full bg-[#26262b] border border-neutral-700 focus:border-neutral-500 rounded-xl px-4 py-3 text-base focus:outline-none transition placeholder-neutral-600 text-neutral-200 font-medium"
                        />
                        {error && <p className="text-red-500 text-[11px] font-semibold">{error}</p>}
                    </div>

                    {/* بخش انتخاب آواتار */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                            🎭 Select Avatar | انتخاب آواتار
                        </label>
                        <div className="grid grid-cols-3 gap-2.5">
                            {(
                                [
                                    { id: 'kourosh_matrix', icon: '😎', label: 'Matrix' },
                                    { id: 'iman_serious', icon: '😐', label: 'Serious' },
                                    { id: 'mia_gamer', icon: '🎮', label: 'Gamer' },
                                ] as { id: AvatarType; icon: string; label: string }[]
                            ).map((av) => (
                                <button
                                    key={av.id}
                                    type="button"
                                    onClick={() => setAvatar(av.id)}
                                    className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all cursor-pointer bg-[#26262b] ${avatar === av.id
                                        ? 'border-neutral-400 bg-neutral-700/40 shadow-md'
                                        : 'border-neutral-800 hover:border-neutral-600'
                                        }`}
                                >
                                    <span className="text-2xl mb-1">{av.icon}</span>
                                    <span className="text-[10px] text-gray-400 font-bold">{av.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* بخش انتخاب فکشن / گروه */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                            🚩 Join Faction | انتخاب گروه
                        </label>
                        <div className="space-y-2">
                            {(
                                [
                                    { id: 'kourosh', icon: '👑', name: "KING'S COURT", fa: 'کوروش', color: 'border-amber-500 text-amber-500 bg-amber-500/5' },
                                    { id: 'iman', icon: '⚖️', name: 'JUDGMENT CALL', fa: 'ایمان آباد', color: 'border-blue-500 text-blue-500 bg-blue-500/5' },
                                    { id: 'mialand', icon: '🦄', name: 'FANTASY REALM', fa: 'میا لند', color: 'border-purple-500 text-purple-500 bg-purple-500/5' },
                                ] as { id: TeamType; icon: string; name: string; fa: string; color: string }[]
                            ).map((t) => (
                                <button
                                    key={t.id}
                                    type="button"
                                    onClick={() => setTeam(t.id)}
                                    className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition-all duration-200 text-left text-xs font-bold cursor-pointer bg-[#26262b] ${team === t.id
                                        ? `${t.color} border-2 shadow-md`
                                        : 'border-neutral-800 text-gray-400 hover:border-neutral-600 hover:text-white'
                                        }`}
                                >
                                    <div className="flex items-center space-x-2.5">
                                        <span className="text-lg">{t.icon}</span>
                                        <span>{t.name}</span>
                                    </div>
                                    <span className="text-[10px] opacity-80 font-normal">{t.fa}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* دکمه تایید نهایی */}
                    <button
                        type="submit"
                        className="w-full bg-neutral-200 hover:bg-white text-black font-black py-3.5 rounded-xl text-xs tracking-widest transition duration-200 uppercase cursor-pointer shadow-lg mt-2"
                    >
                        Enter Matrix | ورود به ماتریکس ⚡
                    </button>

                </form>
            </div>
        </div>
    );
}