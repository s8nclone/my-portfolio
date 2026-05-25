import { describe, it, expect } from 'vitest';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import TheProcessSection from '../../app/components/TheProcessSection.vue';

describe('TheProcessSection', () => {
    it('renders heading and descriptive text', async () => {
        const wrapper = await mountSuspended(TheProcessSection);
        
        expect(wrapper.text()).toContain('The Development Process');
        expect(wrapper.text()).toContain('A systematic, transparent, and user-centric workflow');
    });

    it('renders the development phases and checklisted items', async () => {
        const wrapper = await mountSuspended(TheProcessSection);
        
        expect(wrapper.text()).toContain('Research & Discovery');
        expect(wrapper.text()).toContain('Phase 01');
        expect(wrapper.text()).toContain('Requirement mapping workshops');
        
        expect(wrapper.text()).toContain('Architecture & Design');
        expect(wrapper.text()).toContain('Phase 02');
        
        expect(wrapper.text()).toContain('Agile Development');
        expect(wrapper.text()).toContain('Phase 03');
        
        expect(wrapper.text()).toContain('Deployment & CI/CD');
        expect(wrapper.text()).toContain('Phase 04');
        
        expect(wrapper.text()).toContain('Maintenance & Scale');
        expect(wrapper.text()).toContain('Phase 05');
    });
});
