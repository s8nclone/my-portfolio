import { describe, it, expect } from "vitest";
import { mountSuspended, mockNuxtImport } from "@nuxt/test-utils/runtime";
import { ref } from "vue";
import BlogSection from "../../app/components/BlogSection.vue";

const mockPosts = [
	{
		id: "nuxt-scalable-2026",
		title: "Building Scalable Nuxt Applications in 2026",
		excerpt:
			"Discover best practices and architecture patterns for building high-performance Vue and Nuxt applications at scale.",
		category: "Frontend",
		date: "May 20, 2026",
		readTime: "5 min read",
		imageUrl: "https://picsum.photos/seed/nuxt/600/400",
	},
];

mockNuxtImport("useFetch", () => {
	return () => ({
		data: ref(mockPosts),
		pending: ref(false),
		error: ref(null),
		refresh: () => {},
	});
});

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
		expect(wrapper.text()).toContain("Frontend");
		expect(wrapper.text()).toContain("May 20, 2026");
		expect(wrapper.text()).toContain("5 min read");
	});
});
