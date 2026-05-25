<template>
    <section class="section-padding bg-[#8EB69B] dark:bg-gray-900 relative mx-5 sm:mx-10 my-12 rounded-3xl shadow-md">
        <div class="container-width">
            <div class="text-center animate-fade-in-up">
                <h2
                    class="text-4xl font-bold mb-4 text-primary dark:text-green-200"
                >
                    Skills & Technologies
                </h2>
                <p
                    class="text-green-600 dark:text-green-400 text-lg max-w-2xl mx-auto"
                >
                    Here are some of the technologies and tools I work with
                    to bring ideas to life
                </p>
            </div>

            <!-- Filter -->
            <div class="container-width my-8">
                <div
                    class="flex flex-wrap justify-center gap-4 animate-fade-in-up"
                    style="animation-delay: 0.4s"
                >
                    <button
                        v-for="category in categories"
                        :key="category"
                        @click="activeFilter = category"
                        :class="[
                            'px-4 py-2 rounded-lg transition-all duration-300 capitalize',
                            activeFilter === category
                                ? 'bg-primary dark:bg-green-600 text-white'
                                : 'bg-white dark:bg-gray-700 text-primary dark:text-green-300 hover:bg-green-50 dark:hover:bg-gray-600 border border-green-200 dark:border-gray-600',
                        ]"
                    >
                        {{ category }}
                    </button>
                </div>
            </div>

            <div
                class="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-9 gap-6"
            >
                <div
                    v-for="(skill, index) in filteredSkills"
                    :key="skill.name"
                    class=" text-center group hover:scale-105 animate-fade-in-up"
                    :style="{ animationDelay: `${index * 0.1}s` }"
                >
                    <div
                        class="w-10 h-10 mx-auto mb-3 p-2 rounded-lg bg-green-100 dark:bg-primary"
                    >
                        <div
                            class="w-full h-full rounded grid place-items-center"
                        >
                            <img :src="skill.icon" :alt="skill.name" />
                        </div>
                    </div>
                    <h3
                        class="font-medium text-xs md:text-sm text-primary dark:text-green-200"
                    >
                        {{ skill.name }}
                    </h3>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
    import { 
        angular,
        bootstrap,
        css,
        docker,
        dotnet,
        express,
        figma,
        gcp,
        git,
        html,
        javascript,
        jquery,
        mongoDb,
        mui,
        next,
        nodejs,
        nuxt,
        office,
        postgreSql,
        react,
        reactNative,
        sass,
        supabase,
        svelte,
        tailwind,
        typescript,
        vue,
        flutter
    } from '~/assets/icons';

    const activeFilter = ref("All")

    const skills = [
        { name: "JavaScript", icon: javascript, category: "frontend" },
        { name: "TypeScript", icon: typescript, category: "frontend" },
        { name: "HTML5", icon: html, category: "frontend" },
        { name: "CSS3", icon: css, category: "frontend" },
        { name: "React", icon: react, category: "frontend" },
        { name: "Next", icon: next, category: "frontend" },
        { name: "Vue.js", icon: vue, category: "frontend" },
        { name: "Nuxt", icon: nuxt, category: "frontend" },
        { name: "Angular", icon: angular, category: "frontend" },
        // { name: "Svelte", icon: svelte, category: "frontend" },
        { name: "React Native", icon: reactNative, category: "frontend" },
        { name: "Flutter", icon: flutter, category: "frontend" },
        { name: "jQuery", icon: jquery, category: "frontend" },
        { name: "SASS", icon: sass, category: "frontend" },
        { name: "TailwindCss", icon: tailwind, category: "frontend" },
        { name: "BootStrap", icon: bootstrap, category: "frontend" },
        { name: "Material UI", icon: mui, category: "frontend" },
        { name: "Node.js", icon: nodejs, category: "backend" },
        { name: "Express.js", icon: express, category: "backend" },
        { name: ".Net", icon: dotnet, category: "backend" },
        { name: "PostgreSQL", icon: postgreSql, category: "backend" },
        { name: "MongoDB", icon: mongoDb, category: "backend" },
        { name: "Supabase", icon: supabase, category: "backend" },
        { name: "GCP", icon: gcp, category: "cloud & tools" },
        { name: "Docker", icon: docker, category: "cloud & tools" },
        { name: "Figma", icon: figma, category: "cloud & tools" },
        { name: "Git", icon: git, category: "cloud & tools" },
        { name: "Office365", icon: office, category: "cloud & tools" },
    ];

    const categories = computed(() => {
        const cats = new Set<string>();
        skills.forEach(p => {
            if (Array.isArray(p.category)) {
                p.category.forEach(c => cats.add(c));
            } else if (p.category) {
                cats.add(p.category);
            }
        });
        return ["All", ...Array.from(cats)];
    });

    const filteredSkills = computed(() => {
        if (activeFilter.value === "All") {
            return skills;
        }
        return skills.filter((skill) => {
            if (Array.isArray(skill.category)) {
                return skill.category.includes(activeFilter.value);
            }
            return skill.category === activeFilter.value;
        });
    });
</script>