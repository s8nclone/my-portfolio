<template>
    <section
        id="projects-section"
        class="section-padding"
    >
        <div class="container-width">
            <div class="text-center mb-16 animate-fade-in-up">
                <h2
                    class="text-4xl font-bold mb-4 text-primary dark:text-green-200"
                >
                    Featured Projects
                </h2>
                <p
                    class="text-green-600 dark:text-green-400 text-lg max-w-2xl mx-auto"
                >
                    A selection of recent projects that showcase my skills
                    and passion for development
                </p>
            </div>

            <!-- Horizontal scrolling container for large screens -->
            <div id="featured-projects" class="h-[85dvh] mb-12 relative overflow-hidden">
                <div
                    ref="projectsContainer"
                    class="flex gap-8 will-change-transform transition-transform duration-100"
                >
                    <FeaturedProjectCard
                        v-for="(project, index) in featuredProjects"
                        :key="project.slug"
                        :project="project"
                        class="flex-shrink-0 w-[70vw] h-[50vh] animate-fade-in-up"
                        :style="{ animationDelay: `${index * 0.2}s` }"
                    />
                </div>
            </div>

            <!-- Regular grid for smaller screens -->
            <div class="text-center animate-fade-in-up">
                <NuxtLink to="/projects" class="btn-primary">
                    View All Projects
                </NuxtLink>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
    import { gsap } from "gsap";
    import { ScrollTrigger } from "gsap/ScrollTrigger";

    const projectsContainer = ref(null);
    let scrollTriggerInstance: globalThis.ScrollTrigger | null = null;

    import projectsData from '~/public/projects.json';

    const featuredSlugs: Array<keyof typeof projectsData> = ["amalacloud", "teeketing", "transactease", "greenfield-university-portal"];
    const featuredProjects = featuredSlugs.map(slug => ({
        ...projectsData[slug],
        slug
    }));

    onMounted(() => {
        if (import.meta.client) {
            gsap.registerPlugin(ScrollTrigger);

            const projectsSection = document.getElementById("featured-projects");
            // const projectsSection = document.getElementById("projects-section");
            const projectsContainerEl = projectsContainer.value;

            if (projectsSection && projectsContainerEl) {
                scrollTriggerInstance = ScrollTrigger.create({
                    trigger: projectsSection,
                    start: "top 20%",
                    end: () => `+=${window.innerHeight * 2}`, // Scroll distance for animation
                    pin: true,
                    scrub: 1,
                    onUpdate: (self) => {
                        const progress = self.progress;
                        const cardWidth = window.innerWidth * 0.80 + 32; // 70vw + gap
                        const maxScroll = (featuredProjects.length - 0.3) * cardWidth;

                        if (projectsContainerEl) {
                            gsap.set(projectsContainerEl, {
                                x: -progress * maxScroll,
                            });
                        }
                    },
                });
            }
        }
    });

        onUnmounted(() => {
            if (scrollTriggerInstance) {
                scrollTriggerInstance.kill();
            }
        });
</script>