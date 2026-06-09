export interface DevToArticle {
    id: number;
    title: string;
    description: string;
    published_at: string;
    url: string;
    cover_image: string | null;
    reading_time_minutes: number;
    public_reactions_count: number;
    comments_count: number;
    slug: string;
    tag_list: string[];
}