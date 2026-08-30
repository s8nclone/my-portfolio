<template>
    <div class="min-h-screen">
        <!-- Reading Progress Bar -->
        <!-- <div
            class="fixed top-0 left-0 h-1 bg-green-500 z-50 transition-all duration-150"
            :style="{ width: `${readingProgress}%` }"
        /> -->

        <!-- Loading State -->
        <div v-if="loading" class="pt-28 container-width max-w-4xl mx-auto px-4 pb-20 animate-pulse">
            <div class="h-6 w-32 bg-green-100 dark:bg-green-950/40 rounded-full mb-8" />
            <div class="h-12 w-3/4 bg-green-100 dark:bg-green-950/40 rounded-xl mb-6" />
            <div class="flex gap-4 mb-10">
                <div class="h-5 w-24 bg-green-100 dark:bg-green-950/40 rounded" />
                <div class="h-5 w-24 bg-green-100 dark:bg-green-950/40 rounded" />
            </div>
            <div class="h-80 w-full bg-green-100 dark:bg-green-950/40 rounded-3xl mb-12" />
            <div class="space-y-4">
                <div class="h-4 w-full bg-green-100 dark:bg-green-950/40 rounded" />
                <div class="h-4 w-5/6 bg-green-100 dark:bg-green-950/40 rounded" />
                <div class="h-4 w-4/6 bg-green-100 dark:bg-green-950/40 rounded" />
            </div>
        </div>

        <!-- Error State -->
        <div
            v-else-if="error || !article"
            class="min-h-[70vh] flex items-center justify-center container-width px-4"
        >
            <div class="text-center py-16 bg-white dark:bg-gray-800 rounded-3xl p-8 border border-red-100 dark:border-red-950/30 max-w-lg mx-auto shadow-sm">
                <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-50 dark:bg-red-950/30 text-red-400 dark:text-red-500 mb-6">
                    <AlertCircle class="w-9 h-9" />
                </div>
                <h2 class="text-2xl font-bold mb-2 text-primary dark:text-green-200">
                    {{ error || "Article not found" }}
                </h2>
                <p class="text-green-700 dark:text-green-300 mb-6 text-sm">
                    We couldn't load this article. It may have been moved or removed on DEV.to.
                </p>
                <div class="flex items-center justify-center gap-4">
                    <NuxtLink to="/blog" class="btn-secondary text-sm">
                        <ArrowLeft class="w-4 h-4 mr-2" /> Back to Blog
                    </NuxtLink>
                    <button
                        class="btn-primary text-sm inline-flex items-center gap-2"
                        @click="refresh"
                    >
                        <RefreshCw class="w-4 h-4" /> Try again
                    </button>
                </div>
            </div>
        </div>

        <!-- Article Content -->
        <div v-else>
            <!-- Hero Header Section -->
            <section class="hero-section pt-24 pb-16 rounded-b-[4rem] relative overflow-hidden">
                <!-- Animated Background DotField -->
                <div class="absolute inset-0 z-0 opacity-80 pointer-events-none">
                    <DotField
                        :dot-radius="2"
                        :dot-spacing="15"
                        :cursor-radius="400"
                        :bulge-strength="75"
                        glow-color="rgba(16, 185, 129, 0.4)"
                    />
                </div>

                <div class="container-width relative z-10 w-full max-w-6xl mx-auto section-padding">
                    <!-- Back Link -->
                    <div class="mb-6 animate-fade-in-down">
                        <NuxtLink
                            to="/blog"
                            class="inline-flex items-center text-sm font-medium text-green-200 hover:text-white transition-colors duration-300 group"
                        >
                            <ArrowLeft class="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform duration-300" />
                            Back to All Articles
                        </NuxtLink>
                    </div>

                    <!-- Tags -->
                    <div v-if="article.tag_list && article.tag_list.length > 0" class="flex flex-wrap gap-2 mb-4 animate-fade-in-up">
                        <span
                            v-for="tag in tags"
                            :key="tag"
                            class="px-3 py-1 text-xs font-semibold rounded-full bg-green-700/80 text-green-100 backdrop-blur-sm border border-green-600/40 capitalize"
                        >
                            #{{ tag }}
                        </span>
                    </div>

                    <!-- Title -->
                    <h1 class="w-full max-w-4xl text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-white leading-tight animate-fade-in-up">
                        {{ article.title }}
                    </h1>

                    <!-- Meta Information -->
                    <div class="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-green-200 animate-fade-in-up" style="animation-delay: 0.1s">
                        <!-- Author -->
                        <div v-if="article.user" class="flex items-center gap-2.5">
                            <img
                                :src="article.user.profile_image_90 || article.user.profile_image"
                                :alt="article.user.name"
                                class="w-8 h-8 rounded-full border border-green-400/30 object-cover"
                            />
                            <span class="font-medium text-white">{{ article.user.name }}</span>
                        </div>

                        <span class="hidden sm:inline text-green-400">•</span>

                        <!-- Date -->
                        <span class="flex items-center">
                            <Calendar class="w-4 h-4 mr-1.5 text-green-300" />
                            {{ formatDate(article.published_at) }}
                        </span>

                        <span class="hidden sm:inline text-green-400">•</span>

                        <!-- Reading Time -->
                        <span class="flex items-center">
                            <Clock class="w-4 h-4 mr-1.5 text-green-300" />
                            {{ article.reading_time_minutes }} min read
                        </span>

                        <!-- Reactions / Comments Count Badges -->
                        <div class="flex items-center gap-3 ml-auto">
                            <span v-if="article.public_reactions_count > 0" class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-medium text-white backdrop-blur-sm">
                                <Heart class="w-3.5 h-3.5 text-red-400 fill-red-400" />
                                {{ article.public_reactions_count }}
                            </span>
                            <span v-if="article.comments_count > 0" class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-medium text-white backdrop-blur-sm">
                                <MessageSquare class="w-3.5 h-3.5 text-green-300" />
                                {{ article.comments_count }}
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Main Layout: Content + Sticky Scrollspy Sidebar -->
            <section class="section-padding relative">
                <div class="container-width section-padding py-0">
                    <div class="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        <!-- Main Article Body Column -->
                        <article class="lg:col-span-8 flex flex-col">
                            <!-- Featured Image -->
                            <div v-if="article.cover_image" class="mb-10 overflow-hidden rounded-3xl border border-green-100 dark:border-green-950/30 shadow-md">
                                <img
                                    :src="article.cover_image"
                                    :alt="article.title"
                                    class="w-full h-auto object-cover max-h-[480px]"
                                />
                            </div>

                            <!-- Mobile Table of Contents Accordion -->
                            <div
                                v-if="tableOfContents.length > 0"
                                class="lg:hidden mb-8 p-4 rounded-2xl bg-green-50/70 dark:bg-gray-800/80 border border-green-200 dark:border-green-800/40"
                            >
                                <button
                                    class="w-full flex items-center justify-between font-semibold text-primary dark:text-green-200 text-sm"
                                    @click="isMobileTocOpen = !isMobileTocOpen"
                                >
                                    <span class="flex items-center gap-2">
                                        <ListOrdered class="w-4 h-4 text-green-600 dark:text-green-400" />
                                        Table of Contents ({{ tableOfContents.length }} sections)
                                    </span>
                                    <ChevronDown
                                        class="w-4 h-4 transform transition-transform duration-200"
                                        :class="{ 'rotate-180': isMobileTocOpen }"
                                    />
                                </button>
                                <div v-show="isMobileTocOpen" class="mt-4 pt-3 border-t border-green-200 dark:border-green-800/40 space-y-2">
                                    <button
                                        v-for="item in tableOfContents"
                                        :key="item.id"
                                        class="w-full text-left text-xs py-1.5 px-2 rounded-lg transition-colors block"
                                        :class="[
                                            activeHeadingId === item.id
                                                ? 'bg-green-600 text-white font-semibold'
                                                : 'text-gray-700 dark:text-green-300 hover:bg-green-100/50 dark:hover:bg-green-900/30',
                                            item.level === 3 ? 'pl-5' : 'pl-2'
                                        ]"
                                        @click="scrollToHeading(item.id); isMobileTocOpen = false"
                                    >
                                        {{ item.text }}
                                    </button>
                                </div>
                            </div>

                            <!-- Rendered Article HTML with Typography Styles -->
                            <div
                                ref="articleContentRef"
                                class="article-content prose prose-green dark:prose-invert prose-lg max-w-none text-gray-800 dark:text-green-100"
                                v-html="article.body_html"
                            />

                            <!-- Article Footer / Original Source Card -->
                            <div class="mt-14 pt-8 border-t border-green-200 dark:border-green-900/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div class="flex items-center gap-3">
                                    <img
                                        v-if="article.user?.profile_image"
                                        :src="article.user.profile_image"
                                        :alt="article.user.name"
                                        class="w-12 h-12 rounded-full border border-green-300 dark:border-green-700 object-cover"
                                    />
                                    <div>
                                        <h4 class="font-bold text-primary dark:text-green-200">
                                            Written by {{ article.user?.name }}
                                        </h4>
                                        <p class="text-xs text-green-700 dark:text-green-400">
                                            Published on {{ formatDate(article.published_at) }}
                                        </p>
                                    </div>
                                </div>
                                <a
                                    :href="article.url"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-800 text-xs font-semibold text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors"
                                >
                                    View on DEV.to
                                    <ExternalLink class="w-3.5 h-3.5" />
                                </a>
                            </div>

                            <!-- Comments Section (Option A) -->
                            <div id="comments-section" class="mt-16 pt-10 border-t border-green-200 dark:border-green-900/40">
                                <div class="flex items-center justify-between mb-8">
                                    <div class="flex items-center gap-3">
                                        <h3 class="text-2xl font-bold text-primary dark:text-green-200">
                                            Discussion
                                        </h3>
                                        <span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 dark:bg-green-950/60 text-green-800 dark:text-green-300">
                                            {{ comments.length }}
                                        </span>
                                    </div>
                                    <a
                                        :href="article.url + '#comments'"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        class="btn-primary text-xs !py-2 !px-4 inline-flex items-center gap-1.5"
                                    >
                                        <MessageSquare class="w-3.5 h-3.5" />
                                        Add a comment on DEV.to
                                    </a>
                                </div>

                                <!-- Loading Comments -->
                                <div v-if="commentsLoading" class="space-y-4 py-6">
                                    <div v-for="n in 2" :key="n" class="animate-pulse space-y-2">
                                        <div class="flex items-center gap-3">
                                            <div class="w-8 h-8 rounded-full bg-green-100 dark:bg-green-950/30" />
                                            <div class="h-4 w-32 bg-green-100 dark:bg-green-950/30 rounded" />
                                        </div>
                                        <div class="h-12 w-full bg-green-50 dark:bg-green-950/20 rounded pl-11" />
                                    </div>
                                </div>

                                <!-- Empty Comments State -->
                                <div
                                    v-else-if="comments.length === 0"
                                    class="text-center py-12 px-6 rounded-2xl bg-white dark:bg-gray-800 border border-green-100 dark:border-green-950/30"
                                >
                                    <MessageSquare class="w-10 h-10 mx-auto text-green-300 dark:text-green-800 mb-3" />
                                    <h4 class="font-semibold text-primary dark:text-green-200 mb-1">
                                        No comments yet
                                    </h4>
                                    <p class="text-xs text-green-700 dark:text-green-400 mb-5 max-w-sm mx-auto">
                                        Be the first to share your thoughts, insights, or questions about this article.
                                    </p>
                                    <a
                                        :href="article.url + '#comments'"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        class="btn-secondary text-xs inline-flex items-center gap-1.5"
                                    >
                                        Start the conversation on DEV.to
                                        <ExternalLink class="w-3.5 h-3.5" />
                                    </a>
                                </div>

                                <!-- Comments List -->
                                <div v-else class="space-y-2 bg-white dark:bg-gray-800/60 p-6 rounded-3xl border border-green-100 dark:border-green-950/30 shadow-sm">
                                    <DevToCommentItem
                                        v-for="comment in comments"
                                        :key="comment.id_code"
                                        :comment="comment"
                                    />
                                    <div class="pt-6 text-center border-t border-green-100 dark:border-green-950/30">
                                        <a
                                            :href="article.url + '#comments'"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            class="inline-flex items-center gap-1.5 text-xs font-semibold text-green-700 dark:text-green-400 hover:text-primary dark:hover:text-green-300 transition-colors"
                                        >
                                            Join the discussion on DEV.to
                                            <ExternalLink class="w-3.5 h-3.5 ml-1" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </article>

                        <!-- Sticky Sidebar (Table of Contents & Actions) -->
                        <aside class="hidden lg:block lg:col-span-4">
                            <div class="sticky top-20 space-y-6">
                                <!-- Table of Contents Card -->
                                <div
                                    v-if="tableOfContents.length > 0"
                                    class="p-6 rounded-3xl bg-white dark:bg-gray-800 border border-green-100 dark:border-green-950/30 shadow-sm"
                                >
                                    <div class="flex items-center gap-2 font-bold text-sm text-primary dark:text-green-200 mb-4 uppercase tracking-wider">
                                        <ListOrdered class="w-4 h-4 text-green-600 dark:text-green-400" />
                                        On This Page
                                    </div>

                                    <nav class="space-y-1 max-h-[50vh] overflow-y-auto pr-1">
                                        <a
                                            v-for="item in tableOfContents"
                                            :key="item.id"
                                            :href="`#${item.id}`"
                                            class="block py-1.5 text-xs transition-all duration-200 rounded-lg no-underline"
                                            :class="[
                                                activeHeadingId === item.id
                                                    ? 'font-bold text-green-600 dark:text-green-400 bg-green-50/80 dark:bg-green-950/40 px-2.5 translate-x-1'
                                                    : 'text-gray-600 dark:text-green-300 hover:text-green-700 dark:hover:text-white px-2 hover:translate-x-0.5',
                                                item.level === 3 ? 'pl-6' : 'pl-2'
                                            ]"
                                            @click.prevent="scrollToHeading(item.id)"
                                        >
                                            {{ item.text }}
                                        </a>
                                    </nav>
                                </div>

                                <!-- Article Actions & Sharing Card -->
                                <div class="p-6 rounded-3xl bg-white dark:bg-gray-800 border border-green-100 dark:border-green-950/30 shadow-sm space-y-5">
                                    <!-- Stats -->
                                    <div class="flex items-center justify-around pb-4 border-b border-green-100 dark:border-green-950/30 text-xs">
                                        <div class="flex items-center gap-1.5 text-gray-700 dark:text-green-300">
                                            <Heart class="w-4 h-4 text-red-400 fill-red-400/20" />
                                            <span class="font-bold">{{ article.public_reactions_count }}</span>
                                            <span>Reactions</span>
                                        </div>
                                        <div class="flex items-center gap-1.5 text-gray-700 dark:text-green-300">
                                            <MessageSquare class="w-4 h-4 text-green-600 dark:text-green-400" />
                                            <span class="font-bold">{{ article.comments_count }}</span>
                                            <span>Comments</span>
                                        </div>
                                    </div>

                                    <!-- Share -->
                                    <div>
                                        <p class="text-xs font-semibold text-primary dark:text-green-200 mb-3 flex items-center gap-1.5">
                                            <Share2 class="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                                            Share this article
                                        </p>
                                        <div class="flex items-center gap-2">
                                            <button
                                                class="flex-1 py-2 px-3 rounded-xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800/60 hover:bg-green-100 dark:hover:bg-green-900/40 text-xs font-medium text-green-800 dark:text-green-200 transition-colors flex items-center justify-center gap-1.5"
                                                @click="shareOnTwitter"
                                            >
                                                <Twitter class="w-3.5 h-3.5 text-sky-500" />
                                                X / Twitter
                                            </button>
                                            <button
                                                class="flex-1 py-2 px-3 rounded-xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800/60 hover:bg-green-100 dark:hover:bg-green-900/40 text-xs font-medium text-green-800 dark:text-green-200 transition-colors flex items-center justify-center gap-1.5"
                                                @click="shareOnLinkedIn"
                                            >
                                                <Linkedin class="w-3.5 h-3.5 text-blue-600" />
                                                LinkedIn
                                            </button>
                                            <button
                                                class="p-2 rounded-xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800/60 hover:bg-green-100 dark:hover:bg-green-900/40 text-green-800 dark:text-green-200 transition-colors"
                                                :title="copied ? 'Copied!' : 'Copy Link'"
                                                @click="copyArticleLink"
                                            >
                                                <Check v-if="copied" class="w-4 h-4 text-green-600" />
                                                <Copy v-else class="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <!-- Read Original Link -->
                                    <div class="pt-2">
                                        <a
                                            :href="article.url"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            class="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-green-700 text-white text-xs font-semibold hover:bg-green-600 transition-colors shadow-sm"
                                        >
                                            Open on DEV.to
                                            <ExternalLink class="w-3.5 h-3.5" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </section>
        </div>
    </div>
