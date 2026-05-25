<template>
    <section class="hero-section min-h-screen flex items-center relative px-4 md:px-10 overflow-x-hidden rounded-b-[4rem]">
        <div class="w-full md:max-xl:max-w-7xl  mx-auto">
            <div class="gap-12 items-center mt-20 py-20">
                <!-- Text Content -->
                <div class="animate-fade-in-left text-left">
                    <h1 class="text-2xl md:text-5xl font-bold mb-3 text-white">
                        Abdulmuiz Farayola
                    </h1>

                    <div class="scrolling-text">
                        <div class="rail">
                            <h2>Software Engineer.</h2>
                            <h2>Frontend Engineer.</h2>
                            <h2>Frontend Software Developer.</h2>
                        </div>
                    </div>

                    <p class="text-lg md:text-xl text-green-200 my-8 max-w-2xl">
                        Crafting exceptional digital experiences with modern
                        technologies.
                    </p>

                    <div class="flex items-center justify-center text-center gap-2 md:gap-4 h-16">
                        <div class="rotatingHeader">
                            <h3>Research .</h3>
                        </div>

                        <div class="rotatingHeader">
                            <h3>Build .</h3>
                        </div>

                        <div class="rotatingHeader">
                            <h3>Test .</h3>
                        </div>

                        <div class="rotatingHeader">
                            <h3>Deliver .</h3>
                        </div>

                        <div class="rotatingHeader">
                            <h3>Maintain .</h3>
                        </div>
                    </div>

                    <div
                        class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mt-8 w-full"
                    >
                        <NuxtLink to="/projects" class="btn-tertiary">
                            View My Work
                        </NuxtLink>
                        <a href="#about" class="btn-secondary"> Learn More </a>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
    import { onMounted, onBeforeUnmount, nextTick } from "vue";
    import gsap from "gsap";
    import { ScrollTrigger } from "gsap/ScrollTrigger";
    import SplitText from "gsap/SplitText";

    // Register plugins (SSR-safe)
    if (typeof window !== "undefined") {
        gsap.registerPlugin(ScrollTrigger, SplitText);
    }

    // ---- Types ----
    interface HorizontalLoopConfig {
        repeat?: number;
        paused?: boolean;
        speed?: number;
        snap?: boolean | number;
        paddingRight?: number;
        reversed?: boolean;
    }

    interface HorizontalLoopTimeline extends gsap.core.Timeline {
        next: (vars?: gsap.TweenVars) => gsap.core.Tween;
        previous: (vars?: gsap.TweenVars) => gsap.core.Tween;
        current: () => number;
        toIndex: (index: number, vars?: gsap.TweenVars) => gsap.core.Tween;
        times: number[];
    }

    interface RotatingHeader extends HTMLElement {
        originalSplit?: SplitText;
        cloneSplit?: SplitText;
        words?: string[];
        currentIndex?: number;
    }

    // ---- horizontalLoop helper ----
    function horizontalLoop(
        items: HTMLElement[],
        config: HorizontalLoopConfig = {}
    ): HorizontalLoopTimeline {
        const tl = gsap.timeline({
            repeat: config.repeat ?? -1,
            paused: config.paused ?? false,
            defaults: { ease: "none" },
            onReverseComplete: () => {
                tl.totalTime(tl.rawTime() + tl.duration() * 100);
            },
        }) as HorizontalLoopTimeline;

        if (!items.length) return tl;

        const length = items.length;
        const times: number[] = [];
        const widths: number[] = [];
        const xPercents: number[] = [];
        const startX = items[0]!.offsetLeft;
        const pixelsPerSecond = (config.speed || 1) * 100;
        let curIndex = 0;

        const snap =
            config.snap === false
                ? (v: number) => v
                : typeof config.snap === "number"
                ? gsap.utils.snap(config.snap)
                : gsap.utils.snap(1);

        gsap.set(items, {
            xPercent: (i, el) => {
                const w = (widths[i] = parseFloat(
                    gsap.getProperty(el, "width", "px") as string
                ));
                xPercents[i] = snap(
                    (parseFloat(gsap.getProperty(el, "x", "px") as string) / w) *
                        100 +
                        (gsap.getProperty(el, "xPercent") as number)
                );
                return xPercents[i];
            },
        });

        gsap.set(items, { x: 0 });

        const last = items[length - 1]!;
        const totalWidth =
            last.offsetLeft +
            (xPercents[length - 1]! / 100) * widths[length - 1]! -
            startX +
            last.offsetWidth * (gsap.getProperty(last, "scaleX") as number) +
            (config.paddingRight || 0);

        for (let i = 0; i < length; i++) {
            const item = items[i]!;
            const curX = (xPercents[i]! / 100) * widths[i]!;
            const distanceToStart = item.offsetLeft + curX - startX;
            const distanceToLoop =
                distanceToStart +
                widths[i]! * (gsap.getProperty(item, "scaleX") as number);

            tl.to(
                item,
                {
                    xPercent: snap(((curX - distanceToLoop) / widths[i]!) * 100),
                    duration: distanceToLoop / pixelsPerSecond,
                },
                0
            )
                .fromTo(
                    item,
                    {
                        xPercent: snap(
                            ((curX - distanceToLoop + totalWidth) / widths[i]!) *
                                100
                        ),
                    },
                    {
                        xPercent: xPercents[i],
                        duration:
                            (curX - distanceToLoop + totalWidth - curX) /
                            pixelsPerSecond,
                        immediateRender: false,
                    },
                    distanceToLoop / pixelsPerSecond
                )
                .add("label" + i, distanceToStart / pixelsPerSecond);

            times[i] = distanceToStart / pixelsPerSecond;
        }

        function toIndex(index: number, vars?: gsap.TweenVars) {
            vars = vars || {};
            if (Math.abs(index - curIndex) > length / 2)
                index += index > curIndex ? -length : length;

            const newIndex = gsap.utils.wrap(0, length, index);
            let time = times[newIndex];

            if (time! > tl.time() !== index > curIndex) {
                vars.modifiers = { time: gsap.utils.wrap(0, tl.duration()) };
                time! += tl.duration() * (index > curIndex ? 1 : -1);
            }

            curIndex = newIndex;
            vars.overwrite = true;

            return tl.tweenTo(time!, vars);
        }

        tl.next = (vars) => toIndex(curIndex + 1, vars);
        tl.previous = (vars) => toIndex(curIndex - 1, vars);
        tl.current = () => curIndex;
        tl.toIndex = (index, vars) => toIndex(index, vars);
        tl.times = times;

        tl.progress(1, true).progress(0, true);

        if (config.reversed) {
            tl.vars.onReverseComplete?.();
            tl.reverse();
        }

        return tl;
    }

    // ---- createHeaderAnimation ----
    function createHeaderAnimation(
        header: RotatingHeader,
        originalH3: HTMLElement,
        cloneH3: HTMLElement
    ): gsap.core.Timeline {
        const duration = 0.4;
        const staggerConfig = {
            each: 0.03,
            ease: "power1.out",
            from: "start",
        } as const;

        const tl = gsap.timeline({ paused: true });

        // Animate original out (rotate down and fade)
        tl.to(
            header.originalSplit!.chars as any,
            {
                duration,
                rotationX: 90,
                opacity: 0,
                transformOrigin: "50% 50% -20px",
                stagger: staggerConfig,
                ease: "power2.in",
            },
            0
        );

        // Prepare clone (rotate up, invisible)
        tl.set(
            header.cloneSplit!.chars as any,
            {
                rotationX: -90,
                opacity: 0,
                transformOrigin: "50% 50% -20px",
            },
            duration * 0.3
        );

        // Animate clone in (rotate to 0 and fade in)
        tl.to(
            header.cloneSplit!.chars as any,
            {
                duration,
                rotationX: 0,
                opacity: 1,
                stagger: staggerConfig,
                ease: "power2.out",
            },
            duration * 0.5
        );

        return tl;
    }

    // ---- State ----
    const headerIntervals: number[] = [];

    // ---- Mount ----
    onMounted(async () => {
        await nextTick();
        if (typeof window === "undefined") return;

        // 1) Horizontal loop + ScrollTrigger
        const scrollingText = gsap.utils.toArray<HTMLElement>(".rail h2");
        if (scrollingText.length > 0) {
            const htl = horizontalLoop(scrollingText, { repeat: -1, speed: 1.2 });

            let speedTween: gsap.core.Timeline | null = null;

            ScrollTrigger.create({
                trigger: ".scrolling-text",
                start: "top bottom",
                end: "bottom top",
                markers: false,
                onUpdate: (self) => {
                    if (speedTween) speedTween.kill();

                    speedTween = gsap
                        .timeline()
                        .to(htl, { timeScale: 3 * self.direction, duration: 1.5 })
                        .to(
                            htl,
                            { timeScale: 1 * self.direction, duration: 2.5 },
                            "+=0.5"
                        );
                },
            });
        }

        // 2) Rotating headers with word cycling
        const rotatingHeaders =
            document.querySelectorAll<RotatingHeader>(".rotatingHeader");

        // Define word lists for each header
        const wordLists = [
            ["Research", "Analyze", "Discover", "Explore"],
            ["Build", "Create", "Design", "Develop"],
            ["Test", "Debug", "Verify", "Validate"],
            ["Deliver", "Deploy", "Ship", "Launch"],
            ["Maintain", "Support", "Update", "Improve"],
        ];

        rotatingHeaders.forEach((header, idx) => {
            const originalH3 = header.querySelector("h3");
            if (!originalH3) {
                console.warn(`rotatingHeader[${idx}] has no <h3>`);
                return;
            }

            // Setup container styles
            gsap.set(header, {
                position: "relative",
                display: "inline-block",
                overflow: "hidden",
            });

            // Store word list
            const currentText = originalH3.textContent ?? "Word";
            header.words = wordLists[idx] || [currentText];
            header.currentIndex = 0;

            // Create clone element
            const cloneH3 = originalH3.cloneNode(true) as HTMLElement;
            header.appendChild(cloneH3);
            gsap.set(cloneH3, {
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
            });

            // Initialize SplitText
            header.originalSplit = new SplitText(originalH3, { type: "chars" });
            header.cloneSplit = new SplitText(cloneH3, { type: "chars" });

            // Set initial states
            gsap.set(header.cloneSplit.chars as any, {
                rotationX: -90,
                opacity: 0,
            });

            // --- Define the rotation behavior ---
            const rotate = () => {
                const nextIndex = (header.currentIndex! + 1) % header.words!.length;
                const nextWord = (header.words![nextIndex] ?? "") + " .";

                // Recreate splits for clone (revert first!)
                header.cloneSplit?.revert();
                cloneH3.textContent = nextWord;
                header.cloneSplit = new SplitText(cloneH3, { type: "chars" });
                gsap.set(header.cloneSplit.chars as any, {
                    rotationX: -90,
                    opacity: 0,
                });

                // Build a fresh timeline each time (fixes the "runs once" bug)
                const tl = createHeaderAnimation(header, originalH3, cloneH3);
                tl.play();

                // After animation completes, swap texts
                tl.eventCallback("onComplete", () => {
                    header.originalSplit?.revert();
                    originalH3.textContent = nextWord;
                    header.originalSplit = new SplitText(originalH3, {
                        type: "chars",
                    });
                    gsap.set(header.originalSplit.chars as any, {
                        rotationX: 0,
                        opacity: 1,
                    });

                    // Update current index
                    header.currentIndex = nextIndex;
                });
            };

            // Start cycling
            gsap.delayedCall(1.5, () => {
                rotate();
                const id = window.setInterval(rotate, 3000);
                headerIntervals.push(id);
            });
        });
    });

    // ---- Cleanup ----
    onBeforeUnmount(() => {
        headerIntervals.forEach(clearInterval);
        headerIntervals.length = 0;
        ScrollTrigger.getAll().forEach((t) => t.kill());
        gsap.globalTimeline.clear();
    });
</script>
