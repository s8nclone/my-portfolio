import { describe, it, expect } from 'vitest';
import { mountSuspended, mockNuxtImport } from '@nuxt/test-utils/runtime';
import ProjectSlug from '../../app/pages/projects/[slug].vue';
import projectsData from '../../app/public/projects.json';

// We need a mutable object to change route params between tests
const mockRouteParams = { slug: Object.keys(projectsData)[0] };

mockNuxtImport('useRoute', () => {
    return () => ({
        params: mockRouteParams
    });
});

describe('ProjectSlug Page', () => {
    it('renders project details when a valid slug is provided', async () => {
        const validSlug = Object.keys(projectsData)[0];
        mockRouteParams.slug = validSlug;
        // Type cast to match the any type returned from JSON
        const project = (projectsData as Record<string, any>)[validSlug];

        const wrapper = await mountSuspended(ProjectSlug);
        
        expect(wrapper.text()).toContain(project.title);
        expect(wrapper.text()).toContain(project.description);
        expect(wrapper.text()).toContain(project.overview);
    });

    it('renders "Project Not Found" when an invalid slug is provided', async () => {
        mockRouteParams.slug = 'invalid-slug-123';

        const wrapper = await mountSuspended(ProjectSlug);
        
        expect(wrapper.text()).toContain('Project Not Found');
        expect(wrapper.text()).toContain("The project you're looking for doesn't exist.");
    });
});
