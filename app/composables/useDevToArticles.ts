import type { DevToArticle, DevToArticleDetail, DevToComment } from "~/types";

const CACHE_KEY_ALL = "devto_articles_all_cache";
const CACHE_KEY_LIMIT = "devto_articles_limit_cache";
const CACHE_KEY_ARTICLE_PREFIX = "devto_article_";
const CACHE_KEY_COMMENTS_PREFIX = "devto_comments_";
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

interface CacheData<T = any> {
	data: T;
	timestamp: number;
}

const isCacheValid = (key: string): boolean => {
	if (!import.meta.client) return false;

	const cached = localStorage.getItem(key);

	if (!cached) return false;

	try {
		const { timestamp } = JSON.parse(cached) as CacheData;
		return Date.now() - timestamp < CACHE_DURATION;
	} catch {
		return false;
	}
};

const getFromCache = <T>(key: string): T | null => {
	if (!import.meta.client) return null;

	const cached = localStorage.getItem(key);

	if (!cached) return null;

	try {
		const parsed = JSON.parse(cached) as CacheData<T>;
		// Support both { data } and legacy { articles } structures
		if ("data" in parsed) {
			return parsed.data;
		}
		if ("articles" in (parsed as any)) {
			return (parsed as any).articles as T;
		}
		return null;
	} catch {
		return null;
	}
};

const saveToCache = <T>(key: string, data: T) => {
	if (!import.meta.client) return;

	localStorage.setItem(
		key,
		JSON.stringify({
			data,
			timestamp: Date.now(),
		} as CacheData<T>),
	);
};

// Composable to fetch all articles (for the stand-alone blog page)
export const useDevToArticles = (username: string) => {
	const articles = ref<DevToArticle[]>([]);
	const loading = ref(false);
	const error = ref<string | null>(null);

	const fetchArticles = async (force = false) => {
		// In development or if force is true, bypass cache check
		const skipCache = force || import.meta.dev;

		if (!skipCache && isCacheValid(CACHE_KEY_ALL)) {
			const cached = getFromCache<DevToArticle[]>(CACHE_KEY_ALL);
			if (cached) {
				articles.value = cached;
				return;
			}
		}

		loading.value = true;
		error.value = null;

		try {
			const data = await $fetch<DevToArticle[]>(
				`/api/articles?username=${username}`
			);

			if (data) {
				articles.value = data;
				saveToCache(CACHE_KEY_ALL, data);
			}
		} catch (err) {
			console.error("Failed to fetch all articles:", err);
			error.value = "Failed to load articles from dev.to";
		} finally {
			loading.value = false;
		}
	};

	onMounted(() => {
		fetchArticles();
	});

	return {
		articles: readonly(articles),
		loading: readonly(loading),
		error: readonly(error),
		refresh: () => fetchArticles(true),
	};
};

// Fetch only recent articles
export const useRecentDevToArticles = (username: string, limit = 3) => {
	const articles = ref<DevToArticle[]>([]);
	const loading = ref(false);
	const error = ref<string | null>(null);

	const fetchRecentArticles = async (force = false) => {
		const cacheKey = `${CACHE_KEY_LIMIT}_${limit}`;
		const skipCache = force || import.meta.dev;

		if (!skipCache && isCacheValid(cacheKey)) {
			const cached = getFromCache<DevToArticle[]>(cacheKey);
			if (cached) {
				articles.value = cached;
				return;
			}
		}

		loading.value = true;
		error.value = null;

		try {
			// Fetch from the API
			const data = await $fetch<DevToArticle[]>(
				`/api/articles?username=${username}`
			);

			if (data) {
				const limited = data.slice(0, limit);
				articles.value = limited;
				saveToCache(cacheKey, limited);
			}
		} catch (err) {
			console.error("Failed to fetch recent articles:", err);
			error.value = "Failed to load recent articles";
		} finally {
			loading.value = false;
		}
	};

	onMounted(() => {
		fetchRecentArticles();
	});

	return {
		articles: readonly(articles),
		loading: readonly(loading),
		error: readonly(error),
		refresh: () => fetchRecentArticles(true),
	};
};

// Fetch single article by slug
export const useDevToArticle = (slug: string, username = "technvernacular") => {
	const article = ref<DevToArticleDetail | null>(null);
	const loading = ref(true);
	const error = ref<string | null>(null);

	const fetchArticle = async (force = false) => {
		if (!slug) return;

		const cacheKey = `${CACHE_KEY_ARTICLE_PREFIX}${slug}`;
		const skipCache = force || import.meta.dev;

		if (!skipCache && isCacheValid(cacheKey)) {
			const cached = getFromCache<DevToArticleDetail>(cacheKey);
			if (cached) {
				article.value = cached;
				loading.value = false;
				return;
			}
		}

		loading.value = true;
		error.value = null;

		try {
			const data = await $fetch<DevToArticleDetail>(
				`/api/articles/${slug}?username=${username}`
			);

			if (data) {
				article.value = data;
				saveToCache(cacheKey, data);
			}
		} catch (err: any) {
			console.error(`Failed to fetch article "${slug}":`, err);
			error.value = err?.statusCode === 404 ? "Article not found" : "Failed to load article from DEV.to";
		} finally {
			loading.value = false;
		}
	};

	onMounted(() => {
		fetchArticle();
	});

	return {
		article: readonly(article),
		loading: readonly(loading),
		error: readonly(error),
		refresh: () => fetchArticle(true),
	};
};

// Fetch comments for an article by articleId
export const useDevToComments = (articleId: MaybeRef<number | undefined | null>) => {
	const comments = ref<DevToComment[]>([]);
	const loading = ref(false);
	const error = ref<string | null>(null);

	const fetchComments = async (force = false) => {
		const id = unref(articleId);
		if (!id) return;

		const cacheKey = `${CACHE_KEY_COMMENTS_PREFIX}${id}`;
		const skipCache = force || import.meta.dev;

		if (!skipCache && isCacheValid(cacheKey)) {
			const cached = getFromCache<DevToComment[]>(cacheKey);
			if (cached) {
				comments.value = cached;
				return;
			}
		}

		loading.value = true;
		error.value = null;

		try {
			const data = await $fetch<DevToComment[]>(
				`/api/articles/${id}/comments`
			);

			if (data) {
				comments.value = data;
				saveToCache(cacheKey, data);
			}
		} catch (err) {
			console.error(`Failed to fetch comments for article ${id}:`, err);
			error.value = "Failed to load comments from DEV.to";
		} finally {
			loading.value = false;
		}
	};

	watch(
		() => unref(articleId),
		(newId) => {
			if (newId) {
				fetchComments();
			}
		},
		{ immediate: true },
	);

	return {
		comments: readonly(comments),
		loading: readonly(loading),
		error: readonly(error),
		refresh: () => fetchComments(true),
	};
};

