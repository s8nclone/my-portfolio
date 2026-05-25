<template>
    <section id="about" class="section-padding bg-white dark:bg-gray-800 relative rounded-3xl shadow-xl mx-5 sm:mx-10 mb-10 my-20">
        <div class="container-width relative z-20">
            <div
                class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
            >
                <div class="animate-fade-in-left">
                    <h2
                        class="text-4xl font-bold mb-6 text-primary dark:text-green-200"
                    >
                        About Me
                    </h2>
                    <p
                        class="text-green-700 dark:text-green-300 text-lg mb-6 leading-relaxed"
                    >
                        I'm a passionate Frontend-focused Software Engineer with over 4
                        years of experience building scalable web
                        applications. I specialize in modern JavaScript
                        frameworks, cloud technologies, and creating
                        seamless user experiences.
                    </p>
                    <p
                        class="text-green-700 dark:text-green-300 text-lg mb-8 leading-relaxed"
                    >
                        When I'm not coding, you'll find me exploring new
                        technologies, contributing to open source projects,
                        or sharing knowledge with the developer community
                        through blog posts or enjoying football.
                    </p>
                    <div class="flex flex-wrap gap-4">
                        <div
                            class="flex items-center text-green-700 dark:text-green-300"
                        >
                            <Code
                                class="w-5 h-5 mr-2 text-green-600 dark:text-green-400"
                            />
                            <span>4+ Years Experience</span>
                        </div>
                        <div
                            class="flex items-center text-green-700 dark:text-green-300"
                        >
                            <Users
                                class="w-5 h-5 mr-2 text-green-600 dark:text-green-400"
                            />
                            <span>10+ Projects Completed</span>
                        </div>
                        <div
                            class="flex items-center text-green-700 dark:text-green-300"
                        >
                            <Award
                                class="w-5 h-5 mr-2 text-green-600 dark:text-green-400"
                            />
                            <span>Industry Recognition</span>
                        </div>
                    </div>

                    <button class="btn-primary mt-6">
                        <a
                            href="https://drive.google.com/file/d/11QYW6ImEty1pzZcjOPs9fQ-aJAGblowK/view?usp=sharing" 
                            target="_blank"
                            aria-label="download cv"
                            class="flex items-center gap-2"
                        >
                            <Download class="w-5 h-5" />
                            Download CV
                        </a>
                    </button>
                </div>

                <div class="animate-fade-in-right">
                    <div class="grid grid-cols-2 gap-4">
                        <div class="card">
                            <Globe
                                class="w-8 h-8 text-green-600 dark:text-green-400 mb-3"
                            />
                            <h3
                                class="font-semibold mb-2 text-primary dark:text-green-200"
                            >
                                Frontend
                            </h3>
                            <p
                                class="text-green-600 dark:text-green-400 text-sm"
                            >
                                React, Next, Vue, Nuxt, Angular, TypeScript, Tailwind CSS, SASS, Zustand
                            </p>
                        </div>
                        <div class="card">
                            <Server
                                class="w-8 h-8 text-green-600 dark:text-green-400 mb-3"
                            />
                            <h3
                                class="font-semibold mb-2 text-primary dark:text-green-200"
                            >
                                Backend
                            </h3>
                            <p
                                class="text-green-600 dark:text-green-400 text-sm"
                            >
                                C#, .NET, Node.js, Express, Supabase, PostgreSQL, MySQL, MongoDB, Prisma, Mongoose
                            </p>
                        </div>
                        <div class="card">
                            <Cloud
                                class="w-8 h-8 text-green-600 dark:text-green-400 mb-3"
                            />
                            <h3
                                class="font-semibold mb-2 text-primary dark:text-green-200"
                            >
                                Cloud
                            </h3>
                            <p
                                class="text-green-600 dark:text-green-400 text-sm"
                            >
                                GCP, Docker, CI/CD
                            </p>
                        </div>
                        <div class="card">
                            <Smartphone
                                class="w-8 h-8 text-green-600 dark:text-green-400 mb-3"
                            />
                            <h3
                                class="font-semibold mb-2 text-primary dark:text-green-200"
                            >
                                Mobile
                            </h3>
                            <p
                                class="text-green-600 dark:text-green-400 text-sm"
                            >
                                React Native, Flutter, PWAs
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
    import {
        Code,
        Users,
        Award,
        Globe,
        Server,
        Cloud,
        Smartphone,
        Download,
    } from "lucide-vue-next";
</script>