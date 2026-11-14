export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    const username = query.username as string;

    if (!username) {
        throw createError({
            statusCode: 400,
            statusMessage: "Username is required",
        });
    }

    try {
        const articles = await $fetch(
            `https://dev.to/api/articles?username=${encodeURIComponent(username)}&per_page=100`
        );
        setHeader(event, "Cache-Control", "public, max-age=300, s-maxage=600, stale-while-revalidate=3600");
        return articles;
    } catch (error) {
        throw createError({
            statusCode: 500,
            statusMessage: "Failed to fetch articles from dev.to",
        });
    }
});
