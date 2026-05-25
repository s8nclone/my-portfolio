<template>
    <div class="min-h-screen">
        <div v-if="project">
            <!-- Hero Section -->
            <section class="section-padding hero-section pt-20 rounded-b-[4rem]">
                <div class="container-width h-[70dvh] flex items-center">
                    <div
                        class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
                    >
                        <div class="animate-fade-in-left">
                            <div class="mb-6">
                                <NuxtLink
                                    to="/projects"
                                    class="inline-flex items-center text-green-200 hover:text-white transition-colors duration-300 mb-4"
                                >
                                    <ArrowLeft class="w-4 h-4 mr-2" />
                                    Back to Projects
                                </NuxtLink>
                            </div>

                            <h1
                                class="text-4xl md:text-5xl font-bold mb-6 text-white"
                            >
                                {{ project.title }}
                            </h1>

                            <p
                                class="text-xl text-green-200 mb-8 leading-relaxed"
                            >
                                {{ project.description }}
                            </p>

                            <div class="flex flex-wrap gap-3 mb-8">
                                <span
                                    v-for="tech in project.technologies"
                                    :key="tech"
                                    class="px-3 py-1 bg-green-700 text-green-100 rounded-lg"
                                >
                                    {{ tech }}
                                </span>
                            </div>

                            <div class="flex flex-col sm:flex-row gap-4">
                                <a
                                    v-if="project.liveUrl"
                                    :href="project.liveUrl"
                                    target="_blank"
                                    class="btn-tertiary inline-flex items-center"
                                >
                                    <ExternalLink class="w-4 h-4 mr-2" />
                                    Live Demo
                                </a>
                                <a
                                    v-if="project.githubUrl"
                                    :href="project.githubUrl"
                                    target="_blank"
                                    class="btn-secondary inline-flex items-center"
                                >
                                    <Github class="w-4 h-4 mr-2" />
                                    View Code
                                </a>
                            </div>
                        </div>

                        <div class="animate-fade-in-right">
                            <div class="relative overflow-hidden rounded-xl">
                                <img
                                    :src="images[project.image] || project.image"
                                    :alt="project.title"
                                    class="w-full h-auto object-cover"
                                />
                                <div
                                    class="absolute inset-0 bg-green-900/20"
                                ></div>
                                <!-- <iframe src="https://amala.cloud/" class="h-[70dvh] w-full" title="portfolio website">
                                </iframe> -->
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Project Details -->
            <section class="section-padding relative">
                <div class="container-width">
                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        <!-- Main Content -->
                        <div class="lg:col-span-2">
                            <div
                                class="prose prose-green dark:prose-invert prose-lg max-w-none"
                            >
                                <h2 class="text-primary dark:text-green-200">
                                    Project Overview
                                </h2>
                                <p class="text-gray-700 dark:text-green-300">
                                    {{ project.overview }}
                                </p>

                                <h2 class="text-primary dark:text-green-200">
                                    Key Features
                                </h2>
                                <ul class="text-gray-700 dark:text-green-300">
                                    <li
                                        v-for="feature in project.features"
                                        :key="feature"
                                    >
                                        {{ feature }}
                                    </li>
                                </ul>

                                <h2 class="text-primary dark:text-green-200">
                                    Technical Implementation
                                </h2>
                                <p class="text-gray-700 dark:text-green-300">
                                    {{ project.implementation }}
                                </p>

                                <h2 class="text-primary dark:text-green-200">
                                    Challenges & Solutions
                                </h2>
                                <p class="text-gray-700 dark:text-green-300">
                                    {{ project.challenges }}
                                </p>

                                <div v-if="project.subProjects && project.subProjects.length > 0">
                                    <h2 class="text-primary dark:text-green-200 mt-8">
                                        Ecosystem Platforms
                                    </h2>
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 not-prose">
                                        <div v-for="sub in project.subProjects" :key="sub.name" class="p-4 border border-green-200 dark:border-green-800 rounded-lg bg-green-50 dark:bg-green-900/10 flex flex-col">
                                            <div v-if="sub.image" class="mb-4 relative h-40 rounded-md overflow-hidden">
                                                <img :src="images[sub.image] || sub.image" :alt="sub.name" class="w-full h-full object-cover" />
                                                <div class="absolute inset-0 bg-green-900/10"></div>
                                            </div>
                                            <h3 class="text-lg font-bold text-green-700 dark:text-green-300">{{ sub.name }}</h3>
                                            <p class="text-sm font-medium text-gray-500 dark:text-green-500 mb-2">{{ sub.type }}</p>
                                            <p class="text-gray-700 dark:text-green-400 text-sm flex-grow">{{ sub.description }}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Sidebar -->
                        <div>
                            <div class="card mb-8">
                                <h3
                                    class="text-xl font-semibold mb-4 text-primary dark:text-green-200"
                                >
                                    Project Info
                                </h3>
                                <div class="space-y-4">
                                    <div>
                                        <h4
                                            class="font-medium text-green-700 dark:text-green-300 mb-2"
                                        >
                                            Category
                                        </h4>
                                        <p
                                            class="text-gray-600 dark:text-green-400"
                                        >
                                            {{ Array.isArray(project.category) ? project.category.join(', ') : project.category }}
                                        </p>
                                    </div>
                                    <div>
                                        <h4
                                            class="font-medium text-green-700 dark:text-green-300 mb-2"
                                        >
                                            Duration
                                        </h4>
                                        <p
                                            class="text-gray-600 dark:text-green-400"
                                        >
                                            {{ project.duration }}
                                        </p>
                                    </div>
                                    <div>
                                        <h4
                                            class="font-medium text-green-700 dark:text-green-300 mb-2"
                                        >
                                            Team Size
                                        </h4>
                                        <p
                                            class="text-gray-600 dark:text-green-400"
                                        >
                                            {{ project.teamSize }}
                                        </p>
                                    </div>
                                    <div>
                                        <h4
                                            class="font-medium text-green-700 dark:text-green-300 mb-2"
                                        >
                                            My Role
                                        </h4>
                                        <p
                                            class="text-gray-600 dark:text-green-400"
                                        >
                                            {{ project.role }}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div class="card">
                                <h3
                                    class="text-xl font-semibold mb-4 text-primary dark:text-green-200"
                                >
                                    Technologies Used
                                </h3>
                                <div class="space-y-3">
                                    <div
                                        v-for="techCategory in project.techStack"
                                        :key="techCategory.name"
                                    >
                                        <h4
                                            class="font-medium text-gray-700 dark:text-green-300 mb-2"
                                        >
                                            {{ techCategory.name }}
                                        </h4>
                                        <div class="flex flex-wrap gap-2">
                                            <span
                                                v-for="tech in techCategory.items"
                                                :key="tech"
                                                class="px-2 py-1 bg-gray-200 dark:bg-green-800 text-gray-700 dark:text-green-300 text-xs rounded"
                                            >
                                                {{ tech }}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Live Website -->
            <section
                v-if="project.allowIframe"
                class="section-padding relative"
            >
                <div class="animate-fade-in-right">
                    <div class="relative overflow-hidden rounded-xl">
                        <iframe :src="project.liveUrl" class="h-[70dvh] w-full border rounded-xl shadow-green-400 shadow-3xl" title="portfolio website">
                        </iframe>
                    </div>
                </div>
            </section>
        </div>

        <div
            v-else
            class="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900"
        >
            <div class="text-center">
                <h1
                    class="text-2xl font-bold mb-4 text-primary dark:text-green-200"
                >
                    Project Not Found
                </h1>
                <p class="text-green-600 dark:text-green-400 mb-8">
                    The project you're looking for doesn't exist.
                </p>
                <NuxtLink to="/projects" class="btn-primary">
                    Back to Projects
                </NuxtLink>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ArrowLeft, ExternalLink, Github } from "lucide-vue-next";
    import projectsData from "~/public/projects.json";
    import * as _images from '~/assets/images';
    const images = _images as Record<string, any>;

    const route = useRoute();
    const slug = route.params.slug as string;


    interface SubProject {
        name: string;
        type: string;
        description: string;
        image?: string;
    }

    interface TechStackCategory {
        name: string;
        items: string[];
    }

    interface Project {
        title: string;
        description: string;
        image: string;
        technologies: string[];
        category: string | string[];
        duration: string;
        teamSize: string;
        role: string;
        liveUrl: string;
        githubUrl: string;
        overview: string;
        subProjects?: SubProject[];
        features: string[];
        implementation: string;
        challenges: string;
        techStack: TechStackCategory[];
        allowIframe?: boolean;
       }

    const project = computed(() => projectsData[slug as keyof typeof projectsData] as unknown as Project);

    // Get related projects (excluding current project)
    const relatedProjects = computed(() => {
        const allProjects = Object.entries(projectsData).map(([s, data]) => ({
            ...data,
            slug: s
        }));

        return allProjects.filter((p) => p.slug !== slug).slice(0, 3);
    });

    useHead(() => ({
        title: project.value
            ? `${project.value.title} - Abdulmuiz Farayola`
            : "Project Not Found",
        meta: [
            {
                name: "description",
                content: project.value
                    ? project.value.description
                    : "Project not found",
            },
        ],
    }));
</script>
