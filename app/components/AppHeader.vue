<template>
    <!-- Desktop / global fixed header -->
    <header
        :class="[
            'fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out',
            isScrolled && !isNearFooter ? 'py-2' : 'py-0',
        ]"
    >
        <nav
            :class="[
                'transition-all duration-500 ease-out backdrop-blur-md border border-green-700 dark:border-green-600 relative',
                isScrolled && !isNearFooter
                    ? 'mx-auto w-[90%] lg:w-[80%] rounded-2xl shadow-lg shadow-green-900/20 bg-primary dark:bg-transparent'
                    : 'w-full rounded-none border-t-0 border-l-0 border-r-0 bg-primary dark:bg-green-900',
            ]"
            class="px-6 lg:px-10"
        >
            <div class="flex items-center justify-between h-16">
                <!-- Logo / Name -->
                <NuxtLink
                    to="/"
                    class="text-base md:text-xl font-bold text-green-100 hover:text-white transition-all duration-300 z-10"
                >
                    Abdulmuiz Farayola
                </NuxtLink>

                <!-- Desktop nav links -->
                <div class="hidden md:flex items-center space-x-8">
                    <NuxtLink
                        to="/"
                        class="text-green-200 hover:text-white transition-colors duration-300"
                        active-class="text-white"
                    >Home</NuxtLink>
                    <NuxtLink
                        to="/about"
                        class="text-green-200 hover:text-white transition-colors duration-300"
                        active-class="text-white"
                    >About</NuxtLink>
                    <NuxtLink
                        to="/projects"
                        class="text-green-200 hover:text-white transition-colors duration-300"
                        active-class="text-white"
                    >Projects</NuxtLink>
                    <NuxtLink
                        to="/contact"
                        class="text-green-200 hover:text-white transition-colors duration-300"
                        active-class="text-white"
                    >Contact</NuxtLink>

                    <!-- Desktop Dark Mode Toggle -->
                    <ClientOnly>
                        <button
                            @click="toggleDarkMode"
                            class="p-2 text-green-200 hover:text-white transition-colors duration-300 rounded-lg hover:bg-green-700/50"
                            :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
                        >
                            <Sun v-if="isDark" class="w-5 h-5" />
                            <Moon v-else class="w-5 h-5" />
                        </button>
                        <template #fallback><div class="p-2 w-9 h-9" /></template>
                    </ClientOnly>
                </div>

                <!-- Mobile: only dark mode toggle (hamburger is in StaggeredMenu overlay) -->
                <div class="md:hidden flex items-center mr-16">
                    <ClientOnly>
                        <button
                            @click="toggleDarkMode"
                            class="p-2 text-green-200 hover:text-white transition-colors duration-300"
                            :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
                        >
                            <Sun v-if="isDark" class="w-5 h-5" />
                            <Moon v-else class="w-5 h-5" />
                        </button>
                        <template #fallback><div class="p-2 w-9 h-9" /></template>
                    </ClientOnly>
                </div>
            </div>
        </nav>
    </header>

    <!-- Mobile Staggered Menu — full-screen fixed overlay, hidden on md+ -->
    <ClientOnly>
        <StaggeredMenu
            class="md:hidden"
            position="right"
            :colors="['#064e3b', '#10b981']"
            :items="navItems"
            :social-items="socialItems"
            :display-socials="true"
            :display-item-numbering="true"
            accent-color="#10b981"
            menu-button-color="#ffffff"
            open-menu-button-color="#ffffff"
            :change-menu-color-on-open="true"
            :close-on-click-away="true"
        />
    </ClientOnly>
</template>

<script setup lang="ts">
    import { Sun, Moon } from 'lucide-vue-next';
    import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
    import StaggeredMenu from '~/components/StaggeredMenu.vue';

    // ─── Nav data ────────────────────────────────────────────────────────────────

    const navItems = [
        { label: 'Home',     ariaLabel: 'Go to home page',     link: '/'         },
        { label: 'About',    ariaLabel: 'About me',             link: '/about'    },
        { label: 'Projects', ariaLabel: 'View my projects',     link: '/projects' },
        { label: 'Contact',  ariaLabel: 'Get in touch with me', link: '/contact'  },
    ];

    const socialItems = [
        { label: 'LinkedIn', link: 'https://www.linkedin.com/in/abdulmuiz-dayo-farayola-/' },
        { label: 'GitHub',   link: 'https://github.com/s8nclone'                          },
        { label: 'Dev.to',   link: 'https://dev.to/technvernacular'                       },
        { label: 'X',        link: 'https://x.com/middleS8n'                              },
    ];

    // ─── Dark mode ────────────────────────────────────────────────────────────────

    const colorMode = useColorMode();
    const isDark    = computed(() => colorMode.value === 'dark');
    const toggleDarkMode = () => {
        colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark';
    };

    // ─── Scroll state ─────────────────────────────────────────────────────────────

    const isScrolled   = ref(false);
    const isNearFooter = ref(false);

    const handleScroll = () => {
        const scrollY         = window.scrollY;
        const windowHeight    = window.innerHeight;
        const documentHeight  = document.documentElement.scrollHeight;
        isScrolled.value      = scrollY > 50;
        isNearFooter.value    = documentHeight - (scrollY + windowHeight) < 50;
    };

    onMounted(() => {
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
    });

    onBeforeUnmount(() => {
        window.removeEventListener('scroll', handleScroll);
    });
</script>