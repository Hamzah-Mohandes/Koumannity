import type { LeaderboardRow, PostCreate, PostResponse } from "./types";

import axios from "axios";

// آدرس بک‌آند FastAPI
const API_BASE_URL = "http://localhost:8000";

const api = axios.create({
    baseURL: API_BASE_URL,
});

export const apiService = {
    // دریافت همه پست‌ها از بک‌آند
    getPosts: async (): Promise<PostResponse[]> => {
        const response = await api.get("/posts");
        return response.data;
    },

    // ارسال یک پست جدید
    createPost: async (postData: PostCreate): Promise<PostResponse> => {
        const response = await api.post("/posts", postData);
        return response.data;
    },

    // ثبت ری‌اکشن روی پست‌ها (هماهنگ با پارامتر type بک‌آند)
    reactToPost: async (postId: number, type: "toxic" | "cool"): Promise<PostResponse> => {
        const response = await api.post(`/posts/${postId}/react?type=${type}`);
        return response.data;
    },

    // فعال‌سازی پروتکل تخریب ۲ ساعته در جنگ بین ۳ گروه
    triggerDestruction: async (postId: number): Promise<{ status: string; post: PostResponse }> => {
        const response = await api.post(`/posts/${postId}/trigger-destruction`);
        return response.data;
    },

    // حذف کامل و سخت یک پست توسط ادمین از دیتابیس
    adminHardDelete: async (postId: number): Promise<{ status: string }> => {
        const response = await api.delete(`/admin/posts/${postId}`);
        return response.data;
    },

    // دریافت جدول امتیازات تیم‌ها
    getLeaderboard: async (): Promise<LeaderboardRow[]> => {
        const response = await api.get("/leaderboard");
        return response.data;
    },
};
