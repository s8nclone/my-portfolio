export interface DevToUser {
    id?: number;
    name: string;
    username: string;
    twitter_username?: string | null;
    github_username?: string | null;
    website_url?: string | null;
    profile_image: string;
    profile_image_90?: string;
}

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

export interface DevToArticleDetail extends DevToArticle {
    body_html: string;
    body_markdown: string;
    readable_publish_date: string;
    canonical_url: string;
    tags: string[];
    user: DevToUser;
}

export interface DevToComment {
    type_of: "comment";
    id_code: string;
    id: number;
    created_at: string;
    updated_at?: string;
    body_html: string;
    body_markdown?: string;
    user: DevToUser;
    children?: readonly DevToComment[];
    positive_reactions_number?: number;
}

export interface TableOfContentItem {
    id: string;
    text: string;
    level: number;
}
