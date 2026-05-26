import { describe, it, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import ProjectsIndex from "../../app/pages/projects/index.vue";
import projectsData from "../../app/public/projects.json";

describe("ProjectsIndex Page", () => {
	it("renders the page title and description", async () => {
		const wrapper = await mountSuspended(ProjectsIndex);

		expect(wrapper.text()).toContain("My Projects");
		expect(wrapper.text()).toContain("A collection of projects");
	});

	it("generates filter categories based on projects.json", async () => {
		const wrapper = await mountSuspended(ProjectsIndex);

		const cats = new Set<string>();
		Object.values(projectsData).forEach((p) => {
			if (Array.isArray(p.category)) {
				p.category.forEach((c) => cats.add(c));
			} else if (p.category) {
				cats.add(p.category);
			}
		});
		const expectedCategories = ["All", ...Array.from(cats)];

		// Find all buttons in the filter section
		const filterButtons = wrapper.findAll("button");
		const buttonTexts = filterButtons.map((b) => b.text());

		expectedCategories.forEach((cat) => {
			expect(buttonTexts).toContain(cat);
		});
	});

	it("filters projects when a category is clicked", async () => {
		const wrapper = await mountSuspended(ProjectsIndex);

		// Find a category that is not "All" to click
		const buttons = wrapper.findAll("button");
		const nonAllButton = buttons.find((b) => b.text() !== "All");

		if (nonAllButton) {
			const categoryToFilter = nonAllButton.text();
			await nonAllButton.trigger("click");

			// Allow Vue reactivity to update
			await wrapper.vm.$nextTick();

			// After filtering, check if the displayed projects match the filter
			const projectCards = wrapper.findAllComponents({
				name: "ProjectCard",
			});

			// Check if any projects exist for this category in the JSON
			const expectedCount = Object.values(projectsData).filter((p) => {
				if (Array.isArray(p.category)) {
					return p.category.includes(categoryToFilter);
				}
				return p.category === categoryToFilter;
			}).length;

			expect(projectCards.length).toBe(expectedCount);
		}
	});

	it('shows "No projects found" if filtered list is empty', async () => {
		const wrapper = await mountSuspended(ProjectsIndex);

		// Forcibly set activeFilter to a non-existent category
		wrapper.vm.activeFilter = "NonExistentCategory123";
		await wrapper.vm.$nextTick();

		expect(wrapper.text()).toContain(
			"No projects found for the selected category.",
		);
	});
});
