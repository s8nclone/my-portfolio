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
            `https://dev.to/api/articles?username=${username}&per_page=100`
        );
        return articles;
    } catch (error) {
        throw createError({
            statusCode: 500,
            statusMessage: "Failed to fetch articles from dev.to",
        });
    }
});