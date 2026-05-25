<template>
    <div class="min-h-screen bg-[#DAF1DE] dark:bg-[#051F20] transition-colors duration-300">
        <!-- Hero Section -->
        <section class="section-padding hero-section relative rounded-b-[4rem] h-[55dvh] flex items-center">
            <div class="container-width text-center">
                <h1 class="text-3xl md:text-5xl font-bold mb-6 animate-fade-in-up text-white">
                    Get In Touch
                </h1>
                <p class="text-lg md:text-xl text-green-200 max-w-3xl mx-auto animate-fade-in-up" style="animation-delay: 0.2s">
                    Have a project in mind, want to collaborate, or just say hello? Drop me a message!
                </p>
            </div>
        </section>

        <!-- Form Section -->
        <section class="py-16 px-4 relative z-10">
            <div class="max-w-2xl mx-auto">
                <div class="bg-white dark:bg-gray-800 shadow-xl border border-green-100 dark:border-gray-700 rounded-3xl p-8 md:p-12 animate-fade-in-up transition-all duration-300" style="animation-delay: 0.4s">
                    
                    <div v-if="submitted" class="text-center py-8 animate-fade-in-up">
                        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 mb-6">
                            <CheckCircle2 class="w-10 h-10" />
                        </div>
                        <h3 class="text-2xl font-bold text-primary dark:text-green-300 mb-2">Message Sent!</h3>
                        <p class="text-green-800 dark:text-green-200 mb-6">Thank you, {{ form.name }}. I appreciate you reaching out and will get back to you as soon as possible.</p>
                        <button @click="resetForm" class="btn-primary">
                            Send Another Message
                        </button>
                    </div>

                    <form v-else @submit.prevent="handleSubmit" class="space-y-6">
                        <!-- Name Field -->
                        <div>
                            <label :for="nameId" class="text-sm font-semibold text-primary dark:text-green-400 mb-2 flex items-center">
                                <User class="w-4 h-4 mr-2 text-primary dark:text-green-400" />
                                Name
                            </label>
                            <input 
                                :id="nameId"
                                v-model="form.name"
                                type="text"
                                required
                                placeholder="Your Name"
                                class="w-full px-4 py-3 rounded-xl border border-green-200 dark:border-gray-600 bg-green-50/30 dark:bg-gray-700/50 text-primary dark:text-green-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
                                :disabled="loading"
                            />
                        </div>

                        <!-- Email Field -->
                        <div>
                            <label :for="emailId" class="text-sm font-semibold text-primary dark:text-green-400 mb-2 flex items-center">
                                <Mail class="w-4 h-4 mr-2 text-primary dark:text-green-400" />
                                Email Address
                            </label>
                            <input 
                                :id="emailId"
                                v-model="form.email"
                                type="email"
                                required
                                placeholder="name@example.com"
                                class="w-full px-4 py-3 rounded-xl border border-green-200 dark:border-gray-600 bg-green-50/30 dark:bg-gray-700/50 text-primary dark:text-green-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
                                :disabled="loading"
                            />
                        </div>

                        <!-- Subject Field -->
                        <div>
                            <label :for="subjectId" class="text-sm font-semibold text-primary dark:text-green-400 mb-2 flex items-center">
                                <NotebookPen class="w-4 h-4 mr-2 text-primary dark:text-green-400" />
                                Subject
                            </label>
                            <input 
                                :id="subjectId"
                                v-model="form.subject"
                                type="text"
                                placeholder="Subject"
                                class="w-full px-4 py-3 rounded-xl border border-green-200 dark:border-gray-600 bg-green-50/30 dark:bg-gray-700/50 text-primary dark:text-green-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
                                :disabled="loading"
                            />
                        </div>

                        <!-- Message Field -->
                        <div>
                            <label :for="messageId" class="text-sm font-semibold text-primary dark:text-green-400 mb-2 flex items-center">
                                <MessageSquare class="w-4 h-4 mr-2 text-primary dark:text-green-400" />
                                Message
                            </label>
                            <textarea 
                                :id="messageId"
                                v-model="form.message"
                                required
                                rows="5"
                                placeholder="Tell me about your project or what's on your mind..."
                                class="w-full px-4 py-3 rounded-xl border border-green-200 dark:border-gray-600 bg-green-50/30 dark:bg-gray-700/50 text-primary dark:text-green-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
                                :disabled="loading"
                            ></textarea>
                        </div>

                        <!-- Error Banner -->
                        <div v-if="error" class="p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-xl border border-red-200 dark:border-red-800 text-sm">
                            {{ error }}
                        </div>

                        <!-- Submit Button -->
                        <div>
                            <button 
                                type="submit" 
                                class="w-full btn-primary flex items-center justify-center space-x-2 py-4 shadow-lg shadow-green-700/20 dark:shadow-green-900/30"
                                :disabled="loading"
                            >
                                <span v-if="loading" class="animate-spin mr-2">
                                    <Loader2 class="w-5 h-5" />
                                    <span className="sr-only">Loading</span>
                                </span>
                                <span v-else class="flex items-center">
                                    Send Message
                                    <Send class="w-4 h-4 ml-2" />
                                </span>
                            </button>
                        </div>
                    </form>

                </div>
            </div>
        </section>

        <section class="mb-16">
            <WhatIDeliverSection />
        </section>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, useId } from "vue";
import { User, Mail, NotebookPen, MessageSquare, Send, CheckCircle2, Loader2 } from "lucide-vue-next";

useHead({
    title: "Contact - Abdulmuiz Farayola",
    meta: [
        {
            name: "description",
            content: "Get in touch with Abdulmuiz Farayola. Submit a message for collaborations, freelance project queries, or general questions.",
        },
    ],
});

const baseId = useId()

const form = reactive({
    name: "",
    email: "",
    subject: "",
    message: "",
});

const nameId = `${baseId}-name`;
const emailId = `${baseId}-email`;
const subjectId = `${baseId}-subject`;
const messageId = `{baseId}-message`;

const loading = ref(false);
const submitted = ref(false);
const error = ref<string | null>(null);

const handleSubmit = async () => {
    loading.value = true;
    error.value = null;

    try {
        await $fetch("/api/contact", {
            method: "POST",
            body: {
                name: form.name,
                email: form.email,
                subject: form.subject,
                message: form.message,
            },
        });
        submitted.value = true;
    } catch (err: any) {
        console.error("Contact form submission error:", err);
        error.value = err.data?.message || "An error occurred while sending your message. Please try again later.";
    } finally {
        loading.value = false;
    }
};

const resetForm = () => {
    form.name = "";
    form.email = "";
    form.subject = "";
    form.message = "";
    submitted.value = false;
    error.value = null;
};
</script>
