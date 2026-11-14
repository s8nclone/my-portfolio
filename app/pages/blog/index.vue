<template>
    <div class="min-h-screen">
        <!-- Header Section -->
        <section class="section-padding hero-section relative rounded-b-[4rem] min-h-[55dvh] pt-28 pb-16 flex items-center overflow-hidden">
            <!-- Animated Background DotField -->
            <div class="absolute inset-0 z-0 opacity-80">
                <DotField
                    :dot-radius="2"
                    :dot-spacing="15"
                    :cursor-radius="400"
                    :bulge-strength="75"
                    glow-color="rgba(16, 185, 129, 0.4)"
                />
            </div>
            <div class="container-width text-center relative z-10 w-full">
                <span class="inline-block px-3.5 py-1 mb-4 text-xs font-mono font-bold tracking-wider text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 rounded-full animate-fade-in-down">
                    ENGINEERING BLOG &amp; INSIGHTS
                </span>
                <h1 class="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in-up text-white">
                    My Writing &amp; Insights
                </h1>
                <p class="text-lg md:text-xl text-green-200 max-w-3xl mx-auto animate-fade-in-up" style="animation-delay: 0.15s">
                    Thoughts, engineering patterns, tutorials, and experiences building modern web applications.
                </p>

                <!-- Quick Blog Stats -->
                <div
                    v-if="!loading && !error && articles.length > 0"
                    class="mt-8 inline-flex flex-wrap items-center justify-center gap-4 sm:gap-6 px-6 py-3 rounded-2xl bg-white/10 dark:bg-black/20 backdrop-blur-md border border-green-400/20 text-green-100 text-xs sm:text-sm animate-fade-in-up"
                    style="animation-delay: 0.25s"
                >
                    <span class="flex items-center gap-2">
                        <BookOpen class="w-4 h-4 text-emerald-300" />
                        <strong class="text-white">{{ articles.length }}</strong> Articles
                    </span>
                    <span class="text-green-400/50">•</span>
                    <span class="flex items-center gap-2">
                        <Clock class="w-4 h-4 text-emerald-300" />
                        <strong class="text-white">{{ totalReadingMinutes }}</strong> Min Total Read
                    </span>
                    <span v-if="totalReactions > 0" class="text-green-400/50">•</span>
                    <span v-if="totalReactions > 0" class="flex items-center gap-2">
                        <Heart class="w-4 h-4 text-red-400" />
                        <strong class="text-white">{{ totalReactions }}</strong> Reactions
                    </span>
                </div>
            </div>
        </section>

        <!-- Controls: Search, Tag Filters & Sort -->
        <section v-if="!loading && !error && articles.length > 0" class="pt-12 pb-2 px-4 sm:px-6 lg:px-10 relative z-20">
            <div class="container-width space-y-6">
                <!-- Search + Sort Row -->
                <div class="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-green-100 dark:border-green-950/30">
                    <!-- Search Input -->
                    <div class="relative flex-1">
                        <Search class="w-4 h-4 text-green-600 dark:text-green-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                            v-model="searchQuery"
                            type="text"
                            placeholder="Search articles by title, topic, or keyword..."
                            aria-label="Search articles"
                            class="w-full pl-10 pr-9 py-2.5 text-sm rounded-xl bg-green-50/50 dark:bg-gray-900/60 border border-green-200/70 dark:border-gray-700 text-primary dark:text-green-100 placeholder-green-600/60 dark:placeholder-green-400/50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        />
                        <button
                            v-if="searchQuery"
                            type="button"
                            aria-label="Clear search"
                            class="absolute right-3 top-1/2 -translate-y-1/2 text-green-600 dark:text-green-400 hover:text-primary dark:hover:text-white"
                            @click="searchQuery = ''"
                        >
                            <X class="w-4 h-4" />
                        </button>
                    </div>

                    <!-- Sort Selector -->
                    <div class="flex items-center gap-2 self-end md:self-auto">
                        <span class="text-xs font-semibold text-green-700 dark:text-green-400 whitespace-nowrap">
                            Sort by:
                        </span>
                        <div class="inline-flex rounded-xl bg-green-50/70 dark:bg-gray-900/60 p-1 border border-green-200/60 dark:border-gray-700">
                            <button
                                v-for="option in sortOptions"
                                :key="option.value"
                                type="button"
                                class="px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200"
                                :class="
                                    sortBy === option.value
                                        ? 'bg-green-700 text-white shadow-sm'
                                        : 'text-green-700 dark:text-green-300 hover:text-primary dark:hover:text-white'
                                "
                                @click="sortBy = option.value"
                            >
                                {{ option.label }}
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Tag Filter Pills -->
                <div v-if="availableTags.length > 1" class="flex flex-wrap items-center justify-center gap-2.5">
                    <button
                        v-for="tag in availableTags"
                        :key="tag"
                        type="button"
                        class="px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 capitalize"
                        :class="
                            activeTag === tag
                                ? 'bg-green-700 dark:bg-green-600 text-white shadow-sm scale-105'
                                : 'bg-white dark:bg-gray-800 text-green-700 dark:text-green-300 hover:bg-green-50 dark:hover:bg-gray-700 border border-green-200/80 dark:border-gray-700'
                        "
                        @click="activeTag = tag"
                    >
                        {{ tag === 'All' ? 'All Topics' : `#${tag}` }}
                    </button>
                </div>

                <!-- Active Filter Status -->
                <div
                    v-if="activeTag !== 'All' || searchQuery.trim() !== ''"
                    class="flex items-center justify-between text-xs text-green-700 dark:text-green-300 px-1"
                >
                    <span>
                        Showing <strong>{{ filteredArticles.length }}</strong> of {{ articles.length }} articles
                    </span>
                    <button
                        type="button"
                        class="font-semibold text-green-700 dark:text-green-400 hover:underline inline-flex items-center gap-1"
                        @click="resetFilters"
                    >
                        <X class="w-3.5 h-3.5" /> Reset filters
                    </button>
                </div>
            </div>
        </section>

        <!-- Articles Masonry Section -->
        <section class="section-padding pt-10 relative">
            <div class="container-width">
                <!-- Masonry Loading Skeletons -->
                <div v-if="loading" class="columns-1 md:columns-2 lg:columns-3 gap-6 lg:gap-8 mx-auto w-full">
                    <div
                        v-for="(skeletonHeight, n) in skeletonHeights"
                        :key="n"
                        class="break-inside-avoid mb-6 lg:mb-8 rounded-3xl bg-white dark:bg-gray-800 border border-green-100/50 dark:border-green-950/20 overflow-hidden shadow-sm animate-pulse"
                    >
                        <div :class="[skeletonHeight, 'bg-green-50 dark:bg-green-950/20']" />
                        <div class="p-6 flex flex-col gap-3">
                            <div class="flex gap-2">
                                <div class="h-3 w-20 rounded bg-green-50 dark:bg-green-950/20" />
                                <div class="h-3 w-16 rounded bg-green-50 dark:bg-green-950/20" />
                            </div>
                            <div class="h-6 w-4/5 rounded bg-green-50 dark:bg-green-950/20" />
                            <div class="h-3 w-full rounded bg-green-50 dark:bg-green-950/20" />
                            <div class="h-3 w-5/6 rounded bg-green-50 dark:bg-green-950/20" />
                            <div v-if="n % 2 === 0" class="h-3 w-2/3 rounded bg-green-50 dark:bg-green-950/20" />
                        </div>
                    </div>
                </div>

                <!-- Error State -->
                <div v-else-if="error" class="text-center py-20 bg-white dark:bg-gray-800 rounded-3xl p-8 border border-red-100 dark:border-red-950/30 max-w-2xl mx-auto">
                    <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-50 dark:bg-red-950/30 text-red-400 dark:text-red-500 mb-6">
                        <AlertCircle class="w-9 h-9" />
                    </div>
                    <h3 class="text-2xl font-bold mb-2 text-primary dark:text-green-200">Failed to load articles</h3>
                    <p class="text-green-700 dark:text-green-300 mb-6">{{ error }}</p>
                    <button
                        class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-green-700 text-white text-sm font-semibold hover:bg-green-600 transition-colors duration-200"
                        @click="refresh"
                    >
                        <RefreshCw class="w-4 h-4" /> Try again
                    </button>
                </div>

                <!-- Empty State (No articles from API) -->
                <div v-else-if="articles.length === 0" class="text-center py-20 bg-white dark:bg-gray-800 rounded-3xl p-8 border border-green-100 dark:border-green-950/30 max-w-2xl mx-auto">
                    <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-50 dark:bg-green-950/30 text-green-400 dark:text-green-600 mb-6">
                        <BookOpen class="w-9 h-9" />
                    </div>
                    <h3 class="text-2xl font-bold mb-2 text-primary dark:text-green-200">No articles found</h3>
                    <p class="text-green-700 dark:text-green-300">
                        Check back soon! We are currently prepping new articles.
                    </p>
                </div>

                <!-- Empty Filtered State -->
                <div v-else-if="filteredArticles.length === 0" class="text-center py-16 bg-white dark:bg-gray-800 rounded-3xl p-8 border border-green-100 dark:border-green-950/30 max-w-xl mx-auto">
                    <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-50 dark:bg-green-950/30 text-green-500 mb-4">
                        <Search class="w-7 h-7" />
                    </div>
                    <h3 class="text-xl font-bold mb-2 text-primary dark:text-green-200">No matching articles</h3>
                    <p class="text-green-700 dark:text-green-300 text-sm mb-6">
                        No articles matched your current filter or search query.
                    </p>
                    <button
                        type="button"
                        class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-green-700 text-white text-xs font-semibold hover:bg-green-600 transition-colors duration-200"
                        @click="resetFilters"
                    >
                        Reset Filters
                    </button>
                </div>

                <!-- True Masonry Layout -->
                <div v-else class="masonry-grid columns-1 md:columns-2 lg:columns-3 gap-6 lg:gap-8 mx-auto w-full">
                    <article
                        v-for="(article, index) in filteredArticles"
                        :key="article.id"
                        class="masonry-item break-inside-avoid mb-6 lg:mb-8"
                        :style="{ animationDelay: `${index * 0.05}s` }"
                    >
                        <NuxtLink
                            :to="`/blog/${article.slug}`"
                            class="group flex flex-col rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl no-underline"
                            :class="[
                                getCardVariant(index) === 'spotlight'
                                    ? 'bg-white dark:bg-gray-800 border-2 border-green-200 dark:border-green-800/60 shadow-md hover:border-green-400 dark:hover:border-green-600'
                                    : getCardVariant(index) === 'editorial'
                                    ? 'bg-gradient-to-br from-white via-white to-green-50/70 dark:from-gray-800 dark:via-gray-800 dark:to-green-950/40 border border-green-200/80 dark:border-green-800/40 shadow-sm hover:border-green-400 dark:hover:border-green-600'
                                    : 'bg-white dark:bg-gray-800 border border-green-100 dark:border-green-950/30 shadow-sm hover:border-green-300 dark:hover:border-green-700'
                            ]"
                        >
                            <!-- Media / Cover Header -->
                            <div
                                v-if="article.cover_image"
                                class="overflow-hidden relative bg-green-50 dark:bg-green-950/20"
                                :class="getImageHeightClass(index)"
                            >
                                <img
                                    :src="article.cover_image"
                                    :alt="article.title"
                                    loading="lazy"
                                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div
                                    v-if="getCardVariant(index) === 'spotlight'"
                                    class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"
                                />

                                <!-- Top Badges -->
                                <div class="absolute top-4 left-4 right-4 flex items-center justify-between gap-2">
                                    <span
                                        v-if="article.tag_list && article.tag_list.length > 0"
                                        class="px-3 py-1 text-xs font-semibold rounded-full bg-green-700/95 text-white shadow-sm backdrop-blur-sm capitalize"
                                    >
                                        {{ article.tag_list[0] }}
                                    </span>
                                    <span
                                        v-if="getCardVariant(index) === 'spotlight'"
                                        class="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded-full bg-emerald-500/90 text-white shadow-sm backdrop-blur-sm"
                                    >
                                        <Sparkles class="w-3 h-3" /> Spotlight
                                    </span>
                                </div>
                            </div>

                            <!-- Fallback Pattern Header when no cover_image exists -->
                            <div
                                v-else
                                class="relative overflow-hidden flex items-center justify-between px-6 bg-gradient-to-br from-green-700 to-primary dark:from-green-900 dark:to-gray-900"
                                :class="getCardVariant(index) === 'spotlight' ? 'h-44' : 'h-28'"
                            >
                                <BookOpen class="w-12 h-12 text-green-200/30 dark:text-green-400/20" />
                                <span
                                    v-if="article.tag_list && article.tag_list.length > 0"
                                    class="px-3 py-1 text-xs font-semibold rounded-full bg-white/15 text-white backdrop-blur-sm capitalize"
                                >
                                    {{ article.tag_list[0] }}
                                </span>
                            </div>

                            <!-- Card Body -->
                            <div
                                class="flex flex-col justify-between flex-grow"
                                :class="getCardVariant(index) === 'spotlight' ? 'p-7 sm:p-8' : 'p-6'"
                            >
                                <div>
                                    <!-- Meta Row -->
                                    <div class="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-green-600 dark:text-green-400 mb-3">
                                        <span class="flex items-center">
                                            <Calendar class="w-3.5 h-3.5 mr-1" />
                                            {{ formatDate(article.published_at) }}
                                        </span>
                                        <span>•</span>
                                        <span class="flex items-center">
                                            <Clock class="w-3.5 h-3.5 mr-1" />
                                            {{ article.reading_time_minutes }} min read
                                        </span>

                                        <div class="flex items-center gap-2.5 ml-auto">
                                            <span v-if="article.public_reactions_count > 0" class="flex items-center">
                                                <Heart class="w-3.5 h-3.5 mr-1 text-red-400" />
                                                {{ article.public_reactions_count }}
                                            </span>
                                            <span v-if="article.comments_count > 0" class="flex items-center">
                                                <MessageSquare class="w-3.5 h-3.5 mr-1 text-green-500" />
                                                {{ article.comments_count }}
                                            </span>
                                        </div>
                                    </div>

                                    <!-- Article Title -->
                                    <h2
                                        class="font-bold mb-3 text-primary dark:text-green-200 group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors duration-300"
                                        :class="
                                            getCardVariant(index) === 'spotlight'
                                                ? 'text-xl sm:text-2xl leading-snug'
                                                : 'text-lg leading-snug'
                                        "
                                    >
                                        {{ article.title }}
                                    </h2>

                                    <!-- Description (Editorial variant gets quote styling; Spotlight gets larger text) -->
                                    <p
                                        class="text-green-700 dark:text-green-300 leading-relaxed mb-5"
                                        :class="[
                                            getCardVariant(index) === 'editorial'
                                                ? 'text-sm border-l-2 border-green-500 dark:border-green-400 pl-3.5 italic bg-green-50/50 dark:bg-green-950/20 py-2 pr-2 rounded-r-xl'
                                                : getCardVariant(index) === 'spotlight'
                                                ? 'text-sm sm:text-base'
                                                : 'text-sm'
                                        ]"
                                    >
                                        {{ article.description }}
                                    </p>

                                    <!-- Tag Pills List -->
                                    <div
                                        v-if="article.tag_list && article.tag_list.length > 1"
                                        class="flex flex-wrap gap-1.5 mb-5"
                                    >
                                        <span
                                            v-for="tag in article.tag_list.slice(1, getCardVariant(index) === 'spotlight' ? 5 : 4)"
                                            :key="tag"
                                            class="px-2.5 py-0.5 text-[11px] font-medium rounded-lg bg-green-50 dark:bg-gray-700/70 text-green-700 dark:text-green-300 border border-green-100 dark:border-gray-600 capitalize"
                                        >
                                            #{{ tag }}
                                        </span>
                                    </div>
                                </div>

                                <!-- Card Footer -->
                                <div class="mt-auto pt-4 border-t border-green-100/60 dark:border-green-950/30 flex items-center justify-between">
                                    <!-- Author mini-badge on spotlight cards -->
                                    <div v-if="article.user && getCardVariant(index) === 'spotlight'" class="flex items-center gap-2">
                                        <img
                                            v-if="article.user.profile_image_90 || article.user.profile_image"
                                            :src="article.user.profile_image_90 || article.user.profile_image"
                                            :alt="article.user.name"
                                            class="w-6 h-6 rounded-full object-cover border border-green-300 dark:border-green-700"
                                            loading="lazy"
                                        />
                                        <span class="text-xs font-medium text-green-800 dark:text-green-300">
                                            {{ article.user.name }}
                                        </span>
                                    </div>

                                    <span class="inline-flex items-center text-xs font-semibold text-green-700 dark:text-green-400 group-hover:text-primary dark:group-hover:text-green-300 transition-colors duration-300 ml-auto">
                                        Read Article
                                        <ArrowRight class="w-3.5 h-3.5 ml-1.5 transform group-hover:translate-x-1 transition-transform duration-300" />
                                    </span>
                                </div>
                            </div>
                        </NuxtLink>
                    </article>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
    import {
        Calendar,
        Clock,
        ArrowRight,
        BookOpen,
        AlertCircle,
        RefreshCw,
        Heart,
        MessageSquare,
        Search,
        X,
        Sparkles,
    } from "lucide-vue-next";
    import DotField from "~/components/DotField.vue";
    import { useDevToArticles } from "~/composables/useDevToArticles";

    const DEV_TO_USERNAME = "technvernacular";

    const { articles, loading, error, refresh } = useDevToArticles(DEV_TO_USERNAME);

    // Search, Filter & Sort State
    const searchQuery = ref("");
    const activeTag = ref("All");
    const sortBy = ref<"latest" | "popular" | "quick">("latest");

    const sortOptions = [
        { label: "Latest", value: "latest" as const },
        { label: "Popular", value: "popular" as const },
        { label: "Quick Read", value: "quick" as const },
    ];

    const skeletonHeights = ["h-64", "h-44", "h-56", "h-48", "h-60", "h-40"];

    // Extract unique tags across articles
    const availableTags = computed(() => {
        const tagCounts = new Map<string, number>();
        articles.value.forEach((article) => {
            article.tag_list?.forEach((tag) => {
                tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
            });
        });
        const sortedTags = Array.from(tagCounts.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([tag]) => tag);

        return ["All", ...sortedTags];
    });

    // Filtered and sorted articles
    const filteredArticles = computed(() => {
        const query = searchQuery.value.trim().toLowerCase();

        const filtered = articles.value.filter((article) => {
            const matchesTag =
                activeTag.value === "All" ||
                (article.tag_list && article.tag_list.includes(activeTag.value));

            const matchesQuery =
                !query ||
                article.title.toLowerCase().includes(query) ||
                article.description?.toLowerCase().includes(query) ||
                article.tag_list?.some((tag) => tag.toLowerCase().includes(query));

            return matchesTag && matchesQuery;
        });

        return [...filtered].sort((a, b) => {
            if (sortBy.value === "popular") {
                return (b.public_reactions_count || 0) - (a.public_reactions_count || 0);
            }
            if (sortBy.value === "quick") {
                return (a.reading_time_minutes || 0) - (b.reading_time_minutes || 0);
            }
            return new Date(b.published_at).getTime() - new Date(a.published_at).getTime();
        });
    });

    // Aggregate stats for Hero banner
    const totalReadingMinutes = computed(() =>
        articles.value.reduce((acc, item) => acc + (item.reading_time_minutes || 0), 0)
    );

    const totalReactions = computed(() =>
        articles.value.reduce((acc, item) => acc + (item.public_reactions_count || 0), 0)
    );

    const resetFilters = () => {
        searchQuery.value = "";
        activeTag.value = "All";
        sortBy.value = "latest";
    };

    // Determine card variant to create natural height diversity in the masonry grid
    const getCardVariant = (index: number): "spotlight" | "editorial" | "standard" => {
        if (index % 5 === 0) return "spotlight";
        if (index % 5 === 2) return "editorial";
        return "standard";
    };

    // Stagger cover image heights across cards so columns interlock in a true masonry pattern
    const getImageHeightClass = (index: number): string => {
        const variant = getCardVariant(index);
        if (variant === "spotlight") return "h-60 sm:h-72";
        if (variant === "editorial") return "h-40 sm:h-44";
        return index % 2 === 0 ? "h-52" : "h-44";
    };

    const formatDate = (isoString: string): string => {
        return new Date(isoString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    useHead({
        title: "Blog & Insights - Abdulmuiz Farayola",
        meta: [
            {
                name: "description",
                content: "Read the latest engineering articles, design pattern insights, and thoughts on software development by Abdulmuiz Farayola.",
            },
        ],
    });
</script>
