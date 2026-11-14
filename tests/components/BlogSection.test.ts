import { describe, it, expect, vi } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { ref } from "vue";
import BlogSection from "../../app/components/BlogSection.vue";

const mockArticles = [
	{
		id: 101,
		title: "Building Scalable Nuxt Applications in 2026",
		description:
			"Discover best practices and architecture patterns for building high-performance Vue and Nuxt applications at scale.",
		published_at: "2026-05-20T10:00:00Z",
		url: "https://dev.to/technvernacular/building-scalable-nuxt-applications-in-2026",
		cover_image: "https://picsum.photos/seed/nuxt/600/400",
		reading_time_minutes: 5,
		public_reactions_count: 12,
		comments_count: 3,
		slug: "building-scalable-nuxt-applications-in-2026",
		tag_list: ["frontend", "nuxt", "vue"],
	},
];

vi.mock("~/composables/useDevToArticles", () => ({
	useRecentDevToArticles: () => ({
		articles: ref(mockArticles),
		loading: ref(false),
		error: ref(null),
		refresh: vi.fn(),
	}),
}));

describe("BlogSection", () => {
	it("renders heading and descriptive text", async () => {
		const wrapper = await mountSuspended(BlogSection);

		expect(wrapper.text()).toContain("Latest Insights & Articles");
		expect(wrapper.text()).toContain(
			"Sharing my thoughts, design patterns, and engineering experiences",
		);
	});

	it("renders mocked blog posts", async () => {
		const wrapper = await mountSuspended(BlogSection);

		expect(wrapper.text()).toContain(
			"Building Scalable Nuxt Applications in 2026",
		);
		expect(wrapper.text()).toContain(
			"Discover best practices and architecture patterns",
		);
		expect(wrapper.text()).toContain("frontend");
		expect(wrapper.text()).toContain("May 20, 2026");
		expect(wrapper.text()).toContain("5 min read");
	});
});
