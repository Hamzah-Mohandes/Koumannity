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
    const [imageUrl, setImageUrl] = useState('');
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
        if (!textContent.trim() || textContent.length > 100) return;

        try {
            await apiService.createPost({
                username: user.username,
                avatar: user.avatar,
                team: user.team,
                text_content: textContent,
                image_url: imageUrl || undefined,
            });
            setTextContent('');
            setImageUrl('');
            fetchData();
        } catch (error) {
            console.error('Failed to create post:', error);
        }
    };

    const handleReaction = async (postId: number, type: 'toxic' | 'cool' | 'cheap') => {
        try {
            await apiService.reactToPost(postId, type);
            fetchData();
        } catch (error) {
            console.error('Failed to react:', error);
        }
    };

    // اطلاعات فکشن‌ها بر اساس تصویر 1000152503.png
    const getFactionDetails = (team: TeamType) => {
        switch (team) {
            case 'kourosh':
                return { name: "KING'S COURT", sub: "(Kourosh)", color: 'text-amber-500', border: 'border-amber-500', bg: 'bg-amber-500/10', bar: 'bg-amber-500', icon: '👑' };
            case 'iman':
                return { name: "JUDGMENT CALL", sub: "(Iman)", color: 'text-blue-500', border: 'border-blue-500', bg: 'bg-blue-500/10', bar: 'bg-blue-500', icon: '⚖️' };
            case 'mialand':
                return { name: "FANTASY REALM", sub: "(Mia)", color: 'text-purple-500', border: 'border-purple-500', bg: 'bg-purple-500/10', bar: 'bg-purple-500', icon: '🦄' };
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-amber-500 font-bold font-sans">
                Loading Koumanto Matrix...
            </div>
        );
    }

    // پیدا کردن امتیاز برای پروگرس‌بار لیدربرد
    const getScore = (team: TeamType) => leaderboard.find(l => l.team === team)?.score || 1000;

    return (
        <div className="min-h-screen bg-[#0d0e12] text-white p-4 md:p-8 font-sans">

            {/* هدر بالایی بر اساس دیزاین مانیتور */}
            <div className="max-w-5xl mx-auto flex justify-between items-center mb-8 border-b border-neutral-900 pb-4">
                <div className="flex items-center space-x-2">
                    <span className="text-xl font-extrabold tracking-wider bg-gradient-to-r from-amber-500 via-blue-500 to-purple-500 bg-clip-text text-transparent">k/mi</span>
                    <span className="text-lg font-bold text-gray-200">Koumanto</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-sm shadow-md">
                    {user.avatar === 'kourosh_matrix' ? '😎' : user.avatar === 'iman_serious' ? '😐' : '🎮'}
                </div>
            </div>

            <div className="max-w-5xl mx-auto space-y-8">

                {/* ۱. بخش Team Leaderboard افقی تصویر 1000152503.png */}
                <div className="space-y-4">
                    <h2 className="text-lg font-bold text-gray-300">Team Leaderboard</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {(['kourosh', 'iman', 'mialand'] as TeamType[]).map((t) => {
                            const fac = getFactionDetails(t);
                            const score = getScore(t);
                            return (
                                <div key={t} className="bg-[#15171e] border border-neutral-800/60 p-4 rounded-xl space-y-2">
                                    <div className="flex justify-between items-center text-xs font-bold">
                                        <span className={fac.color}>{fac.icon} {fac.name}</span>
                                        <span className="text-gray-400 font-mono">{score.toLocaleString()} points</span>
                                    </div>
                                    {/* پروگرس بار داینامیک */}
                                    <div className="w-full h-2.5 bg-neutral-900 rounded-full overflow-hidden">
                                        <div className={`h-full ${fac.bar}`} style={{ width: `${Math.min((score / 2000) * 100, 100)}%` }}></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* ۲. بخش باکس باکس ارسال پست Share a Moment */}
                <div className="bg-[#15171e] border border-neutral-800/80 p-5 rounded-2xl shadow-lg space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-sm font-bold text-gray-300">Share a Moment <span className="text-xs text-gray-500 font-normal">(Expires 24h)</span></h3>
                    </div>

                    <form onSubmit={handleCreatePost} className="space-y-4">
                        <div className="flex items-center bg-[#0d0e12] border border-neutral-800 rounded-xl px-4 py-3 focus-within:border-neutral-700 transition">
                            <textarea
                                value={textContent}
                                onChange={(e) => setTextContent(e.target.value)}
                                maxLength={100}
                                placeholder="Tell the Commandoes something crazy... (max 100 chars)"
                                className="w-full bg-transparent text-sm placeholder-neutral-600 focus:outline-none resize-none h-10 pt-1"
                            />
                            <button type="submit" className="bg-[#ccced6] hover:bg-white text-black font-extrabold px-6 py-2 rounded-xl text-xs tracking-wider transition ml-2 shrink-0">
                                SHARE
                            </button>
                        </div>

                        {/* ردیف انتخاب برای نمایش نوع آواتار تیمی شما */}
                        <div className="flex items-center space-x-6 text-xs">
                            <span className="text-gray-500 font-semibold">Post As Team</span>
                            <div className="flex items-center space-x-1.5 border border-amber-500/40 px-3 py-1.5 rounded-full bg-amber-500/5">
                                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                                <span className="font-bold text-amber-500">{getFactionDetails(user.team).name}</span>
                                <span className="text-gray-500 text-[10px]">{getFactionDetails(user.team).sub}</span>
                            </div>
                        </div>
                    </form>
                </div>

                {/* ۳. بخش Live Timeline */}
                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-gray-300">Live Timeline</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {posts.length === 0 ? (
                            <p className="text-neutral-600 text-sm py-4 col-span-full text-center">No active moments in the matrix...</p>
                        ) : (
                            posts.map((post) => {
                                const fac = getFactionDetails(post.team);
                                return (
                                    <div key={post.id} className={`bg-[#15171e] rounded-2xl border-2 ${fac.border} p-5 flex flex-col justify-between shadow-md space-y-4`}>

                                        <div className="space-y-3">
                                            {/* هدر کارت شامل دکمه ساعت و آیکون فکشن */}
                                            <div className="flex justify-between items-center text-xs">
                                                <span className="text-lg">{fac.icon}</span>
                                                <span className="text-neutral-500 flex items-center space-x-1">
                                                    <span>🕒</span> <span>24h</span>
                                                </span>
                                            </div>

                                            {/* متن اصلی پست */}
                                            <div>
                                                <h4 className="font-bold text-sm text-white mb-1">
                                                    {post.username}'s Post: <span className="font-normal text-neutral-300">{post.text_content}</span>
                                                </h4>
                                                <span className={`text-xs font-bold ${fac.color}`}>#{post.team === 'kourosh' ? 'GoldStandard' : post.team === 'iman' ? 'Logic' : 'Gaming'}</span>
                                            </div>

                                            {/* نمایش تصویر انتخابی */}
                                            {post.image_url && (
                                                <div className="pt-2">
                                                    <img src={post.image_url} alt="Faction moment" className="w-full h-32 object-cover rounded-xl border border-neutral-800" onError={(e) => (e.currentTarget.style.display = 'none')} />
                                                </div>
                                            )}
                                        </div>

                                        {/* دکمه‌های ری‌آکشن دقیقاً مثل عکس */}
                                        <div className="grid grid-cols-3 gap-1.5 pt-3 border-t border-neutral-800/60 text-[10px]">
                                            <button onClick={() => handleReaction(post.id, 'toxic')} className="flex flex-col items-center justify-center bg-[#0d0e12] hover:bg-neutral-900 p-2 rounded-xl border border-neutral-800 transition text-amber-500/90 cursor-pointer">
                                                <span className="font-bold">☣️ Semic</span>
                                                <span className="text-neutral-500 font-mono mt-0.5">({post.toxic_count})</span>
                                            </button>

                                            <button onClick={() => handleReaction(post.id, 'cool')} className="flex flex-col items-center justify-center bg-[#0d0e12] hover:bg-neutral-900 p-2 rounded-xl border border-neutral-800 transition text-blue-400 cursor-pointer">
                                                <span className="font-bold">🔥 Khafan</span>
                                                <span className="text-neutral-500 font-mono mt-0.5">({post.cool_count})</span>
                                            </button>

                                            <button onClick={() => handleReaction(post.id, 'cheap')} className="flex flex-col items-center justify-center bg-[#0d0e12] hover:bg-neutral-900 p-2 rounded-xl border border-neutral-800 transition text-purple-400 cursor-pointer">
                                                <span className="font-bold">💰 Cheap/Ex</span>
                                                <span className="text-neutral-500 font-mono mt-0.5">({post.cheap_count})</span>
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