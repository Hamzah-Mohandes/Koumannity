import React, { useEffect, useState } from 'react';

import type { PostResponse } from '../types';
import { apiService } from '../api';

export default function AdminPanel() {
  const [allPosts, setAllPosts] = useState<PostResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    try {
      // استفاده از سرویس خودمان به جای fetch مستقیم برای یکپارچگی آدرس‌ها
      const data = await apiService.getPosts();
      setAllPosts(data);
    } catch (error) {
      console.error('Failed to fetch admin logs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleHardDelete = async (postId: number) => {
    if (!window.confirm('ADMIN ALERT: Are you sure you want to completely wipe this post from existence? | آیا از حذف کامل و دائمی این پست مطمئن هستید؟')) return;
    try {
      await apiService.adminHardDelete(postId);
      fetchAdminData();
    } catch (error) {
      console.error('Admin delete failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d0e12] flex items-center justify-center text-red-500 font-bold tracking-widest animate-pulse">
        ACCESSING OVERLORD MATRIX ADMIN...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0e12] text-white p-4 md:p-8 font-sans antialiased">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* هدر ادمین پنل */}
        <div className="flex flex-col sm:flex-row justify-between items-center border-b border-red-900/40 pb-5 gap-4">
          <div className="flex items-center space-x-3">
            <span className="text-xl px-2 py-0.5 bg-red-600 text-black font-black rounded">CORE</span>
            <div>
              <h1 className="text-lg font-black tracking-wider text-gray-100">KOUMANTO ADMIN OVERLORD</h1>
              <p className="text-[10px] text-red-500 font-mono">System Status: Operational | پروتکل‌های کنترل ماتریکس فعال است</p>
            </div>
          </div>
          <button
            onClick={fetchAdminData}
            className="bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 px-4 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer"
          >
            🔄 Refresh Logs | به‌روزرسانی
          </button>
        </div>

        {/* لیست کل پست‌های مدیریتی */}
        <div className="bg-[#15171e] border border-neutral-800/80 rounded-2xl overflow-hidden shadow-2xl">
          <div className="p-4 bg-neutral-950/60 border-b border-neutral-800 flex justify-between items-center">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400">Live Matrix Node Logs | گزارش کل پُست‌ها</h2>
            <span className="text-[10px] bg-red-950 text-red-400 border border-red-900 px-2 py-0.5 rounded-full font-mono font-bold">
              Total Nodes: {allPosts.length}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-neutral-800 text-neutral-500 bg-neutral-950/20 font-bold">
                  <th className="p-4">ID</th>
                  <th className="p-4">User / Faction</th>
                  <th className="p-4">Content / Image</th>
                  <th className="p-4 text-center">Clicks (Cool / Toxic)</th>
                  <th className="p-4">Destruction Protocol</th>
                  <th className="p-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-900">
                {allPosts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center p-8 text-neutral-600 font-medium">
                      No active matrix data streams available.
                    </td>
                  </tr>
                ) : (
                  allPosts.map((post) => (
                    <tr key={post.id} className="hover:bg-neutral-950/40 transition">
                      <td className="p-4 font-mono text-neutral-600">#{post.id}</td>
                      <td className="p-4">
                        <div className="font-bold text-gray-200">{post.username}</div>
                        <div className={`text-[10px] font-extrabold uppercase ${post.team === 'kourosh' ? 'text-amber-500' : post.team === 'iman' ? 'text-blue-400' : 'text-purple-400'
                          }`}>
                          {post.team}
                        </div>
                      </td>
                      <td className="p-4 max-w-xs">
                        <p className="text-neutral-300 line-clamp-2">{post.text_content || <span className="text-neutral-700 italic">No text</span>}</p>
                        {post.image_url && (
                          <a href={post.image_url} target="_blank" rel="noreferrer" className="text-[10px] text-blue-400 underline block mt-0.5 truncate">
                            🔗 View Attached Image
                          </a>
                        )}
                      </td>
                      <td className="p-4 text-center font-mono">
                        <div className="flex justify-center items-center space-x-3 text-[11px]">
                          <span className="text-blue-400">🔥 {post.cool_count}</span>
                          <span className="text-amber-500">☣️ {post.toxic_count}</span>
                        </div>
                        <div className="text-[9px] text-neutral-600 mt-0.5">Total: {(post.cool_count || 0) + (post.toxic_count || 0)}</div>
                      </td>
                      <td className="p-4">
                        {post.is_destruction_active ? (
                          <div className="space-y-0.5">
                            <span className="px-2 py-0.5 text-[9px] font-black bg-red-950 text-red-400 border border-red-900 rounded-full inline-block animate-pulse">
                              ⚡ ACTIVE (2h WAR)
                            </span>
                            <div className="text-[9px] text-neutral-600 font-mono">
                              Required: 1000 Clicks
                            </div>
                          </div>
                        ) : (
                          <span className="text-neutral-600 font-semibold">💤 Inactive (Stable)</span>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => handleHardDelete(post.id)}
                          className="bg-red-950 hover:bg-red-600 border border-red-900 hover:border-red-500 text-red-400 hover:text-black px-3 py-1.5 rounded-lg text-[10px] font-black tracking-wider transition cursor-pointer"
                        >
                          HARD DELETE ❌
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}