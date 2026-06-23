import type { AvatarType, LeaderboardRow, PostResponse, TeamType } from "../types";
import { useEffect, useState } from "react";

import { apiService } from "../api";

interface TimelineProps {
    currentUser: {
        username: string;
        avatar: AvatarType;
        team: TeamType;
    };
}

export default function Timeline({ currentUser }: TimelineProps) {
    const [posts, setPosts] = useState<PostResponse[]>([]);
    const [_leaderboard, setLeaderboard] = useState<LeaderboardRow[]>([]);
    const [loading, setLoading] = useState(true);

    const [textContent, setTextContent] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [activeFilter, setActiveFilter] = useState<"all" | TeamType>("all");

    useEffect(() => {
        fetchMatrixData();
    }, []);

    const fetchMatrixData = async () => {
        try {
            const [postsData, leaderboardData] = await Promise.all([
                apiService.getPosts(),
                apiService.getLeaderboard(),
            ]);
            setPosts(postsData.reverse());
            setLeaderboard(leaderboardData);
        } catch (error) {
            console.error("Sync offline:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!textContent.trim() && !selectedFile) return alert("Error: Content required.");

        const formData = new FormData();
        formData.append("username", currentUser.username);
        formData.append("avatar", currentUser.avatar);
        formData.append("team", currentUser.team);
        if (textContent.trim()) formData.append("text_content", textContent);
        if (selectedFile) formData.append("file", selectedFile);

        try {
            await apiService.createPost(formData);
            setTextContent("");
            setSelectedFile(null);
            await fetchMatrixData();
        } catch (error) {
            console.error("Transmission failed:", error);
        }
    };

    const handleReaction = async (id: number, type: "toxic" | "cool") => {
        try {
            await apiService.reactToPost(id, currentUser.username, type);
            await fetchMatrixData();
        } catch (error) {
            console.error("Reaction failed:", error);
        }
    };

    // متد حذف مستقیم برای یوزر ادمین
    const handleAdminDelete = async (id: number) => {
        if (!window.confirm("Are you sure you want to terminate this transmission?")) return;
        try {
            const API_URL = import.meta.env.VITE_API_URL || "https://koumannity.onrender.com";
            const res = await fetch(`${API_URL}/admin/posts/${id}`, {
                method: "DELETE"
            });
            if (res.ok) {
                await fetchMatrixData();
            }
        } catch (error) {
            console.error("Admin action failed:", error);
        }
    };

    const filteredPosts = posts.filter(post => activeFilter === "all" || post.team === activeFilter);

    const getTeamStats = (teamName: TeamType) => {
        const teamPosts = posts.filter(p => p.team === teamName);
        const totalCool = teamPosts.reduce((acc, p) => acc + (p.cool_count || 0), 0);
        const totalToxic = teamPosts.reduce((acc, p) => acc + (p.toxic_count || 0), 0);
        return {
            count: teamPosts.length,
            cool: totalCool,
            toxic: totalToxic
        };
    };

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center h-96 gap-4 text-neutral-400">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-transparent border-neutral-400"></div>
                <p className="animate-pulse text-lg font-medium">Loading Koumannity... 🚀</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* 1. TEAM LEADERBOARD WITH ADVANCED STATS */}
            <div className="p-6 bg-[#1a1a1e] border border-neutral-800 rounded-2xl shadow-lg">
                <h2 className="text-sm font-bold text-neutral-400 mb-4 uppercase tracking-wider">📊 Faction Live Analytics</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {(['kourosh', 'iman', 'mialand'] as TeamType[]).map((teamName) => {
                        const stats = getTeamStats(teamName);
                        const isKourosh = teamName === "kourosh";
                        const isIman = teamName === "iman";

                        return (
                            <div key={teamName} className={`p-4 bg-[#26262b] rounded-xl border border-neutral-700/50 flex flex-col gap-3 transition-all hover:scale-[1.01]`}>
                                <div className="flex justify-between items-center border-b border-neutral-800 pb-2">
                                    <span className={`text-sm font-black uppercase tracking-wider ${isKourosh ? "text-amber-400" : isIman ? "text-blue-400" : "text-purple-400"
                                        }`}>
                                        {isKourosh ? "👑 KING'S COURT" : isIman ? "⚖️ JUDGMENT" : "🦄 FANTASY"}
                                    </span>
                                    <span className="text-xs bg-neutral-800 px-2 py-0.5 rounded text-neutral-400 font-bold">
                                        {stats.count} 📝 Posts
                                    </span>
                                </div>

                                <div className="flex items-center justify-between text-xs font-semibold px-1">
                                    <span className="text-amber-400/90 flex items-center gap-1">🔥 Khafan: <b className="text-white">{stats.cool}</b></span>
                                    <span className="text-red-400/90 flex items-center gap-1">☣️ Sami: <b className="text-white">{stats.toxic}</b></span>
                                </div>

                                <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden mt-1">
                                    <div className={`h-full rounded-full ${isKourosh ? "bg-amber-500" : isIman ? "bg-blue-500" : "bg-purple-500"
                                        }`} style={{ width: `${Math.min((stats.count / 10) * 100, 100)}%` }}></div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* 2. SHARE A MOMENT BOX */}
            <div className="p-6 bg-[#1a1a1e] border border-neutral-800 rounded-2xl shadow-lg">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">✍️ Share a Moment <span className="text-xs text-amber-500 font-black bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md">⌛ EXPIRES IN 6H</span></h2>
                    <div className="text-xs font-bold px-3 py-1 bg-[#26262b] border border-neutral-700 rounded-full text-neutral-400 uppercase">
                        🟢 Online as: <span className="text-white">{currentUser.username}</span>
                    </div>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <textarea
                        value={textContent}
                        onChange={(e) => setTextContent(e.target.value)}
                        placeholder="Tell the Commandoes something crazy..."
                        rows={3}
                        className="w-full bg-[#26262b] border border-neutral-700 text-neutral-100 rounded-xl p-4 focus:outline-none focus:border-neutral-500 resize-none text-base"
                    ></textarea>
                    <div className="flex items-center justify-between gap-4 border-t border-neutral-800/80 pt-4">
                        <input type="file" id="matrix-file" accept="image/*" onChange={handleFileChange} className="hidden" />
                        <label htmlFor="matrix-file" className="px-4 py-2 bg-[#26262b] text-neutral-300 border border-neutral-700 hover:bg-neutral-700 rounded-xl text-xs font-medium cursor-pointer transition-all">
                            {selectedFile ? "📌 Image Staged" : "🖼️ Attach Image"}
                        </label>
                        <button type="submit" className="px-6 py-2 bg-neutral-200 hover:bg-white text-black font-bold rounded-xl text-sm transition-all shadow-md">
                            🚀 BROADCAST
                        </button>
                    </div>
                </form>
            </div>

            {/* 3. FOUR FACTION FILTER BUTTONS */}
            <div className="flex flex-wrap gap-2.5 border-b border-neutral-800 pb-4">
                <button onClick={() => setActiveFilter("all")} className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${activeFilter === "all" ? "bg-white text-black" : "bg-[#1a1a1e] text-neutral-400 border border-neutral-800 hover:text-white"}`}>
                    🌐 ALL FEEDS
                </button>
                <button onClick={() => setActiveFilter("kourosh")} className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${activeFilter === "kourosh" ? "bg-amber-500 text-black font-black" : "bg-[#1a1a1e] text-amber-500/80 border border-amber-500/20 hover:bg-amber-500/10"}`}>
                    👑 KING'S COURT
                </button>
                <button onClick={() => setActiveFilter("iman")} className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${activeFilter === "iman" ? "bg-blue-500 text-white font-black" : "bg-[#1a1a1e] text-blue-400 border border-blue-500/20 hover:bg-blue-500/10"}`}>
                    ⚖️ JUDGMENT CALL
                </button>
                <button onClick={() => setActiveFilter("mialand")} className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${activeFilter === "mialand" ? "bg-purple-500 text-white font-black" : "bg-[#1a1a1e] text-purple-400 border border-purple-500/20 hover:bg-purple-500/10"}`}>
                    🦄 FANTASY REALM
                </button>
            </div>

            {/* 4. LIVE TIMELINE CARDS WITH SECTOR GRADIENTS */}
            <div className="space-y-6">
                {filteredPosts.length === 0 ? (
                    <div className="p-12 border border-dashed border-neutral-800 text-center text-neutral-500 rounded-2xl text-lg">
                        📭 No active transmissions in this sector.
                    </div>
                ) : (
                    filteredPosts.map((post) => (
                        <div
                            key={post.id}
                            className={`p-6 border rounded-2xl transition-all shadow-sm ${post.team === "kourosh" ? "border-amber-500/30 bg-gradient-to-br from-[#1a1a1e] to-[#241d12]" :
                                post.team === "iman" ? "border-blue-500/30 bg-gradient-to-br from-[#1a1a1e] to-[#121924]" :
                                    "border-purple-500/30 bg-gradient-to-br from-[#1a1a1e] to-[#211224]"
                                }`}
                        >
                            <div className="flex items-center justify-between gap-4 border-b border-neutral-800/60 pb-3 mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="font-bold text-lg text-neutral-100">💬 {post.username}</div>
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold uppercase ${post.team === "kourosh" ? "bg-amber-500/10 text-amber-400" :
                                        post.team === "iman" ? "bg-blue-500/10 text-blue-400" :
                                            "bg-purple-500/10 text-purple-400"
                                        }`}>
                                        {post.team === "kourosh" ? "King's Court" : post.team === "iman" ? "Judgment" : "Fantasy"}
                                    </span>
                                </div>

                                <div className="flex items-center gap-3">
                                    {/* نمایش دکمه حذف فیزیکی فقط برای یوزر ادمین ماتریکس */}
                                    {currentUser.username.toLowerCase() === "admin" && (
                                        <button onClick={() => handleAdminDelete(post.id)} className="text-[10px] bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white px-2 py-1 rounded font-black uppercase tracking-wider transition-all border border-red-500/30">
                                            🗑️ Terminate
                                        </button>
                                    )}
                                    <span className="text-xs text-neutral-500 font-bold flex items-center gap-1">⏱️ 6h Left</span>
                                </div>
                            </div>

                            <div className="space-y-4 my-4">
                                {post.text_content && <p className="text-neutral-200 text-lg font-medium leading-relaxed">{post.text_content}</p>}
                                {post.image_url && (
                                    <div className="rounded-xl overflow-hidden border border-neutral-800 shadow-inner bg-neutral-950">
                                        <img src={post.image_url} alt="Timeline content" className="w-full max-h-[450px] object-cover" />
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center gap-3 border-t border-neutral-800/50 pt-3">
                                <button onClick={() => handleReaction(post.id, "cool")} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#26262b] hover:bg-neutral-700 text-neutral-300 text-sm font-semibold transition-all">
                                    🔥 Khafan <span className="text-white font-bold">{post.cool_count}</span>
                                </button>
                                <button onClick={() => handleReaction(post.id, "toxic")} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#26262b] hover:bg-neutral-700 text-neutral-300 text-sm font-semibold transition-all">
                                    ☣️ Sami <span className="text-white font-bold">{post.toxic_count}</span>
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}