<template>
    <section
        id="services"
        class="section-padding relative mx-5 sm:mx-10 rounded-3xl bg-[#8EB69B] dark:bg-gray-900 shadow-xl overflow-hidden"
    >
        <!-- Section Header -->
        <div class="container-width relative z-20">
            <div class="text-center mb-16 animate-fade-in-up">
                <h2 class="text-4xl font-bold mb-4 text-primary dark:text-green-200">
                    What I Deliver
                </h2>
                <p class="text-green-700 dark:text-green-300 text-lg max-w-2xl mx-auto leading-relaxed">
                    I build high-performance, reliable, and beautifully crafted software solutions. Here is a breakdown of the services I render as a software engineer.
                </p>
            </div>
        </div>

        <!-- Marquee Strip -->
        <div class="relative overflow-hidden">
            <!-- Left fade -->
            <div class="pointer-events-none absolute left-0 top-0 h-full w-24 z-10 bg-gradient-to-r from-white dark:from-gray-900 to-transparent" />
            <!-- Right fade -->
            <div class="pointer-events-none absolute right-0 top-0 h-full w-24 z-10 bg-gradient-to-l from-white dark:from-gray-900 to-transparent" />

            <!-- Scrolling track — overflow visible so GSAP can reposition items off-screen -->
            <div ref="trackRef" class="flex gap-6 pb-4 will-change-transform">
                <div
                    v-for="service in services"
                    :key="service.title"
                    class="marquee-item flex-shrink-0 w-72 md:w-80"
                >
                    <!-- Card: front shows icon + title; hover reveals description + techs -->
                    <div class="group relative h-64 rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing select-none shadow-sm border border-green-200 bg-white dark:bg-gray-900">

                        <!-- Front face -->
                        <div class="absolute inset-0 flex flex-col items-center justify-center gap-5 p-6 transition-opacity duration-300 group-hover:opacity-0">
                            <div class="w-14 h-14 flex items-center justify-center rounded-2xl bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400">
                                <component :is="service.icon" class="w-7 h-7" />
                            </div>
                            <h3 class="text-lg font-bold text-center text-primary dark:text-green-200 leading-snug">
                                {{ service.title }}
                            </h3>
                        </div>

                        <!-- Hover reveal overlay: slides up from the bottom -->
                        <div class="absolute inset-0 flex flex-col justify-between p-6 bg-gradient-to-br from-green-700 to-[#235347] dark:from-green-800 dark:to-green-950 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
                            <!-- Faint icon watermark -->
                            <div class="absolute top-4 right-4 opacity-10 text-white">
                                <component :is="service.icon" class="w-16 h-16" />
                            </div>

                            <div>
                                <h3 class="text-base font-bold text-white mb-2 leading-snug">
                                    {{ service.title }}
                                </h3>
                                <p class="text-green-100 text-xs leading-relaxed line-clamp-4">
                                    {{ service.description }}
                                </p>
                            </div>

                            <div class="flex flex-wrap gap-1.5 mt-3">
                                <span
                                    v-for="tech in service.techs"
                                    :key="tech"
                                    class="px-2 py-0.5 text-[11px] font-medium rounded-full bg-white/15 text-white/90 border border-white/20"
                                >
                                    {{ tech }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { Monitor, Server, Smartphone, Cloud, Cpu, Zap } from "lucide-vue-next";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";

gsap.registerPlugin(Draggable, InertiaPlugin);

// Data
const services = [
    {
        title: "Frontend Development",
        description: "Responsive, interactive, and pixel-perfect user interfaces built with modern Vue and React frameworks. Prioritizing layout consistency, speed, and standard accessibility.",
        icon: Monitor,
        techs: ["Vue 3", "React", "Nuxt 3", "Tailwind CSS", "TypeScript"]
    },
    {
        title: "Backend & API Design",
        description: "Scalable, secure server-side logic and database architecture. Implementing high-performance RESTful and GraphQL APIs with robust security checks.",
        icon: Server,
        techs: ["Node.js", "Express", ".NET Core", "PostgreSQL", "Supabase"]
    },
    {
        title: "Mobile Applications",
        description: "Cross-platform mobile apps for iOS and Android built using React Native and Flutter. Designed for optimal device performance and native UI experience.",
        icon: Smartphone,
        techs: ["React Native", "Flutter", "PWAs", "Mobile UX"]
    },
    {
        title: "Cloud Infrastructure & DevOps",
        description: "Deployment automation, continuous integration workflows, and serverless hosting architecture. Utilizing containers for reproducible environments.",
        icon: Cloud,
        techs: ["Docker", "GCP", "CI/CD", "GitHub Actions", "Vercel"]
    },
    {
        title: "System Design & Architecture",
        description: "Designing structured database schemas, microservice separation, and component hierarchies. Ensuring the product codebase remains modular and extensible.",
        icon: Cpu,
        techs: ["SOLID", "OOP", "Database Normalization", "MVC/Clean", "MVVM"]
    },
    {
        title: "Performance & SEO Audit",
        description: "Auditing core vitals to fix hydration errors, render-blocking scripts, and asset size overheads. Perfecting Lighthouse and Search Engine indexing.",
        icon: Zap,
        techs: ["Lighthouse", "Core Web Vitals", "SEO Metas", "Vite Opts"]
    }
];

// GSAP Horizontal Loop

const trackRef = ref<HTMLElement | null>(null);

let loop: ReturnType<typeof horizontalLoop> | null = null;
let cleanupFn: (() => void) | null = null;

onMounted(() => {
    if (!trackRef.value) return;

    const items = trackRef.value.querySelectorAll<HTMLElement>(".marquee-item");

    loop = horizontalLoop(items, {
        repeat: -1,
        paddingRight: 24,
        speed: 0.5,
        draggable: true,
    });

    items.forEach((item) => {
        item.addEventListener("mouseenter", () => loop?.pause());
        item.addEventListener("mouseleave", () => loop?.play());
    });
});

onUnmounted(() => {
    loop?.kill();
    cleanupFn?.();
});

// ─── horizontalLoop helper (GSAP utility) ────────────────────────────────────
// Source: https://gsap.com/docs/v3/HelperFunctions/helpers/seamlessLoop/

function horizontalLoop(items: NodeListOf<HTMLElement> | HTMLElement[], config?: {
    repeat?: number;
    paddingRight?: number;
    speed?: number;
    draggable?: boolean;
    paused?: boolean;
    reversed?: boolean;
    center?: boolean | string;
    snap?: number | false;
    onChange?: (item: HTMLElement, index: number) => void;
}) {
    let timeline: gsap.core.Timeline & {
        next: (vars?: gsap.TweenVars) => gsap.core.Tween;
        previous: (vars?: gsap.TweenVars) => gsap.core.Tween;
        toIndex: (index: number, vars?: gsap.TweenVars) => gsap.core.Tween;
        current: () => number;
        closestIndex: (setCurrent?: boolean) => number;
        times: number[];
        draggable?: typeof Draggable.prototype;
    };

    const itemsArr = gsap.utils.toArray<HTMLElement>(items);
    config = config || {};

    gsap.context(() => {
        const onChange = config!.onChange;
        let lastIndex = 0;
        const tl = gsap.timeline({
            repeat: config!.repeat,
            onUpdate: onChange
                ? function () { const i = tl.closestIndex(); if (lastIndex !== i) { lastIndex = i; onChange(itemsArr[i]!, i); } }
                : undefined,
            paused: config!.paused,
            defaults: { ease: "none" },
            onReverseComplete: () => { tl.totalTime(tl.rawTime() + tl.duration() * 100); },
        }) as typeof timeline;

        const length = itemsArr.length;
        const startX = itemsArr[0]!.offsetLeft;
        const times: number[] = [];
        const widths: number[] = [];
        const spaceBefore: number[] = [];
        const xPercents: number[] = [];
        let curIndex = 0;
        let indexIsDirty = false;
        const center = config!.center;
        const pixelsPerSecond = (config!.speed || 1) * 100;
        const snap = config!.snap === false ? (v: number) => v : gsap.utils.snap(config!.snap || 1);
        let timeOffset = 0;
        const container = center === true
            ? itemsArr[0]!.parentNode as HTMLElement
            : (gsap.utils.toArray<HTMLElement>(center as string)[0] || itemsArr[0]!.parentNode) as HTMLElement;
        let totalWidth: number;
        let timeWrap: (v: number) => number;
        let proxy: HTMLElement;

        const getTotalWidth = () =>
            itemsArr[length - 1]!.offsetLeft +
            (xPercents[length - 1] ?? 0) / 100 * (widths[length - 1] ?? 0) -
            startX +
            (spaceBefore[0] ?? 0) +
            itemsArr[length - 1]!.offsetWidth * (gsap.getProperty(itemsArr[length - 1]!, "scaleX") as number) +
            (parseFloat(String(config!.paddingRight)) || 0);

        const populateWidths = () => {
            let b1 = container.getBoundingClientRect(), b2;
            itemsArr.forEach((el, i) => {
                widths[i] = parseFloat(gsap.getProperty(el, "width", "px") as string);
                xPercents[i] = snap(
                    (parseFloat(gsap.getProperty(el, "x", "px") as string) / (widths[i] ?? 1)) * 100 +
                    (gsap.getProperty(el, "xPercent") as number)
                );
                b2 = el.getBoundingClientRect();
                spaceBefore[i] = b2.left - (i ? b1.right : b1.left);
                b1 = b2;
            });
            gsap.set(itemsArr, { xPercent: (i: number) => xPercents[i] ?? 0 });
            totalWidth = getTotalWidth();
        };

        const populateOffsets = () => {
            timeOffset = center ? (tl.duration() * (container.offsetWidth / 2)) / totalWidth : 0;
            center && times.forEach((t, i) => {
                times[i] = timeWrap((tl.labels["label" + i] ?? 0) + (tl.duration() * (widths[i] ?? 0)) / 2 / totalWidth - timeOffset);
            });
        };

        const getClosest = (values: number[], value: number, wrap: number) => {
            let i = values.length, closest = 1e10, index = 0, d: number;
            while (i--) {
                d = Math.abs((values[i] ?? 0) - value);
                if (d > wrap / 2) d = wrap - d;
                if (d < closest) { closest = d; index = i; }
            }
            return index;
        };

        const populateTimeline = () => {
            tl.clear();
            for (let i = 0; i < length; i++) {
                const item = itemsArr[i]!;
                const curX = ((xPercents[i] ?? 0) / 100) * (widths[i] ?? 0);
                const distanceToStart = item.offsetLeft + curX - startX + (spaceBefore[0] ?? 0);
                const distanceToLoop = distanceToStart + (widths[i] ?? 0) * (gsap.getProperty(item, "scaleX") as number);
                tl.to(item, { xPercent: snap(((curX - distanceToLoop) / (widths[i] ?? 1)) * 100), duration: distanceToLoop / pixelsPerSecond }, 0)
                    .fromTo(item,
                        { xPercent: snap(((curX - distanceToLoop + totalWidth) / (widths[i] ?? 1)) * 100) },
                        { xPercent: (xPercents[i] ?? 0), duration: (curX - distanceToLoop + totalWidth - curX) / pixelsPerSecond, immediateRender: false },
                        distanceToLoop / pixelsPerSecond
                    )
                    .add("label" + i, distanceToStart / pixelsPerSecond);
                times[i] = distanceToStart / pixelsPerSecond;
            }
            timeWrap = gsap.utils.wrap(0, tl.duration());
        };

        const refresh = (deep?: boolean) => {
            const progress = tl.progress();
            tl.progress(0, true);
            populateWidths();
            deep && populateTimeline();
            populateOffsets();
            deep && tl.draggable && tl.paused()
                ? tl.time(times[curIndex] ?? 0, true)
                : tl.progress(progress, true);
        };

        const onResize = () => refresh(true);

        gsap.set(itemsArr, { x: 0 });
        populateWidths();
        populateTimeline();
        populateOffsets();
        window.addEventListener("resize", onResize);

        const toIndex = (index: number, vars?: gsap.TweenVars) => {
            vars = vars || {};
            if (Math.abs(index - curIndex) > length / 2) index += index > curIndex ? -length : length;
            const newIndex = gsap.utils.wrap(0, length, index);
            let time: number = times[newIndex] ?? 0;
            if ((time > tl.time()) !== (index > curIndex) && index !== curIndex) {
                time += tl.duration() * (index > curIndex ? 1 : -1);
            }
            if (time < 0 || time > tl.duration()) (vars as gsap.TweenVars & { modifiers?: object }).modifiers = { time: timeWrap };
            curIndex = newIndex;
            vars.overwrite = true;
            gsap.killTweensOf(proxy);
            return vars.duration === 0 ? tl.time(timeWrap(time)) : tl.tweenTo(time, vars);
        };

        tl.toIndex = (index, vars) => toIndex(index, vars) as gsap.core.Tween;
        tl.closestIndex = (setCurrent?: boolean) => {
            const index = getClosest(times, tl.time(), tl.duration());
            if (setCurrent) { curIndex = index; indexIsDirty = false; }
            return index;
        };
        tl.current = () => indexIsDirty ? tl.closestIndex(true) : curIndex;
        tl.next = (vars) => toIndex(tl.current() + 1, vars) as gsap.core.Tween;
        tl.previous = (vars) => toIndex(tl.current() - 1, vars) as gsap.core.Tween;
        tl.times = times;
        tl.progress(1, true).progress(0, true);

        if (config!.reversed) { tl.vars.onReverseComplete?.(); tl.reverse(); }

        if (config!.draggable && typeof Draggable === "function") {
            proxy = document.createElement("div");
            let startProgress: number, ratio: number, lastSnap: number, initChangeX: number, wasPlaying: boolean;
            const wrap = gsap.utils.wrap(0, 1);
            // const align = () => tl.progress(wrap(startProgress + (draggable.startX - draggable.x) * ratio));
            const align = function (this: typeof Draggable.prototype): void {tl.progress(wrap(startProgress + (this.startX - this.x) * ratio))};
            const syncIndex = () => tl.closestIndex(true);

            const [draggable] = Draggable.create(proxy, {
                trigger: itemsArr[0]!.parentNode as HTMLElement,
                type: "x",
                onPressInit() {
                    const x = this.x;
                    gsap.killTweensOf(tl);
                    wasPlaying = !tl.paused();
                    tl.pause();
                    startProgress = tl.progress();
                    refresh();
                    ratio = 1 / totalWidth;
                    initChangeX = startProgress / -ratio - x;
                    gsap.set(proxy, { x: startProgress / -ratio });
                },
                onDrag: align,
                onThrowUpdate: align,
                overshootTolerance: 0,
                inertia: true,
                snap(value: number) {
                    if (Math.abs(startProgress / -ratio - this.x) < 10) return lastSnap + initChangeX;
                    const time = -(value * ratio) * tl.duration();
                    const wrappedTime = timeWrap(time);
                    const snapTime = times[getClosest(times, wrappedTime, tl.duration())] ?? 0;
                    let dif = snapTime - wrappedTime;
                    if (Math.abs(dif) > tl.duration() / 2) dif += dif < 0 ? tl.duration() : -tl.duration();
                    lastSnap = (time + dif) / tl.duration() / -ratio;
                    return lastSnap;
                },
                onRelease() { syncIndex(); if (this.isThrowing) indexIsDirty = true; },
                onThrowComplete: () => { syncIndex(); wasPlaying && tl.play(); }
            });
            tl.draggable = draggable;
        }

        tl.closestIndex(true);
        lastIndex = curIndex;
        onChange && onChange(itemsArr[curIndex]!, curIndex);
        timeline = tl;

        cleanupFn = () => window.removeEventListener("resize", onResize);
    });

    return timeline!;
}
</script>
