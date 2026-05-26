<template>
	<div
		class="curved-loop-jacket " 
		:style="{
			visibility: ready ? 'visible' : 'hidden',
			cursor: cursorStyle,
		}"
		@pointerdown="onPointerDown"
		@pointermove="onPointerMove"
		@pointerup="endDrag"
		@pointerleave="endDrag"
	>
		<svg class="curved-loop-svg" viewBox="500 0 1440 400" >
			<text
				ref="measureRef"
				xml:space="preserve"
				style="visibility: hidden; opacity: 0; pointer-events: none"
			>
				{{ text }}
			</text>
			<defs>
				<path
					ref="pathRef"
					:id="pathId"
					:d="pathD"
					fill="none"
					stroke="transparent"
				/>
			</defs>
			<text
				v-if="ready"
				font-weight="bold"
				xml:space="preserve"
				:class="className"
			>
				<textPath
					ref="textPathRef"
					:href="`#${pathId}`"
					:startOffset="`${offset}px`"
					xml:space="preserve"
				>
					{{ totalText }}
				</textPath>
			</text>
		</svg>
	</div>
</template>

<script setup lang="ts">
	import { ref, computed, watch, onMounted, onUnmounted } from "vue";

	interface CurvedLoopProps {
		marqueeText?: string;
		speed?: number;
		className?: string;
		curveAmount?: number;
		direction?: "left" | "right";
		interactive?: boolean;
	}

	const props = withDefaults(defineProps<CurvedLoopProps>(), {
		marqueeText: "",
		speed: 2,
		className: "",
		curveAmount: 0,
		direction: "left",
		interactive: true,
	});

	// Computed text with non-breaking space
	const text = computed(() => {
		const hasTrailing = /\s|\u00A0$/.test(props.marqueeText);
		return (
			(hasTrailing
				? props.marqueeText.replace(/\s+$/, "")
				: props.marqueeText) + "\u00A0"
		);
	});

	// Template refs
	const measureRef = ref<SVGTextElement | null>(null);
	const textPathRef = ref<SVGTextPathElement | null>(null);
	const pathRef = ref<SVGPathElement | null>(null);

	// State
	const spacing = ref(0);
	const offset = ref(0);
	const dragActive = ref(false);
	const lastX = ref(0);
	const currentDirection = ref<"left" | "right">(props.direction);
	const velocity = ref(0);

	// Generate unique ID
	const uid = Math.random().toString(36).substring(2, 9);
	const pathId = `curve-${uid}`;

	// Computed path
	const pathD = computed(
		() => `M-100,300 Q500,300 2600,300`,
	);

	// Computed total text
	const totalText = computed(() => {
		const textLength = spacing.value;
		if (!textLength) return text.value;
		const repeatCount = Math.ceil(1800 / textLength) + 2;
		return Array(repeatCount).fill(text.value).join("");
	});

	// Ready state
	const ready = computed(() => spacing.value > 0);

	// Cursor style
	const cursorStyle = computed(() => {
		if (!props.interactive) return "auto";
		return dragActive.value ? "grabbing" : "grab";
	});

	// Measure text length
	const measureText = () => {
		if (measureRef.value) {
			spacing.value = measureRef.value.getComputedTextLength();
		}
	};

	// Initialize offset
	watch(spacing, (newSpacing) => {
		if (newSpacing && textPathRef.value) {
			const initial = -newSpacing;
			textPathRef.value.setAttribute("startOffset", `${initial}px`);
			offset.value = initial;
		}
	});

	// Animation loop
	let animationFrame: number | null = null;

	const animate = () => {
		if (!spacing.value || !ready.value) return;

		const step = () => {
			if (!dragActive.value && textPathRef.value) {
				const delta =
					currentDirection.value === "right"
						? props.speed
						: -props.speed;
				const currentOffset = parseFloat(
					textPathRef.value.getAttribute("startOffset") || "0",
				);
				let newOffset = currentOffset + delta;
				const wrapPoint = spacing.value;

				if (newOffset <= -wrapPoint) newOffset += wrapPoint;
				if (newOffset > 0) newOffset -= wrapPoint;

				textPathRef.value.setAttribute("startOffset", `${newOffset}px`);
				offset.value = newOffset;
			}
			animationFrame = requestAnimationFrame(step);
		};

		animationFrame = requestAnimationFrame(step);
	};

	// Pointer event handlers
	const onPointerDown = (e: PointerEvent) => {
		if (!props.interactive) return;
		dragActive.value = true;
		lastX.value = e.clientX;
		velocity.value = 0;
		(e.target as HTMLElement).setPointerCapture(e.pointerId);
	};

	const onPointerMove = (e: PointerEvent) => {
		if (!props.interactive || !dragActive.value || !textPathRef.value)
			return;

		const dx = e.clientX - lastX.value;
		lastX.value = e.clientX;
		velocity.value = dx;

		const currentOffset = parseFloat(
			textPathRef.value.getAttribute("startOffset") || "0",
		);
		let newOffset = currentOffset + dx;
		const wrapPoint = spacing.value;

		if (newOffset <= -wrapPoint) newOffset += wrapPoint;
		if (newOffset > 0) newOffset -= wrapPoint;

		textPathRef.value.setAttribute("startOffset", `${newOffset}px`);
		offset.value = newOffset;
	};

	const endDrag = () => {
		if (!props.interactive) return;
		dragActive.value = false;
		currentDirection.value = velocity.value > 0 ? "right" : "left";
	};

	// Lifecycle
	onMounted(() => {
		measureText();
		animate();
	});

	watch([() => text.value, () => props.className], () => {
		measureText();
	});

	watch([() => spacing.value, () => props.speed, () => ready.value], () => {
		if (animationFrame) {
			cancelAnimationFrame(animationFrame);
		}
		animate();
	});

	onUnmounted(() => {
		if (animationFrame) {
			cancelAnimationFrame(animationFrame);
		}
	});
</script>

<style scoped>
	.curved-loop-jacket {
		width: 100%;
		overflow: hidden;
		user-select: none;
		touch-action: none;
		@apply h-[15vh] md:h-[30vh];
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.curved-loop-svg {
		width: 100%;
		height: 100%;
		display: block;
        /* aspect-ratio: 100 / 12; */
        overflow: visible;
        font-size: 10rem;
        fill: #ffffff;
        user-select: none;
        -moz-user-select: none;
        -webkit-user-select: none;
        font-weight: 500;
        text-transform: uppercase;
        line-height: 1;
	}
</style>
