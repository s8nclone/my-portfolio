import { describe, it, expect, vi } from 'vitest';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import ContactPage from '../../app/pages/contact.vue';

describe('Contact Page', () => {
    it('renders the page title and inviting subheader', async () => {
        const wrapper = await mountSuspended(ContactPage);
        
        expect(wrapper.text()).toContain('Get In Touch');
        expect(wrapper.text()).toContain('Have a project in mind, want to collaborate, or just say hello?');
    });

    it('renders the contact form with all required fields', async () => {
        const wrapper = await mountSuspended(ContactPage);
        
        const nameInput = wrapper.find('input[id="name"]');
        const emailInput = wrapper.find('input[id="email"]');
        const messageInput = wrapper.find('textarea[id="message"]');
        const submitButton = wrapper.find('button[type="submit"]');

        expect(nameInput.exists()).toBe(true);
        expect(emailInput.exists()).toBe(true);
        expect(messageInput.exists()).toBe(true);
        expect(submitButton.exists()).toBe(true);
        expect(submitButton.text()).toContain('Send Message');
    });

    it('initializes with default empty values', async () => {
        const wrapper = await mountSuspended(ContactPage);
        
        const nameInput = wrapper.find('input[id="name"]').element as HTMLInputElement;
        const emailInput = wrapper.find('input[id="email"]').element as HTMLInputElement;
        const messageInput = wrapper.find('textarea[id="message"]').element as HTMLTextAreaElement;

        expect(nameInput.value).toBe('');
        expect(emailInput.value).toBe('');
        expect(messageInput.value).toBe('');
    });
});
