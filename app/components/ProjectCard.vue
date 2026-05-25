<template>
    <NuxtLink
        :to="`/projects/${project.slug}`"
        class="card group cursor-pointer transform hover:scale-105 block w-full h-[70dvh]"
    >
        <!-- Large screen layout: full width alternating design -->
        <div
            class="hidden lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center lg:h-full"
            :class="{ 'lg:grid-cols-2': !reverse }"
        >
            <div
                class="relative overflow-hidden rounded-lg h-full"
                :class="{ 'lg:order-2': reverse }"
            >
                <img
                    :src="images[project.image] || project.image"
                    :alt="project.title"
                    class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <!-- <iframe src="https://transactease.net/" width="100%" height="100%" title="portfolio website">
                </iframe> -->
                <div class="absolute inset-0 bg-green-900/20"></div>
            </div>

            <div
                class="space-y-6 flex flex-col justify-center h-full p-6"
                :class="{ 'lg:order-1': reverse }"
            >
                <h3
                    class="text-3xl font-bold group-hover:text-primary dark:group-hover:text-green-500 transition-colors duration-300 text-primary dark:text-green-200"
                >
                    {{ project.title }}
                </h3>

                <p
                    class="text-gray-700 dark:text-green-400 text-xl leading-relaxed"
                >
                    {{ project.description }}
                </p>

                <div class="flex flex-wrap gap-3">
                    <span
                        v-for="tech in project.technologies"
                        :key="tech"
                        class="px-4 py-2 bg-gray-200 dark:bg-green-800 text-gray-700 dark:text-green-300 text-sm rounded-lg font-medium"
                    >
                        {{ tech }}
                    </span>
                </div>

                <div
                    class="inline-flex items-center text-gray-600 dark:text-green-400 group-hover:text-green-700 dark:group-hover:text-green-300 transition-colors duration-300 font-semibold text-lg"
                >
                    View Project Details
                    <ArrowRight
                        class="w-6 h-6 ml-3 transition-transform duration-300 group-hover:translate-x-2"
                    />
                </div>
            </div>
        </div>

        <!-- Small/medium screen layout: stacked design -->
        <div class="lg:hidden h-full flex flex-col">
            <div class="relative overflow-hidden rounded-lg mb-4">
                <img
                    :src="images[project.image] || project.image"
                    :alt="project.title"
                    class="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div class="absolute inset-0 bg-green-900/20"></div>
            </div>

            <div class="flex-1 flex flex-col justify-between">
                <div>
                    <h3
                        class="text-xl font-semibold mb-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300 text-primary dark:text-green-200"
                    >
                        {{ project.title }}
                    </h3>

                    <p
                        class="text-green-600 dark:text-green-400 mb-4 line-clamp-2"
                    >
                        {{ project.description }}
                    </p>

                    <div class="flex flex-wrap gap-2 mb-4">
                        <span
                            v-for="tech in project.technologies"
                            :key="tech"
                            class="px-2 py-1 bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-300 text-xs rounded-md"
                        >
                            {{ tech }}
                        </span>
                    </div>
                </div>

                <div
                    class="inline-flex items-center text-green-600 dark:text-green-400 group-hover:text-green-700 dark:group-hover:text-green-300 transition-colors duration-300"
                >
                    View Project
                    <ArrowRight
                        class="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1"
                    />
                </div>
            </div>
        </div>
    </NuxtLink>
</template>

<script setup lang="ts">
    import { ArrowRight } from "lucide-vue-next";
    import * as _images from '~/assets/images';
    const images = _images as Record<string, any>;

    defineProps({
        project: {
            type: Object,
            required: true,
        },
        reverse: {
            type: Boolean,
            default: false,
        },
    });
</script>
