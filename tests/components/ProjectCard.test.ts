import { describe, it, expect } from 'vitest';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import ProjectCard from '../../app/components/ProjectCard.vue';

describe('ProjectCard', () => {
    const mockProject = {
        title: 'Test Project',
        slug: 'test-project',
        description: 'This is a test description',
        technologies: ['Vue', 'Nuxt', 'TypeScript'],
        image: 'test.jpg'
    };

    it('renders project title and description correctly', async () => {
        const wrapper = await mountSuspended(ProjectCard, {
            props: {
                project: mockProject
            }
        });

        expect(wrapper.text()).toContain('Test Project');
        expect(wrapper.text()).toContain('This is a test description');
    });

    it('renders all technologies as tags', async () => {
        const wrapper = await mountSuspended(ProjectCard, {
            props: {
                project: mockProject
            }
        });

        expect(wrapper.text()).toContain('Vue');
        expect(wrapper.text()).toContain('Nuxt');
        expect(wrapper.text()).toContain('TypeScript');
    });
});
