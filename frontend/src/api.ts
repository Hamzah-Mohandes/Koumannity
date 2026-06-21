import type { LeaderboardRow, PostResponse } from "./types";

import axios from "axios";

const API_BASE_URL = "http://localhost:8000";

const api = axios.create({
    baseURL: API_BASE_URL,
});

export const apiService = {
    // دریافت همه پست‌ها
    getPosts: async (): Promise<PostResponse[]> => {
        const response = await api.get("/posts");
        return response.data;
    },

    // ارسال پست جدید با فرم‌دیتا
    createPost: async (formData: FormData): Promise<PostResponse> => {
        const response = await api.post("/posts", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    },

    // ثبت ری‌آکشن انحصاری همراه با فرستادن یوزرنیم کاربر فعلی
    reactToPost: async (
        postId: number,
        username: string,
        type: "toxic" | "cool",
    ): Promise<PostResponse> => {
        const response = await api.post(`/posts/${postId}/react?username=${username}&type=${type}`);
        return response.data;
    },

    // حذف سخت توسط ادمین
    adminHardDelete: async (postId: number): Promise<{ status: string }> => {
        const response = await api.delete(`/admin/posts/${postId}`);
        return response.data;
    },

    // دریافت وضعیت لیدربورد
    getLeaderboard: async (): Promise<LeaderboardRow[]> => {
        const response = await api.get("/leaderboard");
        return response.data;
    },
};
