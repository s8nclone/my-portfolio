<template>
    <Transition name="scroll-fade">
        <button
            v-show="visible"
            @click="scrollToTop"
            class="fixed bottom-8 right-8 z-50 flex items-center justify-center w-12 h-12 rounded-full bg-white dark:bg-gray-800 shadow-xl border border-green-100 dark:border-gray-700 hover:scale-110 active:scale-95 hover:shadow-2xl transition-all duration-300 group"
            aria-label="Scroll to top"
        >
            <!-- SVG Progress Ring -->
            <svg class="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 48 48">
                <!-- Background Circle Track -->
                <circle
                    cx="24"
                    cy="24"
                    r="20"
                    fill="transparent"
                    stroke="currentColor"
                    class="text-green-50 dark:text-green-950/40"
                    stroke-width="3.5"
                />
                <!-- Progressive Active Progress Circle -->
                <circle
                    cx="24"
                    cy="24"
                    r="20"
                    fill="transparent"
                    stroke="currentColor"
                    class="text-green-700 dark:text-green-500 transition-all duration-75"
                    stroke-width="3.5"
                    :stroke-dasharray="circumference"
                    :stroke-dashoffset="strokeDashoffset"
                    stroke-linecap="round"
                />
            </svg>
            
            <!-- Arrow Up Icon -->
            <ArrowUp class="w-6 h-6 text-green-700 dark:text-green-400 group-hover:-translate-y-1 transition-transform duration-300 z-10" />
        </button>
    </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import { ArrowUp } from 'lucide-vue-next';

const scrollY = ref(0);
const visible = ref(false);

const radius = 20;
const circumference = 2 * Math.PI * radius; // ~125.66

const handleScroll = () => {
    if (typeof window === 'undefined') return;
    scrollY.value = window.scrollY;
    visible.value = window.scrollY > window.innerHeight; // 100dvh
};

const scrollPercent = computed(() => {
    if (typeof window === 'undefined') return 0;
    const documentHeight = document.documentElement.scrollHeight;
    const windowHeight = window.innerHeight;
    const scrollableHeight = documentHeight - windowHeight;
    if (scrollableHeight <= 0) return 0;
    return Math.min(Math.max(scrollY.value / scrollableHeight, 0), 1);
});

const strokeDashoffset = computed(() => {
    return circumference - (scrollPercent.value * circumference);
});

const scrollToTop = () => {
    if (typeof window === 'undefined') return;
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
};

onMounted(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Trigger initially
});

onBeforeUnmount(() => {
    window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
.scroll-fade-enter-active,
.scroll-fade-leave-active {
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.scroll-fade-enter-from,
.scroll-fade-leave-to {
    opacity: 0;
    transform: translateY(24px) scale(0.8);
}
</style>
