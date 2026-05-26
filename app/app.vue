<template>
    <div class="min-h-screen">
        <NuxtLayout>
            <AppHeader />
            <NuxtPage />
            <AppFooter />
            <ScrollToTop />
        </NuxtLayout>
    </div>
</template>

<script setup>
    useHead({
        title: "Abdulmuiz Farayola - Software Engineer",
        meta: [
            {
                name: "description",
                content:
                    "Software engineer specializing in modern web and mobile technologies. Building scalable applications with TypeScript, React, Vue, Node.js, and more.",
            },
        ],
    });
</script>
