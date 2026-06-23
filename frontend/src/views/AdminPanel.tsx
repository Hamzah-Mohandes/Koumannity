import { useEffect, useState } from "react";

import type { PostResponse } from "../types";
import { apiService } from "../api";

export default function AdminPanel() {
  const [posts, setPosts] = useState<PostResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadAdminPosts();
  }, []);

  const loadAdminPosts = async () => {
    try {
      const data = await apiService.getPosts();
      setPosts(data);
    } catch (error) {
      console.error("Failed to load posts for admin:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you absolutely sure you want to permanently delete this post from the matrix?")) {
      return;
    }
    try {
      await apiService.adminHardDelete(id);
      setMessage(`Post #${id} was successfully hard-deleted.`);
      setPosts(posts.filter((p) => p.id !== id));
      setTimeout(() => setMessage(""), 4000);
    } catch (error) {
      console.error("Failed to delete post:", error);
      setMessage("Error executing hard delete protocol.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-red-900/30 pb-4">
        <h1 className="text-3xl font-black text-red-500 tracking-tight">TERMINATION CONTROL PANEL</h1>
        <p className="text-neutral-400 text-sm mt-1">Authorized admin matrix operations only. Hard deletes are permanent.</p>
      </div>

      {message && (
        <div className="p-4 bg-red-950/40 border border-red-800 text-red-400 rounded-lg text-sm font-mono animate-pulse">
          ⚡ {message}
        </div>
      )}

      <div className="overflow-hidden border border-neutral-800 rounded-xl bg-neutral-900/20 backdrop-blur-sm">
        <table className="min-w-full divide-y divide-neutral-800 text-left text-sm">
          <thead className="bg-neutral-900/60 text-neutral-300 font-mono uppercase text-xs tracking-wider">
            <tr>
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Faction / Team</th>
              <th className="px-6 py-4">Content Preview</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800 bg-transparent">
            {posts.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-neutral-500 font-mono">
                  No active data streams detected in the matrix.
                </td>
              </tr>
            ) : (
              posts.map((post) => (
                <tr key={post.id} className="hover:bg-neutral-900/40 transition-colors">
                  <td className="px-6 py-4 font-mono text-neutral-500">#{post.id}</td>
                  <td className="px-6 py-4 font-medium text-neutral-200">{post.username}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-mono uppercase tracking-wide border ${post.team === "kourosh" ? "bg-emerald-950/50 text-emerald-400 border-emerald-800/30" :
                        post.team === "iman" ? "bg-amber-950/50 text-amber-400 border-amber-800/30" :
                          "bg-fuchsia-950/50 text-fuchsia-400 border-fuchsia-800/30"
                      }`}>
                      {post.team}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-neutral-400 max-w-md truncate">
                    {post.text_content || (post.image_url ? "🖼️ [Image Stream]" : "No content")}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="px-3 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900 text-red-400 hover:text-white border border-red-900/50 transition-all font-medium text-xs uppercase tracking-wider"
                    >
                      Terminate
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}