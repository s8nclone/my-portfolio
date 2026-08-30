<template>
    <div class="comment-item flex flex-col gap-3 py-4 border-b border-green-100/60 dark:border-green-950/30 last:border-b-0">
        <!-- Comment Author Header -->
        <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
                <img
                    v-if="comment.user?.profile_image_90 || comment.user?.profile_image"
                    :src="comment.user.profile_image_90 || comment.user.profile_image"
                    :alt="comment.user.name"
                    class="w-8 h-8 rounded-full object-cover border border-green-200 dark:border-green-800"
                    loading="lazy"
                />
                <div v-else class="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center text-green-700 dark:text-green-300 font-semibold text-xs">
                    {{ comment.user?.name?.charAt(0) || 'U' }}
                </div>
                <div>
                    <div class="flex items-center gap-2">
                        <span class="font-semibold text-sm text-primary dark:text-green-200">
                            {{ comment.user?.name }}
                        </span>
                        <span class="text-xs text-green-600 dark:text-green-500">
                            @{{ comment.user?.username }}
                        </span>
                    </div>
                    <span class="text-xs text-gray-500 dark:text-green-600">
                        {{ formatDate(comment.created_at) }}
                    </span>
                </div>
            </div>
        </div>

        <!-- Comment Body -->
        <div
            class="comment-body prose prose-sm prose-green dark:prose-invert max-w-none text-gray-700 dark:text-green-300 pl-11"
            v-html="comment.body_html"
        />

        <!-- Nested Replies -->
        <div
            v-if="comment.children && comment.children.length > 0"
            class="nested-replies pl-6 sm:pl-10 mt-2 border-l-2 border-green-100 dark:border-green-900/40 space-y-2"
        >
            <DevToCommentItem
                v-for="child in comment.children"
                :key="child.id_code"
                :comment="child"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
    import type { DevToComment } from "~/types";

    defineProps<{
        comment: DevToComment;
    }>();

    const formatDate = (isoString: string): string => {
        if (!isoString) return "";
        return new Date(isoString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };
</script>

<style scoped>
    :deep(.comment-body p) {
        margin-bottom: 0.5rem;
    }

    :deep(.comment-body p:last-child) {
        margin-bottom: 0;
    }

    :deep(.comment-body a) {
        color: #16a34a;
        text-decoration: underline;
    }
    
    :deep(.comment-body pre) {
        background-color: rgba(5, 46, 22, 0.6);
        padding: 0.75rem;
        border-radius: 0.5rem;
        overflow-x: auto;
        font-size: 0.8rem;
    }
</style>
