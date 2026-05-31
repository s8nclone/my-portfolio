<template>
  <!-- Static placeholder in the normal document flow -->
  <div ref="placeholderRef" class="lanyard-placeholder"></div>

  <!-- Teleported interactive card overlay -->
  <Teleport to="body">
    <div
      class="lanyard-container"
      ref="containerRef"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
      @pointerleave="onPointerUp"
    >
      <!-- SVG Lanyard String -->
      <svg class="lanyard-string-svg">
        <path
          :d="stringPath"
          fill="none"
          stroke="url(#string-gradient)"
          stroke-width="3"
          stroke-linecap="round"
        />
        <defs>
          <linearGradient id="string-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#10b981" />
            <stop offset="100%" stop-color="#047857" />
          </linearGradient>
        </defs>
      </svg>

      <!-- Card Wrapper with 3D Perspective -->
      <div
        ref="cardRef"
        class="card-wrapper"
        :style="cardStyle"
        @pointerdown="onPointerDown"
        @mouseenter="hovering = true"
        @mouseleave="hovering = false"
      >
        <!-- Card Shadow (Swaying underneath) -->
        <div class="card-shadow" :style="shadowStyle"></div>

        <!-- Main Badge -->
        <div class="badge-card">
          <!-- Clip Attachment -->
          <div class="badge-clip" ref="clipRef">
            <div class="clip-metal"></div>
            <div class="clip-loop"></div>
          </div>

          <!-- Front of the Card -->
          <div class="badge-inner">
            <!-- Header -->
            <div class="badge-header">
              <span class="logo-dot"></span>
              <span class="logo-text">SOFTWARE ENGINEER</span>
            </div>

            <!-- Avatar container -->
            <div class="badge-avatar-container">
              <div class="badge-avatar">
                <div class="avatar-gradient">
                  <img :src="portrait" alt="profile portrait" loading="eager" draggable="false" />
                </div>
              </div>
            </div>

            <!-- Details -->
            <div class="badge-info">
              <h3 class="badge-name">ABDULMUIZ FARAYOLA</h3>
              <p class="badge-title">Software Engineer</p>
            </div>

            <!-- Footer with QR/Barcode and RFID Chip -->
            <div class="badge-footer">
              <div class="rfid-chip">
                <div class="chip-line"></div>
                <div class="chip-line"></div>
                <div class="chip-line"></div>
              </div>
              <div class="barcode">
                <div class="bar bar-1"></div>
                <div class="bar bar-2"></div>
                <div class="bar bar-3"></div>
                <div class="bar bar-1"></div>
                <div class="bar bar-4"></div>
                <div class="bar bar-2"></div>
                <div class="bar bar-3"></div>
                <div class="bar bar-1"></div>
                <div class="bar bar-4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { portrait } from "~/assets/images";

// Refs
const placeholderRef = ref<HTMLElement | null>(null);
const containerRef = ref<HTMLElement | null>(null);
const cardRef = ref<HTMLElement | null>(null);
const clipRef = ref<HTMLElement | null>(null);

// Dimensions and positioning
const placeholderRect = ref({ top: 0, left: 0, width: 330, height: 450 });

// Physics and Sway Simulation parameters
const posX = ref(0); // Current translation offset X
const posY = ref(0); // Current translation offset Y
const rotX = ref(0); // Rotation X
const rotY = ref(0); // Rotation Y

const targetX = ref(0);
const targetY = ref(0);
const targetRotX = ref(0);
const targetRotY = ref(0);

const isDragging = ref(false);
const hovering = ref(false);

let startMouseX = 0;
let startMouseY = 0;
let startPosX = 0;
let startPosY = 0;

// Spring dynamics physics variables for spring sway back
let vx = 0;
let vy = 0;
let vrX = 0;
let vrY = 0;
const stiffness = 0.08;
const damping = 0.85;

// Function to update placeholder position relative to viewport
const updatePlaceholderPos = () => {
  if (placeholderRef.value) {
    const rect = placeholderRef.value.getBoundingClientRect();
    placeholderRect.value = {
      top: rect.top,
      left: rect.left,
      width: rect.width || 330,
      height: rect.height || 450,
    };
  }
};

// Pointer Down (Grab/Drag start)
const onPointerDown = (e: PointerEvent) => {
  isDragging.value = true;
  startMouseX = e.clientX;
  startMouseY = e.clientY;
  startPosX = posX.value;
  startPosY = posY.value;
  
  if (cardRef.value) {
    cardRef.value.setPointerCapture(e.pointerId);
  }
};

