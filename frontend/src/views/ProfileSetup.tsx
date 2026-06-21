import type { AvatarType, TeamType } from '../types';
import React, { useState } from 'react';

interface ProfileSetupProps {
    onComplete: (username: string, avatar: AvatarType, team: TeamType) => void;
}

const AVATARS: { id: AvatarType; name: string; emoji: string }[] = [
    { id: 'kourosh_matrix', name: 'Kourosh Matrix', emoji: '😎' },
    { id: 'iman_serious', name: 'Iman Serious', emoji: '😐' },
    { id: 'mia_gamer', name: 'Mia Gamer', emoji: '🎮' },
];

const TEAMS: { id: TeamType; name: string; color: string }[] = [
    { id: 'kourosh', name: 'Team Kourosh', color: 'bg-red-600 hover:bg-red-700' },
    { id: 'iman', name: 'Team Iman', color: 'bg-blue-600 hover:bg-blue-700' },
    { id: 'mialand', name: 'Mialand', color: 'bg-purple-600 hover:bg-purple-700' },
];

export default function ProfileSetup({ onComplete }: ProfileSetupProps) {
    const [username, setUsername] = useState('');
    const [selectedAvatar, setSelectedAvatar] = useState<AvatarType | null>(null);
    const [selectedTeam, setSelectedTeam] = useState<TeamType | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (username.trim() && selectedAvatar && selectedTeam) {
            onComplete(username.trim(), selectedAvatar, selectedTeam);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl text-white">
                <h2 className="text-2xl font-bold text-center text-yellow-500 mb-2">Create Your Profile</h2>
                <p className="text-gray-400 text-center text-sm mb-6">Join the Koumannity matrix</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Username Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
                        <input
                            type="text"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your username..."
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500 transition text-left"
                        />
                    </div>

                    {/* Avatar Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Choose your Avatar</label>
                        <div className="grid grid-cols-3 gap-3">
                            {AVATARS.map((av) => (
                                <button
                                    key={av.id}
                                    type="button"
                                    onClick={() => setSelectedAvatar(av.id)}
                                    className={`p-3 rounded-xl border-2 flex flex-col items-center justify-center bg-slate-950 transition cursor-pointer ${selectedAvatar === av.id ? 'border-yellow-500 bg-slate-900' : 'border-slate-800'
                                        }`}
                                >
                                    <span className="text-2xl mb-1">{av.emoji}</span>
                                    <span className="text-xs text-gray-400 text-center">{av.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Team Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Select Your Team</label>
                        <div className="space-y-2">
                            {TEAMS.map((team) => (
                                <button
                                    key={team.id}
                                    type="button"
                                    onClick={() => setSelectedTeam(team.id)}
                                    className={`w-full p-3 rounded-xl font-semibold text-left transition flex justify-between items-center cursor-pointer ${team.color} ${selectedTeam === team.id ? 'ring-4 ring-yellow-500' : ''
                                        }`}
                                >
                                    <span>{team.name}</span>
                                    {selectedTeam === team.id && <span>✓</span>}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={!username.trim() || !selectedAvatar || !selectedTeam}
                        className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:bg-slate-800 disabled:text-gray-600 text-black font-bold p-3.5 rounded-xl transition shadow-lg cursor-pointer disabled:cursor-not-allowed"
                    >
                        Enter Koumannity
                    </button>
                </form>
            </div>
        </div>
    );
}