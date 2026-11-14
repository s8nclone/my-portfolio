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

		const toggleBtn = wrapper.find("button.sm-toggle");
		expect(toggleBtn.exists()).toBe(true);
		expect(toggleBtn.attributes("aria-expanded")).toBe("false");

		await toggleBtn.trigger("click");
		await wrapper.vm.$nextTick();

		expect(toggleBtn.attributes("aria-expanded")).toBe("true");

		await toggleBtn.trigger("click");
		await wrapper.vm.$nextTick();

		expect(toggleBtn.attributes("aria-expanded")).toBe("false");
	});
});
