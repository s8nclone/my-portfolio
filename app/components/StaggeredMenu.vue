<template>
  <!-- Fixed full-viewport wrapper — pointer-events disabled except on interactive children -->
  <div
    class="sm-wrapper"
    :data-position="position"
    :data-open="isOpen || undefined"
    :style="{ '--sm-accent': accentColor }"
  >
    <!-- Sweep pre-layers that slide in before the main panel -->
    <div ref="preLayersRef" class="sm-prelayers" aria-hidden="true">
      <div
        v-for="(color, i) in sweepColors"
        :key="i"
        class="sm-prelayer"
        :style="{ background: color }"
      />
    </div>

    <!-- Hamburger / Close toggle -->
    <button
      ref="toggleBtnRef"
      type="button"
      class="sm-toggle"
      :aria-label="isOpen ? 'Close navigation menu' : 'Open navigation menu'"
      :aria-expanded="isOpen"
      aria-controls="sm-menu-panel"
      @click="toggleMenu"
    >
      <span ref="textWrapRef" class="sm-toggle-text" aria-hidden="true">
        <span ref="textInnerRef" class="sm-toggle-text-inner">
          <span
            v-for="(line, i) in textLines"
            :key="i"
            class="sm-toggle-text-line"
          >{{ line }}</span>
        </span>
      </span>
      <span ref="iconRef" class="sm-icon" aria-hidden="true">
        <span ref="plusHRef" class="sm-icon-bar" />
        <span ref="plusVRef" class="sm-icon-bar sm-icon-bar--v" />
      </span>
    </button>

    <!-- Navigation Panel -->
    <nav
      id="sm-menu-panel"
      ref="panelRef"
      class="sm-panel"
      :aria-hidden="!isOpen"
      role="dialog"
      :aria-modal="isOpen"
    >
      <div class="sm-panel-inner">
        <!-- Nav Items -->
        <ul
          class="sm-nav-list"
          role="list"
          :data-numbering="displayItemNumbering || undefined"
        >
          <li
            v-for="(item, idx) in items"
            :key="item.label"
            class="sm-nav-item-wrap"
          >
            <NuxtLink
              class="sm-nav-item"
              :to="item.link"
              :aria-label="item.ariaLabel"
              :data-index="idx + 1"
              @click="closeMenu"
            >
              <span class="sm-nav-label">{{ item.label }}</span>
            </NuxtLink>
          </li>
        </ul>

        <!-- Social Links -->
        <div
          v-if="displaySocials && socialItems.length"
          class="sm-socials"
        >
          <h3 class="sm-socials-title">Socials</h3>
          <ul class="sm-socials-list" role="list">
            <li
              v-for="s in socialItems"
              :key="s.label"
              class="sm-socials-item"
            >
              <a
                :href="s.link"
                target="_blank"
                rel="noopener noreferrer"
                class="sm-socials-link"
              >{{ s.label }}</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';
import { gsap } from 'gsap';

// ─── Types ───────────────────────────────────────────────────────────────────

interface MenuItem {
  label: string;
  ariaLabel: string;
  link: string;
}

interface SocialItem {
  label: string;
  link: string;
}

interface Props {
  position?: 'left' | 'right';
  colors?: string[];
  items?: MenuItem[];
  socialItems?: SocialItem[];
  displaySocials?: boolean;
  displayItemNumbering?: boolean;
  accentColor?: string;
  menuButtonColor?: string;
  openMenuButtonColor?: string;
  changeMenuColorOnOpen?: boolean;
  closeOnClickAway?: boolean;
}

// ─── Props & Emits ───────────────────────────────────────────────────────────

const props = withDefaults(defineProps<Props>(), {
  position: 'right',
  colors: () => ['#064e3b', '#10b981'],
  items: () => [],
  socialItems: () => [],
  displaySocials: true,
  displayItemNumbering: true,
  accentColor: '#10b981',
  menuButtonColor: '#ffffff',
  openMenuButtonColor: '#ffffff',
  changeMenuColorOnOpen: true,
  closeOnClickAway: true,
});

const emit = defineEmits<{
  menuOpen: [];
  menuClose: [];
}>();

