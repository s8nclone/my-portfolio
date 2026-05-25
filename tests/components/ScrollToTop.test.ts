import { describe, it, expect, vi } from 'vitest';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import ScrollToTop from '../../app/components/ScrollToTop.vue';

describe('ScrollToTop', () => {
    it('is initially hidden', async () => {
        const wrapper = await mountSuspended(ScrollToTop);
        const button = wrapper.find('button');
        
        expect(button.attributes('style') || '').toContain('display: none');
    });

    it('remains hidden when scrolled less than window.innerHeight', async () => {
        const wrapper = await mountSuspended(ScrollToTop);
        
        // Mock scroll
        window.scrollY = 200;
        window.innerHeight = 800;
        
        // Trigger scroll event
        window.dispatchEvent(new Event('scroll'));
        await wrapper.vm.$nextTick();

        const button = wrapper.find('button');
        expect(button.attributes('style') || '').toContain('display: none');
    });

    it('becomes visible when scrolled past window.innerHeight', async () => {
        const wrapper = await mountSuspended(ScrollToTop);
        
        // Mock scroll past innerHeight (100dvh)
        window.scrollY = 1000;
        window.innerHeight = 800;
        
        // Trigger scroll event
        window.dispatchEvent(new Event('scroll'));
        await wrapper.vm.$nextTick();

        const button = wrapper.find('button');
        expect(button.attributes('style') || '').not.toContain('display: none');
    });

    it('smoothly scrolls to top when clicked', async () => {
        const wrapper = await mountSuspended(ScrollToTop);
        
        // Mock scrollTo
        const scrollToMock = vi.fn();
        window.scrollTo = scrollToMock;
        
        window.scrollY = 1000;
        window.innerHeight = 800;
        window.dispatchEvent(new Event('scroll'));
        await wrapper.vm.$nextTick();

        const button = wrapper.find('button');
        await button.trigger('click');

        expect(scrollToMock).toHaveBeenCalledWith({
            top: 0,
            behavior: 'smooth'
        });
    });
});
