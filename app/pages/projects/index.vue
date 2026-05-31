<template>
    <div class="min-h-screen ">
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
        
        <!-- Projects Grid -->
        <section class="section-padding relative">
            <div id="card" class="container-width ">
                <!-- Large screen: full width alternating layout -->
                <div class=" space-y-12">
                    <div 
                        v-for="(project, index) in filteredProjects"
                        :key="project.slug"
                        class="card-wrapper animate-fade-in-up"
                        :style="{ animationDelay: `${index * 0.1}s` }"
                    >
                        <ProjectCard
                            :project="project"
                            :reverse="index % 2 === 1"
                            class="card"
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
    import gsap from 'gsap';
    import { ScrollTrigger } from "gsap/ScrollTrigger";
    import DotField from "~/components/DotField.vue";

    // const projectsContainer = ref(null);

    const activeFilter = ref("All");

    import projectsData from '~/public/projects.json';

    const projects = Object.entries(projectsData).map(([slug, data]) => ({
        ...data,
        slug
    }));

    const categories = computed(() => {
        const cats = new Set<string>();
        projects.forEach(p => {
            if (Array.isArray(p.category)) {
                p.category.forEach(c => cats.add(c));
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

    let scrollTriggerInstances: globalThis.ScrollTrigger[] = [];

    const killAnimations = () => {
        // Kill existing ScrollTriggers to remove pins and spacers
        scrollTriggerInstances.forEach(st => st.kill(true));
        scrollTriggerInstances = [];

        // Clear inline transforms left behind by GSAP tweens
        const cards = gsap.utils.toArray(".card");
        if (cards.length) {
            gsap.killTweensOf(cards);
            // Only clear what GSAP changed to preserve Vue's animation-delay
            gsap.set(cards, { clearProps: "scale,rotationX,transformOrigin,transform" });
        }
    };

    const initAnimations = () => {
        if (!import.meta.client) return;

        killAnimations();

        const cardsSection = document.getElementById("card");
        const cardsWrappers = gsap.utils.toArray(".card-wrapper");
        const cards = gsap.utils.toArray(".card");
    
        cardsWrappers.forEach((wrapper, i) => {
            const card = cards[i];
            let scale = 1,
                rotation = 0;
            if (i !== cards.length - 1) {
                scale = 0.9 + 0.025 * i;
                rotation = -10;
            }
            if (cardsSection) {
                gsap.to(card as gsap.TweenTarget, {
                    scale: scale,
                    rotationX: rotation,
                    transformOrigin: "top center",
                    ease: "none",
                    scrollTrigger: {
                        trigger: wrapper as gsap.DOMTarget,
                        start: "top " + (60 + 10 * i),
                        end: "bottom 550",
                        endTrigger: ".wrapper",
                        scrub: true,
                        pin: wrapper as gsap.DOMTarget,
                        pinSpacing: false,
                        id: (i + 1).toString()
                    }
                });
                
                // Store the ScrollTrigger instance to kill it later
                const st = ScrollTrigger.getById((i + 1).toString());
                if (st) scrollTriggerInstances.push(st);
            }
        });
        
        ScrollTrigger.refresh();
    };

    onMounted(() => {
        if(import.meta.client) {
            gsap.registerPlugin(ScrollTrigger);
            initAnimations();
        }
    });

    watch(filteredProjects, async () => {
        killAnimations(); // Clean up BEFORE Vue updates DOM
        await nextTick(); // Wait for Vue to render new items
        initAnimations(); // Re-initialize with new items
    });

    onUnmounted(() => {
        killAnimations();
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
        activeFilter
    });
</script>
