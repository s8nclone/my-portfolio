export default defineEventHandler(async (event) => {
    const slug = getRouterParam(event, "slug");
    const query = getQuery(event);
    const username = (query.username as string) || "technvernacular";

    if (!slug) {
        throw createError({
            statusCode: 400,
            statusMessage: "Article slug is required",
        });
    }

    try {
        const article = await $fetch(
            `https://dev.to/api/articles/${encodeURIComponent(username)}/${encodeURIComponent(slug)}`
        );
        setHeader(event, "Cache-Control", "public, max-age=300, s-maxage=600, stale-while-revalidate=3600");
        return article;
    } catch (error: any) {
        const statusCode = error?.statusCode || error?.response?.status || 500;
        throw createError({
            statusCode,
            statusMessage: statusCode === 404 ? "Article not found on dev.to" : "Failed to fetch article from dev.to",
        });
    }
});
