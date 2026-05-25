<template>
    <header
        :class="[
            'fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out',
            isScrolled && !isNearFooter
                ? 'py-2' 
                : 'py-0'
        ]"
    >
        <nav
            :class="[
                'transition-all duration-500 ease-out backdrop-blur-md border border-green-700 dark:border-green-600',
                isScrolled && !isNearFooter
                    ? 'mx-auto w-[90%] lg:w-[80%] rounded-2xl shadow-lg shadow-green-900/20 bg-primary dark:bg-transparent' 
                    : 'w-full rounded-none border-t-0 border-l-0 border-r-0 bg-primary dark:bg-green-900'
            ]"
            class="h px-6 lg:px-10"
        >
            <div class="flex items-center justify-between h-16">
                <NuxtLink
                    to="/"
                    class="text-base md:text-xl font-bold text-green-100 hover:text-white transition-all duration-300"
                >
                    Abdulmuiz Farayola
                </NuxtLink>

                <div class="hidden md:flex items-center space-x-8">
                    <NuxtLink
                        to="/"
                        class="text-green-200 hover:text-white transition-colors duration-300"
                        active-class="text-white"
                    >
                        Home
                    </NuxtLink>
                    <NuxtLink
                        to="/projects"
                        class="text-green-200 hover:text-white transition-colors duration-300"
                        active-class="text-white"
                    >
                        Projects
                    </NuxtLink>
                    <NuxtLink
                        to="/contact"
                        class="text-green-200 hover:text-white transition-colors duration-300"
                        active-class="text-white"
                    >
                        Contact
                    </NuxtLink>

                    <!-- Dark Mode Toggle -->
                    <ClientOnly>
                        <button
                            @click="toggleDarkMode"
                            class="p-2 text-green-200 hover:text-white transition-colors duration-300 rounded-lg hover:bg-green-700/50"
                            :title="
                                isDark
                                    ? 'Switch to light mode'
                                    : 'Switch to dark mode'
                            "
                        >
                            <Sun v-if="isDark" class="w-5 h-5" />
                            <Moon v-else class="w-5 h-5" />
                        </button>
                        <template #fallback>
                            <div class="p-2 w-9 h-9"></div>
                        </template>
                    </ClientOnly>
                </div>

                <div class="md:hidden flex items-center space-x-2">
                    <!-- Mobile Dark Mode Toggle -->
                    <ClientOnly>
                        <button
                            @click="toggleDarkMode"
                            class="p-2 text-green-200 hover:text-white transition-colors duration-300"
                        >
                            <Sun v-if="isDark" class="w-5 h-5" />
                            <Moon v-else class="w-5 h-5" />
                        </button>
                        <template #fallback>
                            <div class="p-2 w-9 h-9"></div>
                        </template>
                    </ClientOnly>

                    <button
                        @click="toggleMobileMenu"
                        class="p-2 text-green-200 hover:text-white transition-colors duration-300"
                    >
                        <Menu v-if="!isMobileMenuOpen" class="w-6 h-6" />
                        <X v-else class="w-6 h-6" />
                    </button>
                </div>
            </div>

            <!-- Mobile menu -->
            <div
                v-show="isMobileMenuOpen"
                class="md:hidden py-4"
            >
                <div class="flex flex-col space-y-4 px-4">
                    <NuxtLink
                        to="/"
                        @click="closeMobileMenu"
                        class="text-green-200 hover:text-white transition-colors duration-300"
                        active-class="text-white"
                    >
                        Home
                    </NuxtLink>
                    <NuxtLink
                        to="/projects"
                        @click="closeMobileMenu"
                        class="text-green-200 hover:text-white transition-colors duration-300"
                        active-class="text-white"
                    >
                        Projects
                    </NuxtLink>
                    <NuxtLink
                        to="/contact"
                        @click="closeMobileMenu"
                        class="text-green-200 hover:text-white transition-colors duration-300"
                        active-class="text-white"
                    >
                        Contact
                    </NuxtLink>
                </div>
            </div>
        </nav>
    </header>
</template>

<script setup>
import { Menu, X, Sun, Moon } from "lucide-vue-next";
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

const isMobileMenuOpen = ref(false);
const isScrolled = ref(false);
const isNearFooter = ref(false);
const colorMode = useColorMode();

const isDark = computed(() => colorMode.value === "dark");

const toggleDarkMode = () => {
    colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
};

const toggleMobileMenu = () => {
    isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const closeMobileMenu = () => {
    isMobileMenuOpen.value = false;
};

const handleScroll = () => {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    
    // Check if scrolled past threshold
    isScrolled.value = scrollY > 50;
    
    // Check if near footer (within 200px of bottom)
    const distanceFromBottom = documentHeight - (scrollY + windowHeight);
    isNearFooter.value = distanceFromBottom < 50;
};

onMounted(() => {
    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial scroll position
});

onBeforeUnmount(() => {
    window.removeEventListener("scroll", handleScroll);
});
</script>