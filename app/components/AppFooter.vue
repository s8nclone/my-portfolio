<template>
	<footer class="footer-bg relative rounded-t-[4rem]">
		<div class="container-width section-padding">
			<div class="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-8">
				<div>
					<h3 class="text-xl font-bold mb-4 text-green-100">
						Abdulmuiz Farayola
					</h3>
					<p class="text-green-200 mb-4">
						Software Engineer passionate about creating exceptional
						and accessible digital experiences.
					</p>
					<div class="flex space-x-4">
						<a
							href="https://github.com/s8nclone"
							target="_blank"
							class="text-green-200 hover:scale-150 transition-all duration-300"
							aria-label="github"
						>
							<img :src="githubLogo" alt="" class="w-5 h-5" />
						</a>
						<a
							href="https://www.linkedin.com/in/abdulmuiz-dayo-farayola-/"
							target="_blank"
							class="text-green-200 hover:scale-150 transition-all duration-300"
							aria-label="linkedIn"
						>
							<img :src="linkedIn" alt="" class="w-5 h-5" />
						</a>
						<a
							href="https://x.com/middleS8n"
							target="_blank"
							class="text-green-200 hover:scale-150 transition-all duration-300"
							aria-label="twitter/x"
						>
							<img :src="X" alt-="" class="w-5 h-5" />
						</a>
						<a
							href="https://dev.to/technvernacular"
							target="_blank"
							class="text-green-200 hover:scale-150 transition-all duration-300"
							aria-label="devdotcom"
						>
							<img :src="dev" alt-="" class="w-5 h-5" />
						</a>
					</div>
				</div>

				<div>
					<h4 class="font-semibold mb-4 text-green-100">
						Quick Links
					</h4>
					<div class="space-y-2">
						<NuxtLink
							to="/"
							class="block text-green-200 hover:text-white transition-colors duration-300"
						>
							Home
						</NuxtLink>
						<NuxtLink
							to="/projects"
							class="block text-green-200 hover:text-white transition-colors duration-300"
						>
							Projects
						</NuxtLink>
						<NuxtLink
							to="/contact"
							class="block text-green-200 hover:text-white transition-colors duration-300"
							active-class="text-white"
						>
							Contact
						</NuxtLink>
					</div>
				</div>

				<div id="contact">
					<h4 class="font-semibold mb-4 text-green-100">
						Get In Touch
					</h4>
					<div class="space-y-2 text-green-200">
						<a
							href="mailto:farayolajunior20@gmail.com"
							class="flex items-center"
							aria-label="my email"
						>
							<Mail class="w-4 h-4 mr-2" />
							farayolajunior20@gmail.com
						</a>
						<p class="flex items-center">
							<MapPin class="w-4 h-4 mr-2" />
							Nigeria
						</p>
					</div>
				</div>

                <div id="contact" class="space-y-2">
                    <div>
                        <h4 class="font-semibold mb-2 text-green-100">
                            Book a meeting
                        </h4>
                        <div class="space-y-1 text-green-200">
                            <a
                                href="https://cal.com/muizz"
                                target="_blank"
                                class="flex items-center"
                                aria-label="Book a meeting"
                            >
                                <CalendarCheck class="w-4 h-4 mr-2" />
                                Book Me
                            </a>
                        </div>
                    </div>
    
                    <div>
                        <h4 class="font-semibold mb-2 text-green-100">
                            Download Resume
                        </h4>
                        <div class="space-y-1 text-green-200">
                            <a
                                href="https://drive.google.com/file/d/11QYW6ImEty1pzZcjOPs9fQ-aJAGblowK/view?usp=sharing"
                                target="_blank"
                                class="flex items-center"
                                aria-label="Download resume"
                            >
                                <Download class="w-4 h-4 mr-2" />
                                Download
                            </a>
                        </div>
                    </div>
                </div>

			</div>

			<div class="my-4 md:my-8">
				<CurvedLoop
					marqueeText="✦ SOFTWARE ENGINEER ✦ FRONTEND ENGINEER ✦ SOFTWARE DEVELOPER ✦ FULL STACK ENGINEER ✦ FRONTEND DEVELOPER ✦ "
					:speed="8"
					direction="left"
					:interactive="true"
					className="text-[30rem] md:text-[20rem] fill-green-200 dark:fill-green-400 "
				/>
			</div>

			<!-- Digital Clock Section -->
			<div class="">
                <DigitalClock />
			</div>

			<div
				class="border-t border-green-700 mt-8 pt-6 text-center text-green-200"
			>
				<p>
					&copy; {{ new Date().getFullYear() }} Abdulmuiz Farayola.
					All rights reserved.
				</p>
				<p>Powered by <span>Nuxt</span></p>
			</div>
		</div>
	</footer>
</template>

<script setup lang="ts">
	import { Download, Mail, MapPin, CalendarCheck } from "lucide-vue-next";
	import { githubLogo, X, dev, linkedIn } from "~/assets/icons";
    import DigitalClock from "./DigitalClock.vue";
    import CurvedLoop from "./CurvedLoop.vue";

</script>
