import { describe, it, expect } from "vitest";
import { mountSuspended, mockNuxtImport } from "@nuxt/test-utils/runtime";
import AppHeader from "../../app/components/AppHeader.vue";

mockNuxtImport("useColorMode", () => {
	return () => ({
		value: "dark",
		preference: "dark",
	});
});

describe("AppHeader", () => {
	it("renders navigation links", async () => {
		const wrapper = await mountSuspended(AppHeader);

		expect(wrapper.text()).toContain("Abdulmuiz Farayola");
		expect(wrapper.text()).toContain("Home");
		expect(wrapper.text()).toContain("Projects");
		expect(wrapper.text()).toContain("Contact");
	});

	it("toggles mobile menu", async () => {
		const wrapper = await mountSuspended(AppHeader);

		const mobileMenu = wrapper.find(".md\\:hidden.py-4");
		expect(mobileMenu.attributes("style") || "").toContain("display: none");

		// Find the mobile menu toggle button. It's the button containing the Menu/X icon
		const buttons = wrapper.findAll("button");
		const toggleBtn = buttons[buttons.length - 1];

		await toggleBtn.trigger("click");
		await wrapper.vm.$nextTick();

		expect(mobileMenu.attributes("style") || "").not.toContain(
			"display: none",
		);

		await toggleBtn.trigger("click");
		await wrapper.vm.$nextTick();

		expect(mobileMenu.attributes("style") || "").toContain("display: none");
	});
});