// Pointer Move (Dragging and Tilt Effect)
const onPointerMove = (e: PointerEvent) => {
  if (isDragging.value) {
    const dx = e.clientX - startMouseX;
    const dy = e.clientY - startMouseY;
    targetX.value = startPosX + dx;
    targetY.value = startPosY + dy;

    // Rotate card slightly based on drag speed/angle
    targetRotY.value = Math.min(Math.max(dx * 0.15, -30), 30);
    targetRotX.value = Math.min(Math.max(-dy * 0.15, -30), 30);
  } else {
    // Standard hover 3D tilt effect
    if (cardRef.value) {
      const rect = cardRef.value.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      targetRotY.value = (x / (rect.width / 2)) * 18;
      targetRotX.value = -(y / (rect.height / 2)) * 18;
    }
  }
};

// Pointer Up / Release Drag
const onPointerUp = (e: PointerEvent) => {
  if (isDragging.value) {
    isDragging.value = false;
    targetX.value = 0;
    targetY.value = 0;
    targetRotX.value = 0;
    targetRotY.value = 0;
  } else if (!hovering.value) {
    targetRotX.value = 0;
    targetRotY.value = 0;
  }
};

// Sway physics loop
let animationFrame: number | null = null;
const updatePhysics = () => {
  if (!isDragging.value) {
    // Spring simulation back to base center position (0, 0)
    const ax = (0 - posX.value) * stiffness;
    const ay = (0 - posY.value) * stiffness;
    vx += ax;
    vy += ay;
    vx *= damping;
    vy *= damping;
    posX.value += vx;
    posY.value += vy;

    // Spring simulation back to neutral rotation (0, 0)
    const arX = (targetRotX.value - rotX.value) * stiffness;
    const arY = (targetRotY.value - rotY.value) * stiffness;
    vrX += arX;
    vrY += arY;
    vrX *= damping;
    vrY *= damping;
    rotX.value += vrX;
    rotY.value += vrY;
  } else {
    // Smooth interpolation towards target drag position
    posX.value += (targetX.value - posX.value) * 0.25;
    posY.value += (targetY.value - posY.value) * 0.25;
    rotX.value += (targetRotX.value - rotX.value) * 0.25;
    rotY.value += (targetRotY.value - rotY.value) * 0.25;
  }

  // Continually track position to stay aligned during scrolls/resizes
  updatePlaceholderPos();

  animationFrame = requestAnimationFrame(updatePhysics);
};

onMounted(() => {
  updatePlaceholderPos();
  updatePhysics();

  if (typeof window !== "undefined") {
    window.addEventListener("resize", updatePlaceholderPos);
    window.addEventListener("scroll", updatePlaceholderPos, { passive: true });
    
    // Extra checks for layout shift handling
    setTimeout(updatePlaceholderPos, 100);
    setTimeout(updatePlaceholderPos, 500);
  }
});

onUnmounted(() => {
  if (animationFrame) cancelAnimationFrame(animationFrame);
  if (typeof window !== "undefined") {
    window.removeEventListener("resize", updatePlaceholderPos);
    window.removeEventListener("scroll", updatePlaceholderPos);
  }
});

// Compute string path aligning to clip center reactively with high performance
const stringPath = computed(() => {
  const cardLeft = placeholderRect.value.left;
  const cardTop = placeholderRect.value.top;
  const cardWidth = placeholderRect.value.width;
  
  // Anchor hanging straight above the card's placeholder center, at top of screen
  const anchorX = cardLeft + cardWidth / 2;
  const anchorY = 0;
  
  // Connect to the top of the clip loop (clip offset X is center of card, Y is 12px above card top)
  const endX = cardLeft + cardWidth / 2 + posX.value;
  const endY = cardTop - 12 + posY.value;
  
  // Control points sway with a delayed lag effect to create gravity simulation
  const cpX1 = anchorX + (endX - anchorX) * 0.25;
  const cpY1 = anchorY + (endY - anchorY) * 0.4;
  const cpX2 = anchorX + (endX - anchorX) * 0.75;
  const cpY2 = anchorY + (endY - anchorY) * 0.6;
  
  return `M ${anchorX} ${anchorY} C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${endX} ${endY}`;
});

// Card position styling
const cardStyle = computed(() => {
  return {
    position: "absolute" as const,
    left: `${placeholderRect.value.left}px`,
    top: `${placeholderRect.value.top}px`,
    width: `${placeholderRect.value.width}px`,
    height: `${placeholderRect.value.height}px`,
    transform: `translate3d(${posX.value}px, ${posY.value}px, 0) rotateX(${rotX.value}deg) rotateY(${rotY.value}deg)`,
    cursor: isDragging.value ? "grabbing" : "grab",
  };
});