// ─── DOM Template Refs ───────────────────────────────────────────────────────

const panelRef     = ref<HTMLElement | null>(null);
const preLayersRef = ref<HTMLElement | null>(null);
const toggleBtnRef = ref<HTMLButtonElement | null>(null);
const textInnerRef = ref<HTMLElement | null>(null);
const textWrapRef  = ref<HTMLElement | null>(null);
const iconRef      = ref<HTMLElement | null>(null);
const plusHRef     = ref<HTMLElement | null>(null);
const plusVRef     = ref<HTMLElement | null>(null);

// ─── Reactive State ──────────────────────────────────────────────────────────

const isOpen    = ref(false);
const textLines = ref<string[]>(['Menu', 'Close']);

// ─── Plain-JS GSAP Handles (non-reactive to avoid proxy overhead) ─────────────

let preLayerEls: HTMLElement[]           = [];
let openTl: gsap.core.Timeline | null   = null;
let closeTween: gsap.core.Tween | null  = null;
let spinTween: gsap.core.Tween | null   = null;
let textAnim: gsap.core.Tween | null    = null;
let colorTween: gsap.core.Tween | null  = null;
let busy = false;

// ─── Computed ────────────────────────────────────────────────────────────────

/**
 * Mirrors the React version's logic: take up to 4 colours, strip the middle
 * one if there are 3+, so the sweep never uses more than 3 layers.
 */
const sweepColors = computed<string[]>(() => {
  const raw = (props.colors ?? []).slice(0, 4);
  const arr = [...raw];
  if (arr.length >= 3) arr.splice(Math.floor(arr.length / 2), 1);
  return arr;
});

// ─── GSAP Setup ──────────────────────────────────────────────────────────────

function setupGsap() {
  const panel    = panelRef.value;
  const plusH    = plusHRef.value;
  const plusV    = plusVRef.value;
  const icon     = iconRef.value;
  const textInner = textInnerRef.value;
  if (!panel || !plusH || !plusV || !icon || !textInner) return;

  // Cache pre-layer elements
  if (preLayersRef.value) {
    preLayerEls = Array.from(preLayersRef.value.querySelectorAll('.sm-prelayer')) as HTMLElement[];
  }

  const offscreen = props.position === 'left' ? -100 : 100;

  // Place panel + layers off-screen; make them visible (opacity overrides CSS 0)
  gsap.set([panel, ...preLayerEls], { xPercent: offscreen, opacity: 1 });
  if (preLayersRef.value) gsap.set(preLayersRef.value, { xPercent: 0, opacity: 1 });

  // Icon initial state
  gsap.set(plusH, { transformOrigin: '50% 50%', rotate: 0 });
  gsap.set(plusV, { transformOrigin: '50% 50%', rotate: 90 });
  gsap.set(icon,  { rotate: 0, transformOrigin: '50% 50%' });
  gsap.set(textInner, { yPercent: 0 });

  if (toggleBtnRef.value) gsap.set(toggleBtnRef.value, { color: props.menuButtonColor });
}

// ─── Open Timeline Builder ────────────────────────────────────────────────────

