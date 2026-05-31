<template>
	<div
		ref="scrollerRef"
		class="scroller"
		:data-animated="animated"
		:data-speed="speed"
		:data-direction="direction"
		:data-pause-on-hover="pauseOnHover"
	>
		<ul class="scroller__inner">
			<slot />
		</ul>
	</div>
</template>

<script setup lang="ts">
	import { ref, onMounted } from "vue";

	interface WordLoopProps {
		speed?: "fast" | "slow" | "normal";
		direction?: "left" | "right";
		pauseOnHover?: boolean;
	}

	const props = withDefaults(defineProps<WordLoopProps>(), {
		speed: "fast",
		direction: "left",
		pauseOnHover: true,
	});

	const animated = ref(false);
	const scrollerRef = ref<HTMLElement | null>(null);

	onMounted(() => {
		// Detect prefers-reduced-motion
		if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
			animated.value = true;

			if (scrollerRef.value) {
				const scrollerInner = scrollerRef.value.querySelector(".scroller__inner");
				if (scrollerInner) {
					// Duplicate all immediate child nodes for the seamless loop
					const children = Array.from(scrollerInner.children);
					children.forEach((child) => {
						const clone = child.cloneNode(true) as HTMLElement;
						clone.setAttribute("aria-hidden", "true");
						scrollerInner.appendChild(clone);
					});
				}
			}
		}
	});
</script>

<style scoped>
	.scroller {
		width: 100%;
		max-width: 100%;
	}

	.scroller__inner {
		padding-block: 0.75rem;
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		list-style: none;
		margin: 0;
		padding-inline: 0;
	}

	.scroller[data-animated="true"] {
		overflow: hidden;
		/* Premium mask gradient for smooth fade at the edges */
		-webkit-mask: linear-gradient(
			90deg,
			transparent,
			white 15%,
			white 85%,
			transparent
		);
		mask: linear-gradient(
			90deg,
			transparent,
			white 15%,
			white 85%,
			transparent
		);
	}

	.scroller[data-animated="true"] .scroller__inner {
		width: max-content;
		flex-wrap: nowrap;
		animation: scroll var(--_animation-duration, 15s)
			var(--_animation-direction, forwards) linear infinite;
	}

	/* Pause on hover interaction */
	.scroller[data-pause-on-hover="true"]:hover .scroller__inner {
		animation-play-state: paused;
	}

	.scroller[data-direction="right"] {
		--_animation-direction: reverse;
	}

	.scroller[data-direction="left"] {
		--_animation-direction: forwards;
	}

	.scroller[data-speed="fast"] {
		--_animation-duration: 15s;
	}

	.scroller[data-speed="normal"] {
		--_animation-duration: 25s;
	}

	.scroller[data-speed="slow"] {
		--_animation-duration: 45s;
	}

	@keyframes scroll {
		to {
			/* Translate exactly half of the total width plus half gap */
			transform: translate(calc(-50% - 0.5rem));
		}
	}
</style>
