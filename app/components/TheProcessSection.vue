<template>
    <section id="process" class="section-padding relative">
        <div class="container-width relative z-20">
            <div class="text-center mb-20 animate-fade-in-up">
                <h2 class="text-4xl font-bold mb-4 text-primary dark:text-green-200">
                    The Development Process
                </h2>
                <p class="text-green-700 dark:text-green-300 text-lg max-w-2xl mx-auto leading-relaxed">
                    A systematic, transparent, and user-centric workflow designed to turn ideas into reliable production software.
                </p>
            </div>

            <!-- Timeline Container -->
            <div class="relative wrap overflow-hidden p-10 h-full">
                <!-- Center Line (Desktop) -->
                <div class="border-2 absolute border-opacity-20 border-green-700 dark:border-green-600 h-full border-dashed left-1/2 -translate-x-1/2 hidden md:block z-0"></div>
                <!-- Left Line (Mobile) -->
                <div class="border-2 absolute border-opacity-20 border-green-700 dark:border-green-600 h-full border-dashed left-4 md:hidden z-0"></div>

                <div 
                    v-for="(step, index) in steps" 
                    :key="step.number"
                    class="mb-12 flex justify-between items-center w-full relative z-10"
                    :class="[
                        index % 2 === 0 ? 'md:flex-row-reverse' : 'md:flex-row',
                        'flex-row'
                    ]"
                >
                    <!-- Spacing Column (Desktop Only) -->
                    <div class="order-1 w-5/12 hidden md:block"></div>

                    <!-- Timeline Marker Pin -->
                    <div 
                        class="z-20 flex items-center order-1 bg-green-700 dark:bg-green-600 text-white w-10 h-10 rounded-full shadow-xl justify-center scale-90 md:scale-100 absolute left-4 md:left-1/2 md:-translate-x-1/2"
                    >
                        <component :is="step.icon" class="w-5 h-5" />
                    </div>

                    <!-- Card Column -->
                    <div 
                        class="order-1 w-full md:w-5/12 pl-12 md:pl-0"
                    >
                        <div 
                            class="card group p-6 bg-white dark:bg-gray-800 border border-green-50 dark:border-green-950/20 hover:border-green-400 dark:hover:border-green-700 transition-all duration-300 hover:scale-[1.02] cursor-default"
                        >
                            <span class="text-xs font-mono font-bold tracking-wider text-green-600 dark:text-green-400 uppercase">
                                Phase {{ step.number }}
                            </span>
                            
                            <h3 class="text-xl font-bold mt-1 mb-3 text-primary dark:text-green-200">
                                {{ step.title }}
                            </h3>
                            
                            <p class="text-green-700 dark:text-green-300 text-sm leading-relaxed mb-4">
                                {{ step.description }}
                            </p>

                            <!-- Subtasks checklist -->
                            <ul class="space-y-2 border-t border-green-50 dark:border-green-900/30 pt-3">
                                <li 
                                    v-for="sub in step.checklist" 
                                    :key="sub"
                                    class="flex items-center text-xs text-green-600 dark:text-green-400"
                                >
                                    <span class="w-1.5 h-1.5 rounded-full bg-green-500 dark:bg-green-400 mr-2 flex-shrink-0"></span>
                                    <span>{{ sub }}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { 
    Search, 
    Compass, 
    Code2, 
    Rocket, 
    Activity 
} from "lucide-vue-next";

const steps = [
    {
        number: "01",
        title: "Research & Discovery",
        description: "Defining scope, establishing project goals, and analyzing constraints. Aligning on user personas, user stories, and high-level requirements.",
        icon: Search,
        checklist: [
            "Requirement mapping workshops",
            "User stories & specs creation",
            "Tech stack feasibility assessment"
        ]
    },
    {
        number: "02",
        title: "Architecture & Design",
        description: "Modeling data structures, charting component diagrams, detailing API contracts, and planning out user journeys/UX flow outlines.",
        icon: Compass,
        checklist: [
            "DB schema design & relationships",
            "API endpoint contracts planning",
            "Component relationships layout"
        ]
    },
    {
        number: "03",
        title: "Agile Development",
        description: "Coding structured, type-safe modules using React/Vue and Node/.NET. Writing test logic concurrently for reliable unit outcomes.",
        icon: Code2,
        checklist: [
            "Strict TypeScript & clean rules",
            "Modular code & atomic components",
            "Continuous unit & integration tests"
        ]
    },
    {
        number: "04",
        title: "Deployment & CI/CD",
        description: "Configuring automated builds, linters, and checkers. Packaging code into containers and managing environment-based pipeline staging.",
        icon: Rocket,
        checklist: [
            "Automated builds & pipeline checks",
            "Environment-based config profiles",
            "Zero-downtime blue/green deployment"
        ]
    },
    {
        number: "05",
        title: "Maintenance & Scale",
        description: "Tracking application execution with telemetry. Auditing DB index usage, tuning response metrics, and patching system updates regularly.",
        icon: Activity,
        checklist: [
            "Real-time telemetry & error logs",
            "DB querying performance tuning",
            "System dependency patch upgrades"
        ]
    }
];
</script>