function buildOpenTimeline(): gsap.core.Timeline | null {
  const panel  = panelRef.value;
  const layers = preLayerEls;
  if (!panel) return null;

  openTl?.kill();
  closeTween?.kill();
  closeTween = null;

  // Collect animated children
  const labelEls    = Array.from(panel.querySelectorAll('.sm-nav-label'))        as HTMLElement[];
  const numberEls   = Array.from(panel.querySelectorAll('.sm-nav-list[data-numbering] .sm-nav-item')) as HTMLElement[];
  const socialTitle = panel.querySelector('.sm-socials-title')                    as HTMLElement | null;
  const socialLinks = Array.from(panel.querySelectorAll('.sm-socials-link'))      as HTMLElement[];

  const offscreen = props.position === 'left' ? -100 : 100;

  // Reset children to hidden positions
  if (labelEls.length)  gsap.set(labelEls,  { yPercent: 140, rotate: 10 });
  if (numberEls.length) gsap.set(numberEls, { '--sm-num-opacity': 0 });
  if (socialTitle)      gsap.set(socialTitle, { opacity: 0 });
  if (socialLinks.length) gsap.set(socialLinks, { y: 25, opacity: 0 });

  const tl = gsap.timeline({ paused: true });

  // Pre-layers stagger in
  layers.forEach((el, i) => {
    tl.fromTo(el,
      { xPercent: offscreen },
      { xPercent: 0, duration: 0.5, ease: 'power4.out' },
      i * 0.07
    );
  });

  // Main panel follows
  const panelStart    = (layers.length > 0 ? (layers.length - 1) * 0.07 : 0) + (layers.length ? 0.08 : 0);
  const panelDuration = 0.65;
  tl.fromTo(panel,
    { xPercent: offscreen },
    { xPercent: 0, duration: panelDuration, ease: 'power4.out' },
    panelStart
  );

  // Nav labels stagger up
  if (labelEls.length) {
    const itemsAt = panelStart + panelDuration * 0.15;
    tl.to(labelEls, {
      yPercent: 0, rotate: 0, duration: 1,
      ease: 'power4.out',
      stagger: { each: 0.1, from: 'start' },
    }, itemsAt);
    if (numberEls.length) {
      tl.to(numberEls, {
        '--sm-num-opacity': 1, duration: 0.6,
        ease: 'power2.out',
        stagger: { each: 0.08, from: 'start' },
      }, itemsAt + 0.1);
    }
  }

  // Socials fade in
  if (socialTitle || socialLinks.length) {
    const socialsAt = panelStart + panelDuration * 0.4;
    if (socialTitle) {
      tl.to(socialTitle, { opacity: 1, duration: 0.5, ease: 'power2.out' }, socialsAt);
    }
    if (socialLinks.length) {
      tl.to(socialLinks, {
        y: 0, opacity: 1, duration: 0.55, ease: 'power3.out',
        stagger: { each: 0.08, from: 'start' },
        onComplete: () => gsap.set(socialLinks, { clearProps: 'opacity' }),
      }, socialsAt + 0.04);
    }
  }

  openTl = tl;
  return tl;
}

// ─── Play Open / Close ────────────────────────────────────────────────────────

function playOpen() {
  if (busy) return;
  busy = true;
  const tl = buildOpenTimeline();
  if (tl) {
    tl.eventCallback('onComplete', () => { busy = false; });
    tl.play(0);
  } else {
    busy = false;
  }
}

function playClose() {
  openTl?.kill();
  openTl = null;

  const panel  = panelRef.value;
  const layers = preLayerEls;
  if (!panel) return;

  closeTween?.kill();
  const offscreen = props.position === 'left' ? -100 : 100;

  closeTween = gsap.to([...layers, panel], {
    xPercent: offscreen, duration: 0.32,
    ease: 'power3.in', overwrite: 'auto',
    onComplete: () => {
      const labels  = Array.from(panel.querySelectorAll('.sm-nav-label'))        as HTMLElement[];
      const numbers = Array.from(panel.querySelectorAll('.sm-nav-list[data-numbering] .sm-nav-item')) as HTMLElement[];
      const sTitle  = panel.querySelector('.sm-socials-title')                    as HTMLElement | null;
      const sLinks  = Array.from(panel.querySelectorAll('.sm-socials-link'))      as HTMLElement[];
      if (labels.length)  gsap.set(labels,  { yPercent: 140, rotate: 10 });
      if (numbers.length) gsap.set(numbers, { '--sm-num-opacity': 0 });
      if (sTitle)         gsap.set(sTitle,  { opacity: 0 });
      if (sLinks.length)  gsap.set(sLinks,  { y: 25, opacity: 0 });
      busy = false;
    },
  });
}

// ─── Micro-animations ────────────────────────────────────────────────────────

function animateIcon(opening: boolean) {
  const icon = iconRef.value;
  if (!icon) return;
  spinTween?.kill();
  spinTween = gsap.to(icon, {
    rotate: opening ? 225 : 0,
    duration: opening ? 0.8 : 0.35,
    ease: opening ? 'power4.out' : 'power3.inOut',
    overwrite: 'auto',
  });
}

