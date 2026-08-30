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
            `https://dev.to/api/comments?a_id=${articleId}`
        );
        return comments;
    } catch (error: any) {
        const statusCode = error?.statusCode || error?.response?.status || 500;
        throw createError({
            statusCode,
            statusMessage: "Failed to fetch comments from dev.to",
        });
    }
});
