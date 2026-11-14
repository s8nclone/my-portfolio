export default defineEventHandler(async (event) => {
    const articleId = getRouterParam(event, "id");

    if (!articleId) {
        throw createError({
            statusCode: 400,
            statusMessage: "Article ID is required",
        });
    }

    try {
        const comments = await $fetch(
            `https://dev.to/api/comments?a_id=${encodeURIComponent(articleId)}`
        );
        setHeader(event, "Cache-Control", "public, max-age=180, s-maxage=300, stale-while-revalidate=1800");
        return comments;
    } catch (error: any) {
        const statusCode = error?.statusCode || error?.response?.status || 500;
        throw createError({
            statusCode,
            statusMessage: "Failed to fetch comments from dev.to",
        });
    }
});