function animateColor(opening: boolean) {
  const btn = toggleBtnRef.value;
  if (!btn) return;
  colorTween?.kill();
  if (props.changeMenuColorOnOpen) {
    colorTween = gsap.to(btn, {
      color: opening ? props.openMenuButtonColor : props.menuButtonColor,
      delay: 0.18, duration: 0.3, ease: 'power2.out',
    });
  } else {
    gsap.set(btn, { color: props.menuButtonColor });
  }
}

function animateText(opening: boolean) {
  const inner = textInnerRef.value;
  if (!inner) return;
  textAnim?.kill();

  // Build a rapid text-cycling sequence (matches React version)
  const current = opening ? 'Menu' : 'Close';
  const target  = opening ? 'Close' : 'Menu';
  const seq: string[] = [current];
  let last = current;
  for (let i = 0; i < 3; i++) {
    last = last === 'Menu' ? 'Close' : 'Menu';
    seq.push(last);
  }
  if (last !== target) seq.push(target);
  seq.push(target);
  textLines.value = seq;

  // Wait a tick for Vue to render the new lines, then animate
  nextTick(() => {
    gsap.set(inner, { yPercent: 0 });
    const finalShift = ((seq.length - 1) / seq.length) * 100;
    textAnim = gsap.to(inner, {
      yPercent: -finalShift,
      duration: 0.5 + seq.length * 0.07,
      ease: 'power4.out',
    });
  });
}

// ─── Toggle / Close ──────────────────────────────────────────────────────────

function toggleMenu() {
  const opening = !isOpen.value;
  isOpen.value  = opening;
  opening ? emit('menuOpen') : emit('menuClose');
  opening ? playOpen() : playClose();
  animateIcon(opening);
  animateColor(opening);
  animateText(opening);
}

function closeMenu() {
  if (!isOpen.value) return;
  isOpen.value = false;
  emit('menuClose');
  playClose();
  animateIcon(false);
  animateColor(false);
  animateText(false);
}

// ─── Click-outside Handler ───────────────────────────────────────────────────

function onClickOutside(e: MouseEvent) {
  if (!props.closeOnClickAway || !isOpen.value) return;
  const target = e.target as Node;
  if (
    panelRef.value     && !panelRef.value.contains(target) &&
    toggleBtnRef.value && !toggleBtnRef.value.contains(target)
  ) closeMenu();
}

// Escape key handler
function onKeyDown(e: KeyboardEvent) {
  if (e.key === 'Escape' && isOpen.value) closeMenu();
}

// ─── Lifecycle ───────────────────────────────────────────────────────────────

onMounted(async () => {
  await nextTick();
  setupGsap();
  document.addEventListener('mousedown', onClickOutside);
  document.addEventListener('keydown', onKeyDown);
});

onUnmounted(() => {
  openTl?.kill();
  closeTween?.kill();
  spinTween?.kill();
  textAnim?.kill();
  colorTween?.kill();
  document.removeEventListener('mousedown', onClickOutside);
  document.removeEventListener('keydown', onKeyDown);
});
</script>

