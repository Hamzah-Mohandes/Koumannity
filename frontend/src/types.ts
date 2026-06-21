export type TeamType = "kourosh" | "iman" | "mialand";

export type AvatarType = "kourosh_matrix" | "iman_serious" | "mia_gamer";

export interface PostCreate {
    username: string;
    avatar: AvatarType;
    team: TeamType;
    text_content?: string;
    image_url?: string;
}

export interface PostResponse extends PostCreate {
    id: number;
    created_at: string;
    toxic_count: number;
    cool_count: number;
    cheap_count: number;
}

export interface LeaderboardRow {
    rank: number;
    team: TeamType;
    score: number;
}
