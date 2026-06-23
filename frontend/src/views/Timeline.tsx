import type { AvatarType, TeamType } from "../types";
import { useEffect, useState } from "react";

interface Post {
    id: number;
    username: string;
    avatar: AvatarType;
    team: TeamType;
    text_content?: string;
    image_url?: string;
    created_at: string;
    toxic_count: number;
    cool_count: number;
}

interface LeaderboardRow {
    team: TeamType;
    score: number;
}

interface TimelineProps {
    currentUser: {
        username: string;
        avatar: AvatarType;
        team: TeamType;
    };
}

export default function Timeline({ currentUser }: TimelineProps) {
    const [posts, setPosts] = useState<Post[]>([]);
    const [leaderboard, setLeaderboard] = useState<LeaderboardRow[]>([]);
    const [textContent, setTextContent] = useState("");
    const [file, setFile] = useState<File | null>(null);

    const API_URL = import.meta.env.VITE_API_URL || "https://koumannity.onrender.com";

    // Data fetchen
    useEffect(() => {
        fetch(`${API_URL}/posts`)
            .then((res) => res.json())
            .then((data) => setPosts(data));

        fetch(`${API_URL}/leaderboard`)
            .then((res) => res.json())
            .then((data) => setLeaderboard(data));
    }, [API_URL]);

    // Post erstellen
    const handleCreatePost = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("username", currentUser.username);
        formData.append("avatar", currentUser.avatar);
        formData.append("team", currentUser.team);
        if (textContent) formData.append("text_content", textContent);
        if (file) formData.append("file", file);

        const res = await fetch(`${API_URL}/posts`, {
            method: "POST",
            body: formData,
        });

        if (res.ok) {
            const newPost = await res.json();
            setPosts([newPost, ...posts]);
            setTextContent("");
            setFile(null);
        }
    };

    // Reaktion senden
    const handleReact = async (postId: number, type: "toxic" | "cool") => {
        const res = await fetch(`${API_URL}/posts/${postId}/react?username=${currentUser.username}&type=${type}`, {
            method: "POST",
        });

        if (res.ok) {
            const updatedPost = await res.json();
            setPosts(posts.map((p) => (p.id === postId ? updatedPost : p)));
        }
    };

    return (
        <div className="space-y-8">
            {/* Leaderboard Sektion */}
            <div className="bg-[#1a1a1e]/80 border border-neutral-800 p-4 rounded-2xl grid grid-cols-3 gap-4 text-center">
                {leaderboard.map((row) => (
                    <div key={row.team} className="p-2 bg-[#26262b]/50 rounded-xl border border-neutral-800">
                        <div className="text-xs uppercase text-neutral-400 font-bold">{row.team}</div>
                        <div className="text-xl font-extrabold text-white mt-1">{row.score} PTS</div>
                    </div>
                ))}
            </div>

            {/* Formular für neue Posts */}
            <form onSubmit={handleCreatePost} className="bg-[#1a1a1e]/80 border border-neutral-800 p-6 rounded-2xl space-y-4">
                <textarea
                    value={textContent}
                    onChange={(e) => setTextContent(e.target.value)}
                    placeholder="Share your matrix entry..."
                    className="w-full bg-[#26262b]/50 border border-neutral-800 rounded-xl p-4 text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-700 resize-none h-24 text-sm"
                />
                <div className="flex items-center justify-between">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                        className="text-xs text-neutral-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-neutral-800 file:text-neutral-200 hover:file:bg-neutral-700 cursor-pointer"
                    />
                    <button type="submit" className="bg-white text-black font-bold text-xs px-6 py-2.5 rounded-full hover:bg-neutral-200 transition-colors shadow-md">
                        Deploy Post
                    </button>
                </div>
            </form>

            {/* Timeline Posts */}
            <div className="space-y-4">
                {posts.map((post) => (
                    <div key={post.id} className="bg-[#1a1a1e]/80 border border-neutral-800 p-6 rounded-2xl space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="text-2xl">
                                    {post.avatar === "kourosh_matrix" && "🕶️"}
                                    {post.avatar === "iman_serious" && "🗿"}
                                    {post.avatar === "mia_gamer" && "🎮"}
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-white">{post.username}</div>
                                    <div className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold">{post.team}</div>
                                </div>
                            </div>
                        </div>

                        {post.text_content && <p className="text-sm text-neutral-200 leading-relaxed">{post.text_content}</p>}

                        {post.image_url && (
                            <img src={post.image_url} alt="Post asset" className="rounded-xl w-full max-h-96 object-cover border border-neutral-800/50" />
                        )}

                        <div className="flex items-center gap-3 pt-2">
                            <button onClick={() => handleReact(post.id, "cool")} className="flex items-center gap-2 bg-[#26262b]/50 border border-neutral-800 hover:border-neutral-700 px-4 py-2 rounded-full text-xs font-semibold text-neutral-300 transition-colors">
                                ⚡ <span>{post.cool_count}</span>
                            </button>
                            <button onClick={() => handleReact(post.id, "toxic")} className="flex items-center gap-2 bg-[#26262b]/50 border border-neutral-800 hover:border-neutral-700 px-4 py-2 rounded-full text-xs font-semibold text-neutral-300 transition-colors">
                                ☣️ <span>{post.toxic_count}</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}