import { vi } from 'vitest';

// Mock GSAP to prevent animations from running and causing issues in tests
vi.mock('gsap', () => {
    const gsapMock = {
        to: vi.fn(),
        from: vi.fn(),
        fromTo: vi.fn(),
        set: vi.fn(),
        killTweensOf: vi.fn(),
        timeline: vi.fn(() => ({
            to: vi.fn().mockReturnThis(),
            from: vi.fn().mockReturnThis(),
            fromTo: vi.fn().mockReturnThis(),
            set: vi.fn().mockReturnThis(),
            clear: vi.fn().mockReturnThis(),
            add: vi.fn().mockReturnThis(),
            progress: vi.fn().mockReturnThis(),
            duration: vi.fn(() => 0),
            time: vi.fn(() => 0),
            totalTime: vi.fn(() => 0),
            rawTime: vi.fn(() => 0),
            paused: vi.fn(() => true),
            play: vi.fn().mockReturnThis(),
            pause: vi.fn().mockReturnThis(),
            reverse: vi.fn().mockReturnThis(),
            kill: vi.fn().mockReturnThis(),
            closestIndex: vi.fn(() => 0),
            current: vi.fn(() => 0),
            next: vi.fn().mockReturnThis(),
            previous: vi.fn().mockReturnThis(),
            labels: {},
            vars: {},
        })),
        utils: {
            toArray: vi.fn((val) => {
                if (!val) return [];
                const dummyEl = {
                    offsetLeft: 0,
                    offsetWidth: 100,
                    offsetWidthHeight: 100,
                    style: {},
                    getBoundingClientRect: () => ({ left: 0, right: 100, top: 0, bottom: 100, width: 100, height: 100 }),
                    parentNode: {
                        getBoundingClientRect: () => ({ left: 0, right: 1000, top: 0, bottom: 1000, width: 1000, height: 1000 }),
                        appendChild: vi.fn(),
                    },
                    addEventListener: vi.fn(),
                    removeEventListener: vi.fn(),
                };
                return [dummyEl];
            }),
            wrap: vi.fn((a, b, c) => c),
            snap: vi.fn(() => vi.fn((v) => v)),
        },
        registerPlugin: vi.fn(),
        getProperty: vi.fn(() => 0),
        context: vi.fn((cb) => {
            if (cb) cb();
            return { revert: vi.fn() };
        }),
    };
    return {
        default: gsapMock,
        gsap: gsapMock
    };
});

vi.mock('gsap/ScrollTrigger', () => {
    return {
        ScrollTrigger: {
            refresh: vi.fn(),
            create: vi.fn(),
            getById: vi.fn(),
            getAll: vi.fn(() => []),
        }
    };
});

vi.mock('gsap/Draggable', () => {
    return {
        Draggable: {
            create: vi.fn(() => [{}]),
        }
    };
});

vi.mock('gsap/InertiaPlugin', () => {
    return {
        InertiaPlugin: {}
    };
});
