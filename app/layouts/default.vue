<template>
	<div>
		<div ref="flairRef" class="flair flair--3"></div>
		<slot />
	</div>
</template>

<script setup lang="ts">
	import { gsap } from "gsap";

	const flairRef = ref<HTMLElement | null>(null);

	onMounted(() => {
		if (!flairRef.value) return;

		gsap.set(flairRef.value, { xPercent: -50, yPercent: -50 });

		const xTo = gsap.quickTo(flairRef.value, "x", {
			duration: 0.6,
			ease: "power3",
		});
		const yTo = gsap.quickTo(flairRef.value, "y", {
			duration: 0.6,
			ease: "power3",
		});

		const handleMouseMove = (e: MouseEvent) => {
			xTo(e.clientX);
			yTo(e.clientY);
		};

		window.addEventListener("mousemove", handleMouseMove);

		// Cleanup on unmount
		onUnmounted(() => {
			window.removeEventListener("mousemove", handleMouseMove);
		});
	});
</script>

<style scoped>
	.flair {
		width: 40px;
		height: 40px;
		position: fixed;
		top: 0;
		left: 0;
		pointer-events: none;
		z-index: 9999;
		border-radius: 50%;
        @apply bg-green-200;
		mix-blend-mode: difference;
        pointer-events: none;
        
        /* Hide on mobile */
        @media (max-width: 768px) {
            display: none;
        }
	}

    .flair:has(~ :hover) {
        transform: scale(1.5);
    }
</style>
