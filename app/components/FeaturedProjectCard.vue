<template>
    <NuxtLink
        :to="`/projects/${project.slug}`"
        class="group cursor-pointer transform block w-full h-[80dvh]"
    >
        <!-- Large screen layout: full width alternating design -->
        <div
            class="grid grid-cols-1 gap-0 items-center h-full"
        >
            <div
                class="relative overflow-hidden rounded-3xl h-full group"
            >
                <!-- Image fills entire container -->
                <img
                    :src="images[project.image] || project.image"
                    :alt="project.title"
                    class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <!-- <iframe src="https://transactease.net/" width="100%" height="100%" title="portfolio website">
                </iframe> -->
                
                <!-- Overlay background -->
                <div class="absolute inset-0 bg-green-900/20"></div>
                
                <!-- Text content overlay - hidden by default, shown on hover -->
                <div
                    class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end items-end p-8"
                >
                    <div class="space-y-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <h3
                            class="text-3xl font-bold text-green-200"
                        >
                            {{ project.title }}
                        </h3>
                        <p
                            class="text-green-200 text-lg leading-relaxed"
                        >
                            {{ project.description }}
                        </p>
                        <div class="flex flex-wrap gap-3">
                            <span
                                v-for="tech in project.technologies"
                                :key="tech"
                                class="px-4 py-2 bg-white/20 backdrop-blur-sm text-green-200 text-sm rounded-lg font-medium"
                            >
                                {{ tech }}
                            </span>
                        </div>
                        <div
                            class="inline-flex items-center text-green-200 font-semibold text-lg"
                        >
                            View Project Details
                            <ArrowRight
                                class="w-6 h-6 ml-3 transition-transform duration-300 group-hover:translate-x-2"
                            />
                        </div>
                    </div>
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
