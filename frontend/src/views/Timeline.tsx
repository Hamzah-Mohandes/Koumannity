import type { LeaderboardRow, PostResponse } from "../types";
import { useEffect, useState } from "react";

import { apiService } from "../api";

export default function Timeline() {
    const [posts, setPosts] = useState<PostResponse[]>([]);
    const [leaderboard, setLeaderboard] = useState<LeaderboardRow[]>([]);
    const [loading, setLoading] = useState(true);

    // Form states
    const [username, setUsername] = useState("");
    const [avatar, setAvatar] = useState("kourosh_matrix");
    const [team, setTeam] = useState("kourosh");
    const [textContent, setTextContent] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    // Global active user emulation
    const [activeUser, setActiveUser] = useState("AnonymousHacker");

    useEffect(() => {
        fetchMatrixData();
    }, []);

    const fetchMatrixData = async () => {
        try {
            const [postsData, leaderboardData] = await Promise.all([
                apiService.getPosts(),
                apiService.getLeaderboard(),
            ]);
            setPosts(postsData.reverse()); // Show newest posts first
            setLeaderboard(leaderboardData);
        } catch (error) {
            console.error("Error syncing with Koumannity matrix network:", error);
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
        if (!username.trim()) return alert("Identify yourself! Username is required.");

        const formData = new FormData();
        formData.append("username", username);
        formData.append("avatar", avatar);
        formData.append("team", team);
        if (textContent.trim()) formData.append("text_content", textContent);
        if (selectedFile) formData.append("file", selectedFile);

        try {
            await apiService.createPost(formData);
            setTextContent("");
            setSelectedFile(null);
            setActiveUser(username); // Lock-in active session identity
            await fetchMatrixData();
        } catch (error) {
            console.error("Broadcast transmission failed:", error);
        }
    };

    const handleReaction = async (id: number, type: "toxic" | "cool") => {
        try {
            await apiService.reactToPost(id, activeUser, type);
            await fetchMatrixData();
        } catch (error) {
            console.error("Reaction sync failed:", error);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center h-96 gap-4 font-mono text-emerald-400">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
                <p className="animate-pulse text-sm uppercase tracking-widest">Establishing Matrix Feed Connection...</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* LEFT & CENTER: Feed & Form */}
            <div className="lg:col-span-2 space-y-8">
                {/* Post Creation Unit */}
                <div className="p-6 bg-neutral-900/40 border border-neutral-800 rounded-2xl backdrop-blur-md shadow-xl">
                    <h2 className="text-lg font-black uppercase tracking-wider text-emerald-400 border-b border-neutral-800 pb-3 mb-4">
                        Broadcast to Faction Feed
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1.5">User Identity</label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="e.g., Neo_Koumani"
                                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500 font-medium transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1.5">Matrix Manifestation</label>
                                <select
                                    value={avatar}
                                    onChange={(e) => setAvatar(e.target.value)}
                                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-500 font-mono transition-colors"
                                >
                                    <option value="kourosh_matrix">Kourosh Matrix</option>
                                    <option value="iman_serious">Iman Serious</option>
                                    <option value="mia_gamer">Mia Gamer</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1.5">Faction Alignment</label>
                                <select
                                    value={team}
                                    onChange={(e) => setTeam(e.target.value)}
                                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-500 font-mono uppercase transition-colors"
                                >
                                    <option value="kourosh">Kourosh Court</option>
                                    <option value="iman">Iman Judgment</option>
                                    <option value="mialand">Mialand</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1.5">Transmission Data (Text)</label>
                            <textarea
                                value={textContent}
                                onChange={(e) => setTextContent(e.target.value)}
                                placeholder="Infiltrate the data stream with your message..."
                                rows={3}
                                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-4 text-sm focus:outline-none focus:border-emerald-500 transition-colors resize-none"
                            ></textarea>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-neutral-800/60 pt-4">
                            <div className="flex items-center gap-2">
                                <input
                                    type="file"
                                    id="matrix-file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                                <label
                                    htmlFor="matrix-file"
                                    className="px-4 py-2 bg-neutral-950 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 hover:border-neutral-700 rounded-xl text-xs font-mono uppercase tracking-wider cursor-pointer transition-all"
                                >
                                    {selectedFile ? "✓ Image Staged" : "📁 Attach Visual"}
                                </label>
                                {selectedFile && <span className="text-xs text-neutral-500 font-mono truncate max-w-[150px]">{selectedFile.name}</span>}
                            </div>

                            <button
                                type="submit"
                                className="px-6 py-2 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold rounded-xl text-xs uppercase tracking-widest transition-all shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20"
                            >
                                Transmit Broadcast
                            </button>
                        </div>
                    </form>
                </div>

                {/* Timeline Post Feed */}
                <div className="space-y-6">
                    {posts.length === 0 ? (
                        <div className="p-12 border border-dashed border-neutral-800 rounded-2xl text-center text-neutral-500 font-mono text-sm">
                            No tactical feeds discovered. Be the first to synchronize code.
                        </div>
                    ) : (
                        posts.map((post) => (
                            <div
                                key={post.id}
                                className={`p-6 border rounded-2xl bg-neutral-900/20 backdrop-blur-sm transition-all duration-300 ${post.team === "kourosh" ? "border-emerald-900/30 shadow-emerald-950/5" :
                                        post.team === "iman" ? "border-amber-900/30 shadow-amber-950/5" :
                                            "border-fuchsia-900/30 shadow-fuchsia-950/5"
                                    }`}
                            >
                                {/* Post Header */}
                                <div className="flex items-center justify-between gap-4 mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-mono font-black border text-xs uppercase ${post.avatar === "kourosh_matrix" ? "bg-emerald-950 text-emerald-400 border-emerald-800/40" :
                                                post.avatar === "iman_serious" ? "bg-amber-950 text-amber-400 border-amber-800/40" :
                                                    "bg-fuchsia-950 text-fuchsia-400 border-fuchsia-800/40"
                                            }`}>
                                            {post.avatar.substring(0, 2)}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-neutral-200 text-sm flex items-center gap-2">
                                                {post.username}
                                                <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono uppercase tracking-wider border ${post.team === "kourosh" ? "bg-emerald-950/60 text-emerald-400 border-emerald-950" :
                                                        post.team === "iman" ? "bg-amber-950/60 text-amber-400 border-amber-950" :
                                                            "bg-fuchsia-950/60 text-fuchsia-400 border-fuchsia-950"
                                                    }`}>
                                                    {post.team}
                                                </span>
                                            </h3>
                                            <span className="text-[11px] font-mono text-neutral-500">
                                                {new Date(post.created_at).toLocaleTimeString()}
                                            </span>
                                        </div>
                                    </div>
                                    <span className="text-xs font-mono text-neutral-600">ID: #{post.id}</span>
                                </div>

                                {/* Post Body */}
                                <div className="space-y-4 mb-4">
                                    {post.text_content && <p className="text-neutral-300 text-sm leading-relaxed">{post.text_content}</p>}
                                    {post.image_url && (
                                        <div className="rounded-xl overflow-hidden border border-neutral-800 bg-neutral-950">
                                            <img src={post.image_url} alt="Matrix payload" className="w-full max-h-96 object-cover" />
                                        </div>
                                    )}
                                </div>

                                {/* Reactions Control Section */}
                                <div className="flex items-center gap-3 border-t border-neutral-800/50 pt-4">
                                    <button
                                        onClick={() => handleReaction(post.id, "cool")}
                                        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-amber-700 text-neutral-400 hover:text-amber-400 text-xs font-mono transition-all"
                                    >
                                        🔥 COOL <span className="text-neutral-200 font-bold">{post.cool_count}</span>
                                    </button>
                                    <button
                                        onClick={() => handleReaction(post.id, "toxic")}
                                        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-emerald-700 text-neutral-400 hover:text-emerald-400 text-xs font-mono transition-all"
                                    >
                                        ☣️ TOXIC <span className="text-neutral-200 font-bold">{post.toxic_count}</span>
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* RIGHT SIDEBAR: Leaderboard & User Session Emulation */}
            <div className="space-y-6">
                {/* Leaderboard Module */}
                <div className="p-6 bg-neutral-900/40 border border-neutral-800 rounded-2xl backdrop-blur-md shadow-xl">
                    <h2 className="text-sm font-black tracking-widest font-mono uppercase text-neutral-400 mb-4 flex items-center justify-between">
                        <span>FACTION DOMINANCE</span>
                        <span className="animate-pulse h-1.5 w-1.5 rounded-full bg-red-500"></span>
                    </h2>
                    <div className="space-y-3">
                        {leaderboard.map((row) => (
                            <div
                                key={row.team}
                                className="p-3.5 bg-neutral-950 border border-neutral-800/80 rounded-xl flex items-center justify-between gap-4"
                            >
                                <span className={`text-xs font-mono uppercase tracking-wider font-bold ${row.team === "kourosh" ? "text-emerald-400" :
                                        row.team === "iman" ? "text-amber-400" :
                                            "text-fuchsia-400"
                                    }`}>
                                    {row.team === "kourosh" ? "👑 KOUROSH COURT" : row.team === "iman" ? "⚖️ IMAN JUDGMENT" : "🔮 MIALAND"}
                                </span>
                                <span className="text-sm font-mono font-black text-neutral-100">{row.score.toLocaleString()} PTS</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Session Panel */}
                <div className="p-4 bg-neutral-950 border border-neutral-900 rounded-xl flex items-center justify-between text-xs font-mono">
                    <span className="text-neutral-500">SESSION IDENT:</span>
                    <div className="flex items-center gap-2">
                        <span className="text-emerald-500 font-bold">{activeUser}</span>
                        <button
                            onClick={() => {
                                const updated = prompt("Inject new session user identity:", activeUser);
                                if (updated?.trim()) setActiveUser(updated.trim());
                            }}
                            className="text-[10px] text-neutral-400 hover:text-white uppercase bg-neutral-900 border border-neutral-800 px-1.5 py-0.5 rounded"
                        >
                            Mod
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}