<style scoped>
/* ── Wrapper ── */
.sm-wrapper {
  position: fixed;
  inset: 0;
  z-index: 60;
  pointer-events: none; /* pass-through by default */
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

/* ── Toggle button (always visible, top-right) ── */
.sm-toggle {
  position: absolute;
  top: 1rem;
  right: 1.25rem;
  z-index: 20;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: transparent;
  border: none;
  cursor: pointer;
  color: #e9e9ef;
  font-weight: 600;
  font-size: 0.9rem;
  line-height: 1;
  pointer-events: auto;
  padding: 0.4rem 0.25rem;
  will-change: color;
}

.sm-toggle:focus-visible {
  outline: 2px solid rgba(255, 255, 255, 0.6);
  outline-offset: 4px;
  border-radius: 4px;
}

/* Text cycle wrapper */
.sm-toggle-text {
  position: relative;
  display: inline-block;
  height: 1em;
  overflow: hidden;
  white-space: nowrap;
}

.sm-toggle-text-inner {
  display: flex;
  flex-direction: column;
  line-height: 1;
  will-change: transform;
}

.sm-toggle-text-line {
  display: block;
  height: 1em;
  line-height: 1;
}

/* Plus/close icon */
.sm-icon {
  position: relative;
  width: 16px;
  height: 16px;
  flex: 0 0 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  will-change: transform;
}

.sm-icon-bar {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 100%;
  height: 2px;
  background: currentColor;
  border-radius: 2px;
  transform: translate(-50%, -50%);
  will-change: transform;
}

/* Vertical bar of the + icon */
.sm-icon-bar--v {
  /* GSAP will set rotate: 90 on init so this already looks like a + */
}

/* ── Pre-layer sweep ── */
.sm-prelayers {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 5;
}

[data-position='right'] .sm-prelayers {
  left: auto;
  right: 0;
  width: 100%;
}

[data-position='left'] .sm-prelayers {
  right: auto;
  left: 0;
  width: 100%;
}

.sm-prelayer {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  /* GSAP controls opacity/xPercent; CSS sets initial to allow GSAP override */
  opacity: 0;
}

/* ── Navigation Panel ── */
.sm-panel {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  background: #0a1f14; /* deep dark green */
  display: flex;
  flex-direction: column;
  padding: 5rem 2rem 2.5rem;
  overflow-y: auto;
  z-index: 10;
  pointer-events: auto;
  /* opacity starts at 0 — GSAP sets to 1 after xPercent init */
  opacity: 0;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
}

[data-position='right'] .sm-panel {
  right: 0;
  left: auto;
}

[data-position='left'] .sm-panel {
  left: 0;
  right: auto;
}

.sm-panel-inner {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* ── Nav List ── */
.sm-nav-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  counter-reset: smItem;
}

.sm-nav-item-wrap {
  position: relative;
  overflow: hidden;
  line-height: 1;
}

.sm-nav-item {
  position: relative;
  display: inline-block;
  color: #ffffff;
  font-weight: 800;
  font-size: clamp(2.5rem, 12vw, 4.5rem);
  line-height: 1.05;
  letter-spacing: -0.03em;
  text-transform: uppercase;
  text-decoration: none;
  padding-right: 1.6em;
  cursor: pointer;
  transition: color 0.25s ease;
  will-change: color;
}

.sm-nav-item:hover {
  color: var(--sm-accent, #10b981);
}

.sm-nav-label {
  display: inline-block;
  will-change: transform;
  transform-origin: 50% 100%;
}

/* Item numbering (counter pseudo-element) */
.sm-nav-list[data-numbering] {
  counter-reset: smItem;
}

.sm-nav-list[data-numbering] .sm-nav-item::after {
  counter-increment: smItem;
  content: counter(smItem, decimal-leading-zero);
  position: absolute;
  top: 0.15em;
  right: 0.4em;
  font-size: 0.9rem;
  font-weight: 400;
  color: var(--sm-accent, #10b981);
  letter-spacing: 0;
  pointer-events: none;
  user-select: none;
  opacity: var(--sm-num-opacity, 0);
  transition: color 0.2s ease;
}

/* ── Socials ── */
.sm-socials {
  margin-top: auto;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(16, 185, 129, 0.2);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.sm-socials-title {
  margin: 0;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--sm-accent, #10b981);
  opacity: 0; /* GSAP will animate this in */
}

.sm-socials-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1.25rem;
  align-items: center;
}

.sm-socials-link {
  font-size: 1rem;
  font-weight: 600;
  @apply text-green-200;
  text-decoration: none;
  display: inline-block;
  padding: 0.15rem 0;
  transition: color 0.25s ease, opacity 0.25s ease;
  opacity: 0.5; /* GSAP animates in */
}

.sm-socials-link:hover {
  color: var(--sm-accent, #10b981);
  opacity: 1;
}

.sm-socials-link:focus-visible {
  outline: 2px solid var(--sm-accent, #10b981);
  outline-offset: 3px;
}

/* Dim siblings on hover/focus of list */
.sm-socials-list:hover .sm-socials-link:not(:hover) {
  opacity: 0.35;
}

.sm-socials-list:focus-within .sm-socials-link:not(:focus-visible) {
  opacity: 0.35;
}
</style>
