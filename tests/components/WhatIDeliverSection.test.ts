import { describe, it, expect } from 'vitest';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import WhatIDeliverSection from '../../app/components/WhatIDeliverSection.vue';

describe('WhatIDeliverSection', () => {
    it('renders heading and descriptive text', async () => {
        const wrapper = await mountSuspended(WhatIDeliverSection);
        
        expect(wrapper.text()).toContain('What I Deliver');
        expect(wrapper.text()).toContain('I build high-performance, reliable, and beautifully crafted software solutions');
    });

    it('renders all six services', async () => {
        const wrapper = await mountSuspended(WhatIDeliverSection);
        
        expect(wrapper.text()).toContain('Frontend Development');
        expect(wrapper.text()).toContain('Backend & API Design');
        expect(wrapper.text()).toContain('Mobile Applications');
        expect(wrapper.text()).toContain('Cloud Infrastructure & DevOps');
        expect(wrapper.text()).toContain('System Design & Architecture');
        expect(wrapper.text()).toContain('Performance & SEO Audit');
    });
});
