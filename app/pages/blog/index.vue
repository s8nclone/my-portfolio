<template>
    <div class="min-h-screen">
        <!-- Header Section -->
        <section class="section-padding hero-section relative rounded-b-[4rem] h-[60dvh] flex items-center overflow-hidden">
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
                <h1 class="text-3xl md:text-5xl font-bold mb-6 animate-fade-in-up text-white">
                    My Writing &amp; Insights
                </h1>
                <p class="text-xl text-green-200 max-w-3xl mx-auto animate-fade-in-up" style="animation-delay: 0.2s">
                    Thoughts, engineering patterns, tutorials, and experiences building modern web applications.
                </p>
            </div>
        </section>

        <!-- Articles Grid / Content -->
        <section class="section-padding relative">
            <div class="container-width">
                <!-- Loading Skeletons -->
                <div v-if="loading" class="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div
                        v-for="n in 3"
                        :key="n"
                        class="flex flex-col rounded-2xl bg-white dark:bg-gray-800 border border-green-100/50 dark:border-green-950/20 overflow-hidden shadow-sm animate-pulse"
                    >
                        <div class="h-48 bg-green-50 dark:bg-green-950/20" />
                        <div class="p-6 flex flex-col gap-3">
                            <div class="h-3 w-1/3 rounded bg-green-50 dark:bg-green-950/20" />
                            <div class="h-5 w-3/4 rounded bg-green-50 dark:bg-green-950/20" />
                            <div class="h-3 w-full rounded bg-green-50 dark:bg-green-950/20" />
                            <div class="h-3 w-5/6 rounded bg-green-50 dark:bg-green-950/20" />
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

                <!-- Empty State -->
                <div v-else-if="articles.length === 0" class="text-center py-20 bg-white dark:bg-gray-800 rounded-3xl p-8 border border-green-100 dark:border-green-950/30 max-w-2xl mx-auto">
                    <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-50 dark:bg-green-950/30 text-green-400 dark:text-green-600 mb-6">
                        <BookOpen class="w-9 h-9" />
                    </div>
                    <h3 class="text-2xl font-bold mb-2 text-primary dark:text-green-200">No articles found</h3>
                    <p class="text-green-700 dark:text-green-300">
                        Check back soon! We are currently prepping new articles.
                    </p>
                </div>

                <!-- Articles Grid (Masonry effect using Tailwind columns for performance and seamless responsive packing) -->
                <div v-else class="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8 [column-fill:_balance] mx-auto w-full">
                    <a
                        v-for="(article, index) in articles"
                        :key="article.id"
                        :href="article.url"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="break-inside-avoid flex flex-col rounded-2xl bg-white dark:bg-gray-800 border border-green-100 dark:border-green-950/20 overflow-hidden shadow-sm hover:shadow-xl hover:border-green-300 dark:hover:border-green-700 transition-all duration-300 hover:scale-[1.01] group no-underline mb-8"
                        :style="{ animationDelay: `${index * 0.05}s` }"
                    >
                        <!-- Article Banner Image -->
                        <div v-if="article.cover_image" class="overflow-hidden relative bg-green-50 dark:bg-green-950/20">
                            <img
                                :src="article.cover_image"
                                :alt="article.title"
                                class="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <!-- Primary tag badge -->
                            <span
                                v-if="article.tag_list && article.tag_list.length > 0"
                                class="absolute top-4 left-4 px-3 py-1 text-xs font-semibold rounded-full bg-green-700 text-white shadow-sm capitalize"
                            >
                                {{ article.tag_list[0] }}
                            </span>
                        </div>
                        
                        <!-- Fallback visual when no image exists -->
                        <div v-else class="h-32 flex items-center justify-center bg-green-50 dark:bg-green-950/10">
                            <BookOpen class="w-10 h-10 text-green-300 dark:text-green-800" />
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
                                <h3 class="text-lg font-bold mb-3 text-primary dark:text-green-200 group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors duration-300">
                                    {{ article.title }}
                                </h3>
                                <p class="text-green-700 dark:text-green-300 text-sm leading-relaxed mb-6">
                                    {{ article.description }}
                                </p>
                            </div>

                            <!-- Read Link -->
                            <div class="mt-auto pt-4 border-t border-green-100/50 dark:border-green-950/20">
                                <span class="inline-flex items-center text-xs font-semibold text-green-700 dark:text-green-400 group-hover:text-primary dark:group-hover:text-green-300 transition-colors duration-300">
                                    Read on DEV.to
                                    <ArrowRight class="w-3.5 h-3.5 ml-1.5 transform group-hover:translate-x-1 transition-transform duration-300" />
                                </span>
                            </div>
                        </div>
                    </a>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
    import { Calendar, Clock, ArrowRight, BookOpen, AlertCircle, RefreshCw, Heart } from "lucide-vue-next";
    import DotField from "~/components/DotField.vue";
    import { useDevToArticles } from "~/composables/useDevToArticles";

    const DEV_TO_USERNAME = "technvernacular";

    const { articles, loading, error, refresh } = useDevToArticles(DEV_TO_USERNAME);

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