// Swaying 3D shadow underneath badge
const shadowStyle = computed(() => {
  const shadowOffsetX = -posX.value * 0.2;
  const shadowOffsetY = 25 - posY.value * 0.1;
  const shadowScale = 1 - Math.abs(posY.value) * 0.002;
  return {
    transform: `translate3d(${shadowOffsetX}px, ${shadowOffsetY}px, -50px) scale(${shadowScale})`,
    opacity: Math.max(0.15, 0.4 - Math.abs(posY.value) * 0.001),
  };
});
</script>

<style scoped>
.lanyard-placeholder {
  width: 330px;
  height: 450px;
  visibility: hidden;
  pointer-events: none;
}

.lanyard-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none; /* allow clicks to pass through */
  user-select: none;
  touch-action: none;
  overflow: visible;
  perspective: 1200px;
  z-index: 40; /* Ensure it floats on top of all page content */
}

.lanyard-string-svg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 10;
  overflow: visible;
}

.card-wrapper {
  transform-style: preserve-3d;
  z-index: 30;
  pointer-events: auto; /* enable dragging */
  will-change: transform;
}

.card-shadow {
  position: absolute;
  inset: 12px;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 1.25rem;
  filter: blur(20px);
  z-index: -1;
  transform-style: preserve-3d;
  pointer-events: none;
  will-change: transform, opacity;
}

.badge-card {
  width: 100%;
  height: 100%;
  border-radius: 1.25rem;
  background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
  border: 2px solid rgba(16, 185, 129, 0.3);
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  overflow: visible;
  transform-style: preserve-3d;
}

/* Badge Clip Attachment */
.badge-clip {
  position: absolute;
  top: -24px;
  left: 50%;
  transform: translateX(-50%) translateZ(5px);
  width: 32px;
  height: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 5;
}

.clip-metal {
  width: 14px;
  height: 18px;
  background: linear-gradient(90deg, #9ca3af, #d1d5db, #4b5563);
  border-radius: 3px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.clip-loop {
  width: 22px;
  height: 12px;
  border: 3.5px solid #d1d5db;
  border-bottom: none;
  border-radius: 6px 6px 0 0;
  margin-top: -4px;
}

/* Inner badge content */
.badge-inner {
  padding: 1.5rem 1.25rem;
  display: flex;
  flex-direction: column;
  height: 100%;
  align-items: center;
  justify-content: space-between;
  transform: translateZ(25px);
  backface-visibility: hidden;
}

.badge-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.logo-dot {
  width: 10px;
  height: 10px;
  background-color: #10b981;
  border-radius: 50%;
  box-shadow: 0 0 8px #10b981;
}

.logo-text {
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: #e5e7eb;
}

/* Avatar Section */
.badge-avatar-container {
  width: 200px;
  height: 200px;
  border-radius: 1.5rem;
  padding: 1.5px;
  background: linear-gradient(135deg, #10b981, #047857);
  box-shadow: 0 8px 20px -5px rgba(16, 185, 129, 0.4);
  margin-bottom: 0.75rem;
  transform: translateZ(15px);
}

.badge-avatar {
  width: 100%;
  height: 100%;
  border-radius: 1.5rem;
  background-color: #374151;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-gradient {
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, #052e16 0%, #10b981 100%);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 0px;
}

.avatar-gradient img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  image-rendering: -webkit-optimize-contrast;
  -webkit-user-drag: none;
  user-drag: none;
}

/* Info section */
.badge-info {
  text-align: center;
  margin-bottom: 0.75rem;
  transform: translateZ(10px);
}

.badge-name {
  font-family: 'Inter', sans-serif;
  font-size: 0.95rem;
  font-weight: 800;
  color: #ffffff;
  margin-bottom: 0.25rem;
  letter-spacing: 0.02em;
}

.badge-title {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  font-weight: 500;
  color: #34d399;
  letter-spacing: 0.05em;
}

/* Badge footer */
.badge-footer {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding-top: 0.75rem;
  transform: translateZ(8px);
}

.rfid-chip {
  width: 32px;
  height: 24px;
  background: linear-gradient(135deg, #fbbf24, #b45309);
  border-radius: 4px;
  padding: 3px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.4);
}

.chip-line {
  height: 2px;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 1px;
}

.barcode {
  height: 26px;
  display: flex;
  align-items: flex-end;
  gap: 2px;
  background-color: #f9fafb;
  padding: 3px 6px;
  border-radius: 2px;
  opacity: 0.95;
}

.bar {
  width: 1.5px;
  height: 100%;
  background-color: #000000;
}

.bar-1 { width: 1px; }
.bar-2 { width: 2.5px; }
.bar-3 { width: 1.5px; }
.bar-4 { width: 3px; }
</style>
