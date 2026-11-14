<template>
    <div class="min-h-screen">
        <!-- Header -->
        <section class="section-padding hero-section relative rounded-b-[4rem] h-[70dvh] flex items-center overflow-hidden">
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
                <h1
                    class="text-3xl md:text-5xl font-bold mb-6 animate-fade-in-up text-white"
                >
                    My Projects
                </h1>
                <p
                    class="text-xl text-green-200 max-w-3xl mx-auto animate-fade-in-up"
                    style="animation-delay: 0.2s"
                >
                    A collection of projects that showcase my skills in
                    software development, from concept to deployment
                </p>
            </div>
        </section>

        <!-- Filter -->
        <section class="py-4 relative">
            <div class="container-width mt-12">
                <div
                    class="flex flex-wrap justify-center gap-4 animate-fade-in-up"
                    style="animation-delay: 0.4s"
                >
                    <button
                        v-for="category in categories"
                        :key="category"
                        @click="activeFilter = category"
                        :class="[
                             'px-4 py-2 rounded-lg transition-all duration-300',
                             activeFilter === category
                                 ? 'bg-green-700 dark:bg-green-600 text-white'
                                 : 'bg-white dark:bg-gray-700 text-green-700 dark:text-green-300 hover:bg-green-50 dark:hover:bg-gray-600 border border-green-200 dark:border-gray-600',
                        ]"
                    >
                        {{ category }}
                    </button>
                </div>
            </div>
        </section>

        <!-- Projects Stack -->
        <section class="section-padding relative">
            <div id="projects-stack" class="container-width">
                <!-- Stacking cards -->
                <div class="flex flex-col max-w-6xl mx-auto" v-if="filteredProjects.length > 0">
                    <div
                        v-for="(project, index) in filteredProjects"
                        :key="project.slug"
                        class="project-card-wrapper"
                        :style="{
                            position: 'sticky',
                            top: `calc(12vh + ${index * 36}px)`,
                            zIndex: index + 1,
                            marginBottom: index < filteredProjects.length - 1 ? '22vh' : '15vh',
                            transformOrigin: 'top center',
                            transform: 'translateZ(0) scale(1)',
                            backfaceVisibility: 'hidden',
                            perspective: '1000px',
                        }"
                    >
                        <ProjectCard
                            :project="project"
                            :reverse="index % 2 === 1"
                            class="project-card"
                        />
                    </div>
                </div>

                <div
                    v-if="filteredProjects.length === 0"
                    class="text-center py-20"
                >
                    <p class="text-green-600 dark:text-green-400 text-lg">
                        No projects found for the selected category.
                    </p>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
    import gsap from "gsap";
    import { ScrollTrigger } from "gsap/ScrollTrigger";
    import DotField from "~/components/DotField.vue";
    import projectsData from "@@/public/projects.json";

    const activeFilter = ref("All");

    const projects = Object.entries(projectsData).map(([slug, data]) => ({
        ...data,
        slug,
    }));

    const categories = computed(() => {
        const cats = new Set<string>();
        projects.forEach((p) => {
            if (Array.isArray(p.category)) {
                p.category.forEach((c) => cats.add(c));
            } else if (p.category) {
                cats.add(p.category);
            }
        });
        return ["All", ...Array.from(cats)];
    });

    const filteredProjects = computed(() => {
        if (activeFilter.value === "All") {
            return projects;
        }
        return projects.filter((project) => {
            if (Array.isArray(project.category)) {
                return project.category.includes(activeFilter.value);
            }
            return project.category === activeFilter.value;
        });
    });

    let ctx: ReturnType<typeof gsap.context> | null = null;

    const killAnimations = () => {
        if (ctx) {
            ctx.revert();
            ctx = null;
        }
    };

    const initAnimations = () => {
        if (!import.meta.client) return;

        killAnimations();

        ctx = gsap.context(() => {
            const wrappers = gsap.utils.toArray<HTMLElement>(".project-card-wrapper");

            if (wrappers.length === 0) return;

            const scaleStep = 0.025;
            const minScale = 0.8;

            const scaleMap = new Map<number, Array<{ start: number; end: number }>>();

            for (let j = 0; j < wrappers.length; j++) {
                if (j === 0) continue;

                const scales: Array<{ start: number; end: number }> = [];
                for (let i = 0; i < j; i++) {
                    const startScale = Math.max(minScale, 1 - (j - 1 - i) * scaleStep);
                    const endScale = Math.max(minScale, 1 - (j - i) * scaleStep);
                    scales.push({ start: startScale, end: endScale });
                }
                scaleMap.set(j, scales);
            }

            wrappers.forEach((wrapper, j) => {
                if (j === 0) return;

                const scales = scaleMap.get(j);
                if (!scales) return;

                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: wrapper,
                        start: "top 85%",
                        end: `top calc(8vh + ${j * 36}px)`,
                        scrub: 1,
                        markers: false,
                    },
                });

                scales.forEach((scale, i) => {
                    const targetWrapper = wrappers[i];
                    if (targetWrapper) {
                        tl.to(
                            targetWrapper,
                            { scale: scale.end, ease: "none" },
                            0
                        );
                    }
                });
            });

            ScrollTrigger.refresh();
        });
    };

    const debouncedInitAnimations = useDebounceFn(() => {
        initAnimations();
    }, 300);

    onMounted(() => {
        if (import.meta.client) {
            gsap.registerPlugin(ScrollTrigger);

            const wrappers = document.querySelectorAll(".project-card-wrapper");
            wrappers.forEach((wrapper) => {
                (wrapper as HTMLElement).style.willChange = "transform";
            });

            nextTick(() => {
                setTimeout(() => {
                    initAnimations();
                }, 50);
            });
        }
    });

    watch(
        filteredProjects,
        () => {
            debouncedInitAnimations();
        },
        { immediate: false }
    );

    onUnmounted(() => {
        killAnimations();

        const wrappers = document.querySelectorAll(".project-card-wrapper");
        wrappers.forEach((wrapper) => {
            (wrapper as HTMLElement).style.willChange = "auto";
        });
    });

    useHead({
        title: "Projects - Abdulmuiz Farayola",
        meta: [
            {
                name: "description",
                content:
                    "Browse my portfolio of software development projects including web applications, mobile apps, and APIs projects.",
            },
        ],
    });

    defineExpose({
        activeFilter,
    });
</script>
