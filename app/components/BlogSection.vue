<template>
    <section id="blog" class="section-padding relative mx-5 sm:mx-10 my-20 rounded-3xl bg-white dark:bg-gray-800 shadow-xl border border-green-100 dark:border-green-950/30">
        <div class="container-width relative z-20">
            <!-- Section Header -->
            <div class="text-center mb-16 animate-fade-in-up">
                <h2 class="text-4xl font-bold mb-4 text-primary dark:text-green-200">
                    Latest Insights & Articles
                </h2>
                <p class="text-green-700 dark:text-green-300 text-lg max-w-2xl mx-auto leading-relaxed">
                    Sharing my thoughts, design patterns, and engineering experiences in modern web development.
                </p>
            </div>

            <!-- Empty State -->
            <div v-if="posts.length === 0" class="text-center py-16">
                <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-50 dark:bg-green-950/30 text-green-400 dark:text-green-600 mb-6">
                    <BookOpen class="w-9 h-9" />
                </div>
                <h3 class="text-xl font-semibold mb-2 text-primary dark:text-green-200">No articles yet</h3>
                <p class="text-green-600 dark:text-green-400 text-sm max-w-sm mx-auto">
                    Check back soon — new articles are on the way.
                </p>
            </div>

            <!-- Data List -->
            <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <article
                    v-for="(post, index) in posts"
                    :key="post.id"
                    class="flex flex-col rounded-2xl bg-gray-50 dark:bg-gray-800/40 border border-green-50/50 dark:border-green-950/20 overflow-hidden shadow-sm hover:shadow-xl hover:border-green-300 dark:hover:border-green-700 transition-all duration-300 hover:scale-[1.01] group"
                    :style="{ animationDelay: `${index * 0.1}s` }"
                >
                    <!-- Article Banner Image -->
                    <div class="h-48 overflow-hidden relative">
                        <img
                            :src="post.imageUrl"
                            :alt="post.title"
                            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <span class="absolute top-4 left-4 px-3 py-1 text-xs font-semibold rounded-full bg-green-700 text-white shadow-sm">
                            {{ post.category }}
                        </span>
                    </div>

                    <!-- Article Body Content -->
                    <div class="p-6 flex flex-col justify-between flex-grow">
                        <div>
                            <div class="flex items-center space-x-3 text-xs text-green-600 dark:text-green-400 mb-3">
                                <span class="flex items-center">
                                    <Calendar class="w-3.5 h-3.5 mr-1" />
                                    {{ post.date }}
                                </span>
                                <span>•</span>
                                <span class="flex items-center">
                                    <Clock class="w-3.5 h-3.5 mr-1" />
                                    {{ post.readTime }}
                                </span>
                            </div>
                            <h3 class="text-lg font-bold mb-3 text-primary dark:text-green-200 line-clamp-2 group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors duration-300">
                                {{ post.title }}
                            </h3>
                            <p class="text-green-700 dark:text-green-300 text-sm leading-relaxed mb-6 line-clamp-3">
                                {{ post.excerpt }}
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
                </article>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
    import { Calendar, Clock, ArrowRight, BookOpen } from "lucide-vue-next";
    import rawPosts from "~/public/blog.json";

    interface BlogPost {
        id: string;
        title: string;
        excerpt: string;
        category: string;
        date: string;
        readTime: string;
        imageUrl: string;
    }

    // Static JSON import — no network request, no async component, no Suspense needed.
    // Switch back to useFetch only if blog data moves to a live API/CMS.
    const posts: BlogPost[] = rawPosts;
</script>
