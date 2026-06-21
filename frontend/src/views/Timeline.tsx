import type { AvatarType, LeaderboardRow, PostResponse, TeamType } from '../types';
import React, { useEffect, useState } from 'react';

import { apiService } from '../api';

interface TimelineProps {
    user: {
        username: string;
        avatar: AvatarType;
        team: TeamType;
    };
}

export default function Timeline({ user }: TimelineProps) {
    const [posts, setPosts] = useState<PostResponse[]>([]);
    const [leaderboard, setLeaderboard] = useState<LeaderboardRow[]>([]);
    const [textContent, setTextContent] = useState('');

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [showFileInput, setShowFileInput] = useState(false);

    const [activeFilter, setActiveFilter] = useState<TeamType | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const [postsData, leaderboardData] = await Promise.all([
                apiService.getPosts(),
                apiService.getLeaderboard(),
            ]);
            setPosts(postsData);
            setLeaderboard(leaderboardData);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreatePost = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!textContent.trim() && !selectedFile) return;
        if (textContent.length > 100) return;

        const formData = new FormData();
        formData.append('username', user.username);
        formData.append('avatar', user.avatar);
        formData.append('team', user.team);

        if (textContent.trim()) {
            formData.append('text_content', textContent.trim());
        }
        if (selectedFile) {
            formData.append('file', selectedFile);
        }

        try {
            await apiService.createPost(formData);
            setTextContent('');
            setSelectedFile(null);
            setShowFileInput(false);
            fetchData();
        } catch (error) {
            console.error('Failed to create post:', error);
        }
    };

    const handleReaction = async (postId: number, type: 'toxic' | 'cool') => {
        try {
            await apiService.reactToPost(postId, user.username, type);
            fetchData();
        } catch (error) {
            console.error('Failed to react:', error);
        }
    };

    const handleDeletePost = async (postId: number) => {
        if (!window.confirm('If this post gets 1000 clicks, it will be deleted within the next 2 hours in the war between the 3 factions! | اگر این پست ۱۰۰۰ بار کلیک بخورد، تا ۲ ساعت آینده در جنگ بین ۳ گروه پاک خواهد شد!')) return;
        try {
            alert('Termination protocol activated! 1000 clicks required within 2h. | پروتکل حذف فعال شد! نیاز به ۱۰۰۰ کلیک در ۲ ساعت آینده.');
        } catch (error) {
            console.error('Failed to delete post:', error);
        }
    };

    const getFactionStats = (team: TeamType) => {
        const factionPosts = posts.filter(p => p.team === team);
        const totalCool = factionPosts.reduce((sum, p) => sum + (p.cool_count || 0), 0);
        const totalToxic = factionPosts.reduce((sum, p) => sum + (p.toxic_count || 0), 0);
        return { totalCool, totalToxic };
    };

    const getFactionDetails = (team: TeamType) => {
        switch (team) {
            case 'kourosh':
                return { name: "KING'S COURT", sub: "(Kourosh)", color: 'text-amber-500', border: 'border-amber-500/80', bar: 'bg-amber-500', icon: '👑', activeBtn: 'bg-amber-500 text-black', label: '👑 Kourosh | کوروش' };
            case 'iman':
                return { name: "JUDGMENT CALL", sub: "(Iman)", color: 'text-blue-500', border: 'border-blue-500/80', bar: 'bg-blue-500', icon: '⚖️', activeBtn: 'bg-blue-500 text-white', label: '⚖️ Iman Abad | ایمان آباد' };
            case 'mialand':
                return { name: "FANTASY REALM", sub: "(Mia)", color: 'text-purple-500', border: 'border-purple-500/80', bar: 'bg-purple-500', icon: '🦄', activeBtn: 'bg-purple-500 text-white', label: '🦄 Miya Land | میا لند' };
        }
    };

    const filteredPosts = activeFilter ? posts.filter(p => p.team === activeFilter) : posts;
    const getScore = (team: TeamType) => leaderboard.find(l => l.team === team)?.score || 1000;

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0d0e12] flex items-center justify-center text-amber-500 font-bold">
                Loading Koumannity Matrix... | در حال بارگذاری ماتریکس کوماتو...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0d0e12] text-white p-4 md:p-8 font-sans antialiased select-none">

            {/* هدر بالایی برنامه با برند جدید Koumannity */}
            <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center mb-8 border-b border-neutral-900 pb-5 gap-4">
                <div className="flex items-center space-x-2 shrink-0">
                    <span className="text-xl font-extrabold tracking-wider bg-gradient-to-r from-amber-500 via-blue-500 to-purple-500 bg-clip-text text-transparent">k/mi</span>
                    <span className="text-lg font-bold text-gray-200">Koumannity</span>
                </div>

                {/* فیلترها */}
                <div className="flex flex-wrap gap-2 bg-[#15171e] p-1.5 rounded-full border border-neutral-800/80 justify-center items-center shadow-inner">
                    <button onClick={() => setActiveFilter(null)} className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-all duration-200 cursor-pointer ${!activeFilter ? 'bg-white/80 text-black shadow' : 'text-gray-400 hover:text-white'}`}>
                        🌐 All Timeline | کل تایم‌لاین
                    </button>
                    {(['kourosh', 'iman', 'mialand'] as TeamType[]).map(t => (
                        <button key={t} onClick={() => setActiveFilter(t)} className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-all duration-200 cursor-pointer ${activeFilter === t ? getFactionDetails(t).activeBtn : `${getFactionDetails(t).color} hover:bg-neutral-800/40`}`}>
                            {getFactionDetails(t).label}
                        </button>
                    ))}
                </div>

                <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-sm shadow border border-neutral-700 hidden md:flex shrink-0">
                    {user.avatar === 'kourosh_matrix' ? '😎' : user.avatar === 'iman_serious' ? '😐' : '🎮'}
                </div>
            </div>

            <div className="max-w-5xl mx-auto space-y-8">

                {/* ۱. جدول امتیازات پیشرفته */}
                <div className="space-y-4">
                    <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Team Leaderboard | جدول امتیازات</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {(['kourosh', 'iman', 'mialand'] as TeamType[]).map((t) => {
                            const fac = getFactionDetails(t);
                            const score = getScore(t);
                            const stats = getFactionStats(t);
                            return (
                                <div key={t} className="bg-[#15171e] border border-neutral-800/60 p-4 rounded-xl space-y-3 shadow-sm">
                                    <div className="flex justify-between items-center text-xs font-bold">
                                        <span className={fac.color}>{fac.icon} {fac.name}</span>
                                        <span className="text-gray-400 font-mono text-[10px]">{score.toLocaleString()} PTS</span>
                                    </div>

                                    <div className="w-full h-1.5 bg-neutral-950 rounded-full overflow-hidden border border-neutral-900">
                                        <div className={`h-full ${fac.bar} transition-all duration-500`} style={{ width: `${Math.min((score / 2000) * 100, 100)}%` }}></div>
                                    </div>

                                    <div className="flex justify-between items-center text-[10px] font-semibold bg-neutral-950/40 p-1.5 rounded-lg border border-neutral-900">
                                        <span className="text-blue-400 flex items-center gap-1">
                                            🔥 {stats.totalCool} Khafan | خفن
                                        </span>
                                        <span className="text-amber-500 flex items-center gap-1">
                                            ☣️ {stats.totalToxic} Semic | سمی
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* ۲. باکس ارسال پست */}
                <div className="bg-[#15171e] border border-neutral-800/80 p-5 rounded-2xl shadow-lg space-y-3">
                    <h3 className="text-sm font-bold text-gray-300">Share a Moment | به اشتراک گذاشتن لحظه <span className="text-xs text-neutral-500 font-normal">(Expires 10h)</span></h3>
                    <form onSubmit={handleCreatePost} className="space-y-3">
                        <div className="flex items-center bg-[#0d0e12] border border-neutral-800 rounded-xl px-4 py-3 focus-within:border-neutral-700 transition">
                            <textarea
                                value={textContent}
                                onChange={(e) => setTextContent(e.target.value)}
                                maxLength={100}
                                placeholder="Tell the Commandoes something crazy... | چیزی دیوانه‌وار به کماندوها بگو..."
                                className="w-full bg-transparent text-sm placeholder-neutral-600 focus:outline-none resize-none h-8 pt-1"
                            />
                            <button
                                type="button"
                                onClick={() => setShowFileInput(!showFileInput)}
                                className="p-2 rounded-lg text-gray-500 hover:text-white transition mr-2 cursor-pointer"
                            >
                                🖼️
                            </button>
                            <button type="submit" className="bg-[#ccced6] hover:bg-white text-black font-extrabold px-6 py-2 rounded-xl text-[11px] transition shrink-0 cursor-pointer">SHARE | ارسال</button>
                        </div>

                        {showFileInput && (
                            <div className="bg-[#0d0e12] border border-neutral-800 rounded-xl p-3 flex flex-col space-y-2">
                                <label className="text-[11px] text-gray-400 font-bold block">SELECT IMAGE FROM DEVICE | انتخاب عکس از دستگاه</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            setSelectedFile(e.target.files[0]);
                                        }
                                    }}
                                    className="text-xs text-neutral-400 file:mr-4 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-neutral-800 file:text-white hover:file:bg-neutral-700 cursor-pointer"
                                />
                                {selectedFile && <p className="text-[10px] text-emerald-400 font-mono">Selected File: {selectedFile.name}</p>}
                            </div>
                        )}
                    </form>
                </div>

                {/* ۳. بخش Live Timeline */}
                <div className="space-y-4">
                    <h3 className="text-base font-bold text-gray-400 uppercase tracking-wider">
                        {!activeFilter ? 'Live Timeline | تایم‌لاین زنده' : `${getFactionDetails(activeFilter).name} Timeline`}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredPosts.length === 0 ? (
                            <p className="text-neutral-600 text-sm py-12 col-span-full text-center">No active moments...</p>
                        ) : (
                            filteredPosts.map((post) => {
                                const fac = getFactionDetails(post.team);
                                return (
                                    <div key={post.id} className={`bg-[#15171e] rounded-2xl border-2 ${fac.border} p-5 flex flex-col justify-between shadow-md space-y-4`}>
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center text-xs">
                                                <span className="text-lg">{fac.icon}</span>
                                                <span className="text-neutral-500 font-mono text-[10px]">🕒 10h</span>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-sm text-white mb-1">
                                                    {post.username}'s Post: <span className="font-normal text-neutral-300">{post.text_content}</span>
                                                </h4>
                                            </div>
                                            {post.image_url && (
                                                <div className="pt-1 overflow-hidden rounded-xl">
                                                    <img src={post.image_url} alt="Faction moment" className="w-full h-36 object-cover border border-neutral-900" onError={(e) => (e.currentTarget.style.display = 'none')} />
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-2.5 pt-3 border-t border-neutral-800/60 ">
                                            <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                                                <button onClick={() => handleReaction(post.id, 'toxic')} className="flex flex-col items-center justify-center bg-[#0d0e12] p-2 rounded-xl border border-neutral-800 text-amber-500/90 cursor-pointer hover:border-amber-500/40 transition">
                                                    <span className="font-bold">☣️ Semic | سَمی</span>
                                                    <span className="text-neutral-500 mt-0.5">({post.toxic_count || 0})</span>
                                                </button>
                                                <button onClick={() => handleReaction(post.id, 'cool')} className="flex flex-col items-center justify-center bg-[#0d0e12] p-2 rounded-xl border border-neutral-800 text-blue-400 cursor-pointer hover:border-blue-400/40 transition">
                                                    <span className="font-bold">🔥 Khafan | خَفَن</span>
                                                    <span className="text-neutral-500 mt-0.5">({post.cool_count || 0})</span>
                                                </button>
                                            </div>

                                            <button onClick={() => handleDeletePost(post.id)} className="w-full flex flex-col items-center justify-center bg-neutral-950 px-3 py-2 rounded-xl text-[9px] font-bold text-neutral-500 hover:text-red-400 border border-neutral-900 hover:border-red-950/50 transition cursor-pointer text-center leading-tight">
                                                <span>🗑️ Request Destruction | درخواست تخریب پست</span>
                                                <span className="text-[8px] font-normal text-neutral-600 mt-0.5">(Needs 1000 clicks in 2h)</span>
                                            </button>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}