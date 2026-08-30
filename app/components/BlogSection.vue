<template>
    <section id="blog" class="section-padding relative mx-5 sm:mx-10 my-20 rounded-3xl bg-white dark:bg-gray-800 shadow-xl border border-green-100 dark:border-green-950/30">
        <div class="container-width relative z-20">
            <!-- Section Header -->
            <div class="text-center mb-16 animate-fade-in-up">
                <h2 class="text-4xl font-bold mb-4 text-primary dark:text-green-200">
                    Latest Insights &amp; Articles
                </h2>
                <p class="text-green-700 dark:text-green-300 text-lg max-w-2xl mx-auto leading-relaxed">
                    Sharing my thoughts, design patterns, and engineering experiences in modern web development.
                </p>
            </div>

            <!-- Loading Skeletons -->
            <div v-if="loading" class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div
                    v-for="n in 3"
                    :key="n"
                    class="flex flex-col rounded-2xl bg-gray-50 dark:bg-gray-800/40 border border-green-50/50 dark:border-green-950/20 overflow-hidden shadow-sm animate-pulse"
                >
                    <div class="h-48 bg-green-100 dark:bg-green-950/30" />
                    <div class="p-6 flex flex-col gap-3">
                        <div class="h-3 w-1/3 rounded bg-green-100 dark:bg-green-950/30" />
                        <div class="h-5 w-3/4 rounded bg-green-100 dark:bg-green-950/30" />
                        <div class="h-3 w-full rounded bg-green-100 dark:bg-green-950/30" />
                        <div class="h-3 w-5/6 rounded bg-green-100 dark:bg-green-950/30" />
                    </div>
                </div>
            </div>

            <!-- Error State -->
            <div v-else-if="error" class="text-center py-16">
                <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-50 dark:bg-red-950/30 text-red-400 dark:text-red-500 mb-6">
                    <AlertCircle class="w-9 h-9" />
                </div>
                <h3 class="text-xl font-semibold mb-2 text-primary dark:text-green-200">Couldn't load articles</h3>
                <p class="text-green-600 dark:text-green-400 text-sm max-w-sm mx-auto mb-6">{{ error }}</p>
                <button
                    class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-green-700 text-white text-sm font-semibold hover:bg-green-600 transition-colors duration-200"
                    @click="refresh"
                >
                    <RefreshCw class="w-4 h-4" /> Try again
                </button>
            </div>

            <!-- Empty State -->
            <div v-else-if="articles.length === 0" class="text-center py-16">
                <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-50 dark:bg-green-950/30 text-green-400 dark:text-green-600 mb-6">
                    <BookOpen class="w-9 h-9" />
                </div>
                <h3 class="text-xl font-semibold mb-2 text-primary dark:text-green-200">No articles yet</h3>
                <p class="text-green-600 dark:text-green-400 text-sm max-w-sm mx-auto">
                    Check back soon — new articles are on the way.
                </p>
            </div>

            <!-- Article Grid -->
            <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <NuxtLink
                    v-for="(article, index) in articles"
                    :key="article.id"
                    :to="`/blog/${article.slug}`"
                    class="flex flex-col rounded-2xl bg-gray-50 dark:bg-gray-800/40 border border-green-50/50 dark:border-green-950/20 overflow-hidden shadow-sm hover:shadow-xl hover:border-green-300 dark:hover:border-green-700 transition-all duration-300 hover:scale-[1.01] group no-underline"
                    :style="{ animationDelay: `${index * 0.1}s` }"
                >
                    <!-- Article Banner Image -->
                    <div class="h-48 overflow-hidden relative bg-green-50 dark:bg-green-950/20">
                        <img
                            v-if="article.cover_image"
                            :src="article.cover_image"
                            :alt="article.title"
                            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <!-- Fallback when no cover image -->
                        <div v-else class="w-full h-full flex items-center justify-center">
                            <BookOpen class="w-12 h-12 text-green-300 dark:text-green-700" />
                        </div>
                        <!-- Primary tag badge -->
                        <span
                            v-if="article.tag_list && article.tag_list.length > 0"
                            class="absolute top-4 left-4 px-3 py-1 text-xs font-semibold rounded-full bg-green-700 text-white shadow-sm capitalize"
                        >
                            {{ article.tag_list[0] }}
                        </span>
                    </div>

                    <!-- Article Body Content -->
                    <div class="p-6 flex flex-col justify-between flex-grow">
                        <div>
                            <div class="flex items-center space-x-3 text-xs text-green-600 dark:text-green-400 mb-3">
                                <span class="flex items-center">
                                    <Calendar class="w-3.5 h-3.5 mr-1" />
                                    {{ formatDate(article.published_at) }}
                                </span>
                                <span>•</span>
                                <span class="flex items-center">
                                    <Clock class="w-3.5 h-3.5 mr-1" />
                                    {{ article.reading_time_minutes }} min read
                                </span>
                                <span v-if="article.public_reactions_count > 0" class="flex items-center ml-auto">
                                    <Heart class="w-3.5 h-3.5 mr-1 text-red-400" />
                                    {{ article.public_reactions_count }}
                                </span>
                            </div>
                            <h3 class="text-lg font-bold mb-3 text-primary dark:text-green-200 line-clamp-2 group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors duration-300">
                                {{ article.title }}
                            </h3>
                            <p class="text-green-700 dark:text-green-300 text-sm leading-relaxed mb-6 line-clamp-3">
                                {{ article.description }}
                            </p>
                        </div>

                        <!-- Read Link -->
                        <div class="mt-auto pt-4 border-t border-green-100/50 dark:border-green-950/20">
                            <span class="inline-flex items-center text-xs font-semibold text-green-700 dark:text-green-400 group-hover:text-primary dark:group-hover:text-green-300 transition-colors duration-300">
                                Read Article
                                <ArrowRight class="w-3.5 h-3.5 ml-1.5 transform group-hover:translate-x-1 transition-transform duration-300" />
                            </span>
                        </div>
                    </div>
                </NuxtLink>
            </div>

            <!-- Read More Button (Navigates to full blog page) -->
            <div v-if="articles.length > 0" class="text-center mt-12 animate-fade-in-up">
                <NuxtLink
                    to="/blog"
                    class="btn-primary inline-flex items-center gap-2"
                >
                    Read More Articles
                    <ArrowRight class="w-4 h-4" />
                </NuxtLink>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
    import { Calendar, Clock, ArrowRight, BookOpen, AlertCircle, RefreshCw, Heart } from "lucide-vue-next";
    import { useRecentDevToArticles } from "~/composables/useDevToArticles";

    const DEV_TO_USERNAME = "technvernacular";

    const { articles, loading, error, refresh } = useRecentDevToArticles(DEV_TO_USERNAME, 3);

    const formatDate = (isoString: string): string => {
        return new Date(isoString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };
</script>
