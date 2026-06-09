import type { DevToArticle } from "~/types";

const CACHE_KEY_ALL = "devto_articles_all_cache";
const CACHE_KEY_LIMIT = "devto_articles_limit_cache";
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

interface CacheData {
	articles: DevToArticle[];
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

const getFromCache = (key: string): DevToArticle[] | null => {
	if (!import.meta.client) return null;

	const cached = localStorage.getItem(key);

	if (!cached) return null;

	try {
		const { articles: cachedArticles } = JSON.parse(cached) as CacheData;
		return cachedArticles;
	} catch {
		return null;
	}
};

const saveToCache = (key: string, data: DevToArticle[]) => {
	if (!import.meta.client) return;

	localStorage.setItem(
		key,
		JSON.stringify({
			articles: data,
			timestamp: Date.now(),
		} as CacheData),
	);
};

// Composable to fetch all articles (for the stand-alone blog page)
export const useDevToArticles = (username: string) => {
	const articles = ref<DevToArticle[]>([]);
	const loading = ref(false);
	const error = ref<string | null>(null);

	const fetchArticles = async () => {
		if (isCacheValid(CACHE_KEY_ALL)) {
			const cached = getFromCache(CACHE_KEY_ALL);
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
		refresh: fetchArticles,
	};
};

// Fetch only recent articles
export const useRecentDevToArticles = (username: string, limit = 3) => {
	const articles = ref<DevToArticle[]>([]);
	const loading = ref(false);
	const error = ref<string | null>(null);

	const fetchRecentArticles = async () => {
		const cacheKey = `${CACHE_KEY_LIMIT}_${limit}`;
		if (isCacheValid(cacheKey)) {
			const cached = getFromCache(cacheKey);
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
		refresh: fetchRecentArticles,
	};
};
