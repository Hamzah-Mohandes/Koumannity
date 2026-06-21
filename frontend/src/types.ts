export type TeamType = "kourosh" | "iman" | "mialand";
export type AvatarType = "kourosh_matrix" | "iman_serious" | "mia_gamer";

export interface PostCreate {
    username: string;
    avatar: AvatarType;
    team: TeamType;
    text_content: string | null;
    image_url: string | null;
}

export interface PostResponse extends PostCreate {
    id: number;
    created_at: string;
    toxic_count: number;
    cool_count: number;
    is_destruction_active: boolean;
    destruction_started_at: string | null;
}

export interface LeaderboardRow {
    team: TeamType;
    score: number;
}
