<template>
	<div class="min-h-screen bg-[#DAF1DE] dark:bg-[#051F20] transition-colors duration-300 relative overflow-x-hidden">
		<!-- Hero Section with DotField Background -->
		<section class="hero-section relative min-h-screen flex items-center overflow-hidden rounded-b-[4rem] max-sm:pt-32 max-sm:pb-12">
			<!-- Animated Background DotField -->
			<div class="absolute inset-0 z-0 opacity-80">
				<DotField
					:dot-radius="2 "
					:dot-spacing="15"
					:cursor-radius="400"
					:bulge-strength="75"
					glow-color="rgba(16, 185, 129, 0.4)"
				/>
			</div>

			<div class="container-width relative z-10 w-full px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-10">
				<!-- Hero Bio -->
				<div class="animate-fade-in-left max-w-2xl text-left">
					<span class="inline-block px-3 py-1 mb-4 text-xs font-mono font-bold tracking-wider text-emerald-400 bg-emerald-950/50 border border-emerald-500/30 rounded-full">
						ABOUT THE ENGINEER
					</span>
					<h1 class="text-4xl md:text-8xl font-black mb-4 text-white tracking-tight leading-none">
						Abdulmuiz <br class="hidden md:inline" />Farayola
					</h1>
					<p class="text-lg md:text-xl text-green-200 font-medium">
						Software Engineer specializing in scalable, high-performance web applications.
					</p>
				</div>

				<!-- 3D Lanyard Card representation -->
				<div class="animate-fade-in-right flex-shrink-0 relative z-20">
					<LanyardCard />
				</div>
			</div>
		</section>

		<!-- Profile Summary Section -->
		<section class="section-padding mx-5 sm:mx-10 py-20 px-6 md:px-12">
			<div class="container-width max-w-6xl mx-auto">
				<div class="bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-xl p-8 md:p-14 border border-green-100 dark:border-gray-700 animate-fade-in-up">
					<h2 class="text-3xl font-extrabold mb-6 text-primary dark:text-green-300 flex items-center gap-3">
						<User class="w-8 h-8 text-green-600 dark:text-emerald-400" />
						Profile Summary
					</h2>
					<p class="text-green-900 dark:text-green-100 text-lg leading-relaxed mb-6">
						I'm a frontend-focused Software Engineer with strong experience building scalable, high-performance web applications using React, Next.js, and TypeScript. I have a proven track record of improving application performance by up to 60% and reducing deployment cycles by 40% through modern architecture designs and performance optimizations.
					</p>
					<p class="text-green-900 dark:text-green-100 text-lg leading-relaxed">
						Progressing from a Full-Stack Developer to a Software Engineer I, I regularly contribute to core system design, scalable frontend architecture, and cloud-based deployments. I've built and scaled platforms supporting 50,000+ users across fintech, PaaS, and event ecosystems.
					</p>
				</div>
			</div>
		</section>

		<!-- Professional Experience Timeline -->
		<section class="section-padding mx-5 sm:mx-10 py-16 px-6 md:px-12 bg-white/40 dark:bg-black/20 rounded-[4rem]">
			<div class="container-width max-w-5xl mx-auto">
				<div class="text-center mb-16">
					<h2 class="text-4xl font-extrabold text-primary dark:text-green-300 tracking-tight">
						Professional Experience
					</h2>
					<p class="text-green-700 dark:text-green-400 font-medium mt-2">
						A chronological timeline of my engineering journey and milestones
					</p>
				</div>

				<div class="relative border-l-2 border-emerald-500/30 ml-4 md:ml-32 space-y-12">
					<div
						v-for="(job, index) in experiences"
						:key="index"
						class="relative pl-8 md:pl-12 group animate-fade-in-up"
						:style="{ animationDelay: `${index * 0.15}s` }"
					>
						<!-- Left Side Date Badge (Hidden on mobile) -->
						<div class="hidden md:block absolute -left-36 top-1.5 w-28 text-right">
							<span class="text-sm font-bold font-mono text-emerald-600 dark:text-emerald-400">
								{{ job.period }}
							</span>
						</div>

						<!-- Timeline node point -->
						<div class="absolute -left-[11px] top-1.5 w-5 h-5 rounded-full bg-emerald-500 border-4 border-[#DAF1DE] dark:border-[#051F20] shadow-md group-hover:scale-120 group-hover:bg-emerald-400 transition-all duration-300"></div>

						<!-- Job card -->
						<div class="bg-white dark:bg-gray-800 rounded-3xl p-6 md:p-8 shadow-md border border-green-50 dark:border-gray-700 group-hover:border-emerald-400 dark:group-hover:border-emerald-500 transition-colors duration-300">
							<div class="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-2">
								<div>
									<h3 class="text-xl font-bold text-primary dark:text-green-200">
										{{ job.role }}
									</h3>
									<p class="text-sm font-semibold text-green-700 dark:text-green-400">
										{{ job.company }} &bull; {{ job.location }}
									</p>
								</div>
								<span class="md:hidden self-start px-3 py-1 text-xs font-bold font-mono rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
									{{ job.period }}
								</span>
							</div>

							<ul class="space-y-2.5 text-green-900 dark:text-green-200 text-sm md:text-base leading-relaxed">
								<li v-for="(bullet, bIndex) in job.bullets" :key="bIndex" class="flex items-start gap-2.5">
									<span class="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0"></span>
									<span>{{ bullet }}</span>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- Skills Matrix -->
		<section class="section-padding py-20 px-6 md:px-12 mx-5 sm:mx-10">
			<div class="container-width max-w-5xl mx-auto">
				<div class="text-center mb-16">
					<h2 class="text-4xl font-extrabold text-primary dark:text-green-300 tracking-tight">
						Skills &amp; Technologies
					</h2>
					<p class="text-green-700 dark:text-green-400 font-medium mt-2">
						My engineering capabilities categorized by stack layer
					</p>
				</div>

				<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
					<div
						v-for="(category, catIndex) in skillMatrix"
						:key="catIndex"
						class="bg-white dark:bg-gray-800 rounded-3xl p-6 md:p-8 shadow-md border border-green-50/50 dark:border-gray-700 animate-fade-in-up"
						:style="{ animationDelay: `${catIndex * 0.1}s` }"
					>
						<h3 class="text-lg font-bold text-primary dark:text-emerald-400 border-b border-green-100 dark:border-gray-700 pb-3 mb-4 flex items-center gap-2">
							<component :is="category.icon" class="w-5 h-5 text-emerald-600" />
							{{ category.title }}
						</h3>
						<div class="flex flex-wrap gap-2">
							<span
								v-for="skill in category.skills"
								:key="skill"
								class="px-3 py-1.5 text-xs md:text-sm font-semibold rounded-xl bg-green-50 dark:bg-gray-900 border border-green-100/50 dark:border-gray-700 text-green-800 dark:text-green-200 hover:scale-105 hover:border-emerald-400 dark:hover:border-emerald-500 transition-all duration-300"
							>
								{{ skill }}
							</span>
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- Education & Certifications -->
		<section class="section-padding mx-5 sm:mx-10 py-20 px-6 md:px-12 bg-white/40 dark:bg-black/20 rounded-t-[4rem]">
			<div class="container-width max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
				<!-- Education -->
				<div class="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-md border border-green-50 dark:border-gray-700 flex flex-col justify-between h-full">
					<div>
						<h2 class="text-2xl font-bold mb-6 text-primary dark:text-green-200 flex items-center gap-2">
							<GraduationCap class="w-7 h-7 text-emerald-600" />
							Education
						</h2>
						<div class="space-y-4">
							<div>
								<h3 class="text-lg font-bold text-green-900 dark:text-green-100">
									Ekiti State University, Ado Ekiti
								</h3>
								<p class="text-sm font-semibold text-green-700 dark:text-green-400">
									Bachelor of Engineering (B.Eng) &bull; Computer Engineering
								</p>
								<p class="text-xs font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">
									Graduated: 07/2021
								</p>
							</div>
						</div>
					</div>
				</div>

				<!-- Certifications -->
				<div class="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-md border border-green-50 dark:border-gray-700 h-full">
					<h2 class="text-2xl font-bold mb-6 text-primary dark:text-green-200 flex items-center gap-2">
						<Award class="w-7 h-7 text-emerald-600" />
						Certifications
					</h2>
					<ul class="space-y-4">
						<li
							v-for="(cert, index) in certifications"
							:key="index"
							class="flex items-start gap-3"
						>
							<div class="w-2 h-2 rounded-full bg-emerald-500 mt-2 flex-shrink-0"></div>
							<div>
								<h3 class="text-sm font-bold text-green-900 dark:text-green-100">
									{{ cert.name }}
								</h3>
								<p class="text-xs text-green-700 dark:text-green-400">
									{{ cert.issuer }}
								</p>
							</div>
						</li>
					</ul>
				</div>
			</div>
		</section>
	</div>