</template>

<script setup lang="ts">
    import {
        Calendar,
        Clock,
        ArrowLeft,
        Heart,
        MessageSquare,
        Share2,
        Copy,
        Check,
        ExternalLink,
        Twitter,
        Linkedin,
        AlertCircle,
        RefreshCw,
        ListOrdered,
        ChevronDown,
    } from "lucide-vue-next";
    import DotField from "~/components/DotField.vue";
    import DevToCommentItem from "~/components/DevToCommentItem.vue";
    import { useDevToArticle, useDevToComments } from "~/composables/useDevToArticles";
    import type { TableOfContentItem } from "~/types";

    const route = useRoute();
    const slug = route.params.slug as string;

    const { article, loading, error, refresh } = useDevToArticle(slug);
    const articleId = computed(() => article.value?.id);
    const { comments, loading: commentsLoading } = useDevToComments(articleId);

    const articleContentRef = ref<HTMLElement | null>(null);
    const tableOfContents = ref<TableOfContentItem[]>([]);
    const activeHeadingId = ref<string>("");
    const isMobileTocOpen = ref<boolean>(false);
    const copied = ref<boolean>(false);

    let observer: IntersectionObserver | null = null;

    const formatDate = (isoString?: string): string => {
        if (!isoString) return "";
        return new Date(isoString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    // Slugify helper for headings without ID
    const slugify = (text: string): string => {
        return text
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, "")
            .replace(/[\s_-]+/g, "-")
            .replace(/^-+|-+$/g, "");
    };

    const tags = computed(() => article.value?.tags ?? []);
    
    // const tags = computed(() => {
    //     if (!article.value) return [];

    //     return article.value.tags || [];
    //     // if (typeof tagList === "string") {
    //     //     // If it's a string, split it
    //     //     return tagList.split(',').map(tag => tag.trim());
    //     // }
    //     // return Array.isArray(tagList) ? tagList : [];
    // });

    // Extract headings from rendered article HTML and initialize scrollspy
    const buildTableOfContents = () => {
        if (!articleContentRef.value) return;

        const headingElements = articleContentRef.value.querySelectorAll<HTMLElement>("h2, h3");
        const items: TableOfContentItem[] = [];

        headingElements.forEach((el, index) => {
            let id = el.getAttribute("id") || el.getAttribute("name");
            if (!id) {
                id = slugify(el.innerText || `heading-${index}`);
                el.setAttribute("id", id);
            }

            const level = el.tagName.toLowerCase() === "h3" ? 3 : 2;
            const text = el.innerText.trim();

            if (text) {
                items.push({ id, text, level });
            }
        });

        tableOfContents.value = items;

        // Set initial active heading
        if (items.length > 0 && items[0]?.id && !activeHeadingId.value) {
            activeHeadingId.value = items[0].id;
        }

        setupIntersectionObserver(headingElements);
    };

    const setupIntersectionObserver = (headings: NodeListOf<HTMLElement>) => {
        if (observer) {
            observer.disconnect();
        }

        if (typeof window === "undefined" || !("IntersectionObserver" in window)) return;

        observer = new IntersectionObserver(
            (entries) => {
                // Find visible heading near the top of viewport
                const visibleEntries = entries.filter((entry) => entry.isIntersecting);
                if (visibleEntries.length > 0 && visibleEntries[0]?.target.id) {
                    activeHeadingId.value = visibleEntries[0].target.id;
                }
            },
            {
                rootMargin: "-80px 0px -60% 0px",
                threshold: [0, 1],
            }
        );

        headings.forEach((heading) => {
            observer?.observe(heading);
        });
    };

    // Smooth scroll to heading
    const scrollToHeading = (id: string) => {
        activeHeadingId.value = id;
        const target = document.getElementById(id);
        if (target) {
            const offset = 100; // Account for fixed header
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: "smooth",
            });
        }
    };

    // Sharing helpers
    const shareOnTwitter = () => {
        if (typeof window === "undefined" || !article.value) return;
        const shareUrl = encodeURIComponent(window.location.href);
        const text = encodeURIComponent(`Check out "${article.value.title}" by @technvernacular`);
        window.open(`https://x.com/intent/tweet?url=${shareUrl}&text=${text}`, "_blank");
    };

    const shareOnLinkedIn = () => {
        if (typeof window === "undefined" || !article.value) return;
        const shareUrl = encodeURIComponent(window.location.href);
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`, "_blank");
    };

    const copyArticleLink = async () => {
        if (typeof window === "undefined") return;
        try {
            await navigator.clipboard.writeText(window.location.href);
            copied.value = true;
            setTimeout(() => {
                copied.value = false;
            }, 2500);
        } catch (e) {
            console.error("Failed to copy link:", e);
        }
    };

    watch(
        () => article.value?.body_html,
        () => {
            nextTick(() => {
                buildTableOfContents();
            });
        }
    );

    onMounted(() => {
        nextTick(() => {
            buildTableOfContents();
        });
    });

    onUnmounted(() => {
        if (observer) {
            observer.disconnect();
        }
    });

    // SEO Metadata
    useHead(() => ({
        title: article.value ? `${article.value.title} - Abdulmuiz Farayola` : "Article - Abdulmuiz Farayola",
        meta: [
            {
                name: "description",
                content: article.value?.description || "Read this article on Abdulmuiz Farayola's portfolio.",
            },
            {
                property: "og:title",
                content: article.value?.title || "Blog Post",
            },
            {
                property: "og:description",
                content: article.value?.description || "",
            },
            {
                property: "og:image",
                content: article.value?.cover_image || "",
            },
            {
                name: "twitter:card",
                content: "summary_large_image",
            },
            {
                name: "twitter:title",
                content: article.value?.title || "Blog Post",
            },
            {
                name: "twitter:description",
                content: article.value?.description || "",
            },
            {
                name: "twitter:image",
                content: article.value?.cover_image || "",
            },
        ],
        link: article.value?.canonical_url
            ? [{ rel: "canonical", href: article.value.canonical_url }]
            : [],
    }));
</script>

<style scoped>
    /* Typography overrides for DEV.to HTML content */
    :deep(.article-content) {
        line-height: 1.8;
    }

    :deep(.article-content h2) {
        scroll-margin-top: 100px;
        font-weight: 700;
        margin-top: 2.5rem;
        margin-bottom: 1rem;
        color: var(--tw-prose-headings);
    }

    :deep(.article-content h3) {
        scroll-margin-top: 100px;
        font-weight: 600;
        margin-top: 2rem;
        margin-bottom: 0.75rem;
        color: var(--tw-prose-headings);
    }

    :deep(.article-content p) {
        margin-bottom: 1.5rem;
    }

    :deep(.article-content img) {
        border-radius: 1rem;
        margin: 2rem auto;
        max-width: 100%;
        height: auto;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    :deep(.article-content pre) {
        border-radius: 1rem;
        padding: 1.25rem;
        margin: 1.75rem 0;
        overflow-x: auto;
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.9rem;
        background-color: #0d2818 !important;
        border: 1px solid rgba(22, 101, 52, 0.3);
    }

    :deep(.article-content code) {
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.875em;
    }

    :deep(.article-content :not(pre) > code) {
        background-color: rgba(22, 163, 74, 0.12);
        color: #15803d;
        padding: 0.15rem 0.4rem;
        border-radius: 0.375rem;
        font-weight: 500;
    }

    .dark :deep(.article-content :not(pre) > code) {
        background-color: rgba(34, 197, 94, 0.15);
        color: #86efac;
    }

    :deep(.article-content blockquote) {
        border-left-width: 4px;
        border-left-color: #16a34a;
        padding-left: 1.25rem;
        font-style: italic;
        margin: 1.75rem 0;
        background-color: rgba(240, 253, 244, 0.6);
        padding-top: 0.75rem;
        padding-bottom: 0.75rem;
        border-radius: 0 0.75rem 0.75rem 0;
    }

    .dark :deep(.article-content blockquote) {
        background-color: rgba(5, 46, 22, 0.3);
        border-left-color: #22c55e;
    }

    :deep(.article-content a) {
        color: #16a34a;
        text-decoration: underline;
        text-underline-offset: 3px;
        transition: color 0.2s;
    }

    :deep(.article-content a:hover) {
        color: #15803d;
    }

    .dark :deep(.article-content a) {
        color: #4ade80;
    }

    .dark :deep(.article-content a:hover) {
        color: #86efac;
    }
</style>
