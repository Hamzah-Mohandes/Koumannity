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

    // ثبت ری‌اکشن روی پست‌ها
    reactToPost: async (
        postId: number,
        reactionType: "toxic" | "cool" | "cheap",
    ): Promise<PostResponse> => {
        const response = await api.post(`/posts/${postId}/react?reaction_type=${reactionType}`);
        return response.data;
    },

    // دریافت جدول امتیازات تیم‌ها
    getLeaderboard: async (): Promise<LeaderboardRow[]> => {
        const response = await api.get("/leaderboard");
        return response.data;
    },
};