</template>

<script setup lang="ts">
	import { User, GraduationCap, Award, Monitor, Server, Cloud, ShieldCheck, Smartphone, Cpu } from "lucide-vue-next";
	import DotField from "~/components/DotField.vue";
	import LanyardCard from "~/components/LanyardCard.vue";

	useHead({
		title: "About Me - Abdulmuiz Farayola",
		meta: [
			{
				name: "description",
				content: "Read the professional bio and work history of Abdulmuiz Farayola. Learn about his tech stack, timeline experience, and education.",
			},
		],
	});

	const experiences = [
		{
			role: "Software Engineer I",
			company: "Prioclen Technologies",
			location: "Abuja, Nigeria",
			period: "03/2025 – Present",
			bullets: [
				"Advanced from Full-Stack Developer role based on performance and impact.",
				"Played a key role in system design and architecture decisions, improving scalability and maintainability of core products.",
				"Engineered and optimized scalable frontend applications using Next.js and TypeScript, improving load times by up to 60% and reducing delivery timelines by ~40%.",
				"Contribute to mobile application development using Flutter, expanding product accessibility.",
				"Leveraged Model Context Protocols (MCP) to improve development workflows, reducing context-switching and accelerating feature delivery.",
				"Implement unit, integration, and end-to-end testing, improving system reliability and reducing production issues.",
				"Collaborated across engineering, product, and design teams to deliver high-quality features aligned with business goals.",
				"Mentored junior developers, improving code quality and development consistency."
			]
		},
		{
			role: "Full-Stack Developer",
			company: "Prioclen Technologies",
			location: "Abuja, Nigeria",
			period: "02/2024 – 02/2025",
			bullets: [
				"Spearheaded migration from monolithic architecture to microservices, reducing deployment time by 40%.",
				"Engineered scalable frontend applications using Next.js, improving load time by up to 60%.",
				"Designed and implemented CI/CD pipelines (GitHub Actions), reducing downtime and accelerating releases.",
				"Deployed and managed applications on GCP.",
				"Integrated analytics tools (Google Analytics, Mixpanel) to improve user engagement.",
				"Collaborated within a cross-functional team (5+), improving delivery efficiency."
			]
		},
		{
			role: "Frontend Developer (Contract)",
			company: "Bluestock Labs",
			location: "Abuja, Nigeria",
			period: "01/2023 – 01/2024",
			bullets: [
				"Built high-performance applications using Next.js and TypeScript, reducing debugging time by 50%.",
				"Improved UI performance and responsiveness through optimization techniques.",
				"Implemented scalable component systems for maintainability.",
				"Conducted cross-browser testing to ensure consistent performance."
			]
		},
		{
			role: "Frontend Developer",
			company: "Payverve",
			location: "Abuja, Nigeria",
			period: "12/2022 – 12/2023",
			bullets: [
				"Developed fintech features using React.js and React Native.",
				"Increased session duration by 25% and user satisfaction by 30% through UI optimization.",
				"Improved frontend architecture, reducing bugs and enhancing stability."
			]
		},
		{
			role: "Frontend Developer Intern (Team Lead)",
			company: "Thrive Agric",
			location: "Abuja, Nigeria",
			period: "05/2022 – 11/2022",
			bullets: [
				"Led a small team of developers in building responsive web applications using React.js and Next.js, improving coordination and delivery efficiency.",
				"Translated product requirements into actionable development tasks, ensuring timely feature implementation.",
				"Integrated REST APIs to enhance platform functionality and user experience.",
				"Implemented Redux Toolkit for efficient state management, improving application performance.",
				"Collaborated with a designer and a backend engineer to deliver a high-quality product.",
				"Contributed to a solution recognized as 2nd runner-up at Abuja Tech Converge (ATC)."
			]
		}
	];

	const skillMatrix = [
		{
			title: "Frontend Stack",
			icon: Monitor,
			skills: ["React.js", "Next.js", "Vue.js", "Nuxt.js", "Angular", "TypeScript", "Redux Toolkit", "Zustand", "Pinia", "Tailwind CSS", "SASS", "Bootstrap", "Material UI", "Radix UI", "GSAP", "Framer Motion", "Lenis Scroll", "React Query"]
		},
		{
			title: "Backend & Database",
			icon: Server,
			skills: ["Node.js", "Express.js", "Fastify", "C# (.NET)", "ASP.NET", "REST APIs", "PostgreSQL", "MongoDB", "Prisma", "Supabase"]
		},
		{
			title: "Cloud & DevOps",
			icon: Cloud,
			skills: ["Google Cloud Platform (GCP)", "Docker", "CI/CD (GitHub Actions)", "Git", "Postman", "Bruno"]
		},
		{
			title: "Mobile & Advanced",
			icon: Cpu,
			skills: ["React Native", "Flutter", "Model Context Protocols (MCP)", "AI-assisted Workflows"]
		}
	];

	const certifications = [
		{ name: "Diploma in Software Engineering", issuer: "ALX Africa" },
		{ name: "Backend Development and APIs", issuer: "FreeCodeCamp" },
		{ name: "React Learning Program", issuer: "Andela" },
		{ name: "Career Essentials in Software Development", issuer: "Microsoft & LinkedIn" },
		{ name: "Backend Web Development", issuer: "Side Hustle" }
	];
</script>
