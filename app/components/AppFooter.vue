<template>
    <footer
        class="footer-bg relative rounded-t-[4rem] "
    >
        <div class="container-width section-padding ">
            <div class="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-8 ">
                <div>
                    <h3 class="text-xl font-bold mb-4 text-green-100">
                        Abdulmuiz Farayola
                    </h3>
                    <p class="text-green-200 mb-4">
                        Software Engineer passionate about creating
                        exceptional and accessible digital experiences.
                    </p>
                    <div class="flex space-x-4">
                        <a
                            href="https://github.com/s8nclone"
                            target="_blank"
                            class="text-green-200 hover:scale-150 transition-all duration-300"
                            aria-label="github"
                        >
                            <!-- <Github class="w-5 h-5" /> -->
                            <img :src="githubLogo" alt="" class="w-5 h-5" />
                        </a>
                        <a
                            href="https://www.linkedin.com/in/abdulmuiz-dayo-farayola-/"
                            target="_blank"
                            class="text-green-200 hover:scale-150 transition-all duration-300"
                            aria-label="linkedIn"
                        >
                            <!-- <Linkedin class="w-5 h-5" /> -->
                            <img :src="linkedIn" alt="" class="w-5 h-5" />
                        </a>
                        <a
                            href="https://x.com/middleS8n"
                            target="_blank"
                            class="text-green-200 hover:scale-150 transition-all duration-300"
                            aria-label="twitter/x"
                        >
                            <!-- <Twitter class="w-5 h-5" /> -->
                            <img :src="X" alt-="" class="w-5 h-5" />
                        </a>
                        <a
                            href="https://dev.to/technvernacular"
                            target="_blank"
                            class="text-green-200 hover:scale-150 transition-all duration-300"
                            aria-label="devdotcom"
                        >
                            <!-- <Twitter class="w-5 h-5" /> -->
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
                        <a href="mailto:farayolajunior20@gmail.com" class="flex items-center" aria-label="my email">
                            <Mail class="w-4 h-4 mr-2" />
                            farayolajunior20@gmail.com
                        </a>
                        <p class="flex items-center">
                            <MapPin class="w-4 h-4 mr-2" />
                            Nigeria
                        </p>
                    </div>
                </div>

                <div id="contact">
                    <h4 class="font-semibold mb-4 text-green-100">
                        Download Resume
                    </h4>
                    <div class="space-y-2 text-green-200">
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

            <!-- Digital Clock Section -->
            <div class="clock-container ">
                <div class="clock-wrapper">
                    <main id="clock-main"></main>
                </div>
            </div>

            <div
                class="border-t border-green-700 mt-8 pt-6 text-center text-green-200 "
            >
                <p>
                    &copy; {{ new Date().getFullYear() }} Abdulmuiz Farayola. All rights
                    reserved.
                </p>
                <p>Powered by <span>Nuxt</span></p>
            </div>
        </div>
    </footer>
</template>

<script setup lang="ts">
import { Download, Mail, MapPin } from "lucide-vue-next";
import { githubLogo, X, dev, linkedIn } from "~/assets/icons";
import { onMounted, onBeforeUnmount } from "vue";

onMounted(() => {
    const bars = [
        ['end', 'top'],
        ['side', 'top', 'left'],
        ['side', 'top', 'right'],
        ['middle'],
        ['side', 'bottom', 'left'],
        ['side', 'bottom', 'right'],
        ['end', 'bottom']
    ];

    const main = document.getElementById('clock-main');
    if (!main) return;

    const addDigits = (number: number) => {
        const initGroup = (num: number, padding = 2) => {
          let currentNum = num;
          const groupElement = document.createElement('div');
          groupElement.classList.add('group');
          
          const digits = [...`${currentNum}`.padStart(padding, '0')].map(digit => {
              const digitElement = document.createElement('figure');
              digitElement.classList.add('digit');
              digitElement.setAttribute('data-digit', digit);
              
              bars.forEach(classes => {
                  const span = document.createElement('span');
                  span.classList.add(...classes);
                  digitElement.append(span);
              });
              
              return digitElement;
          });
          
          digits.forEach(digit => groupElement.append(digit));
          
          const setNumber = (val: number) => {
              currentNum = val;
              const padded = `${currentNum}`.padStart(padding, '0');
              const substringStart = Math.max(0, padded.length - padding);
              const lastDigits = padded.substring(substringStart);
              
              [...lastDigits].forEach((digit, i) => {
                  if (digits[i]) {
                      digits[i].setAttribute('data-digit', digit);
                  }
              });
          };
          
          return {
              element: groupElement,
              set number(val: number) {
                  setNumber(val);
              },
              get number() {
                  return currentNum;
              }
          };
      };

        const digits = document.createElement('div');
        digits.classList.add('digits');
        const group = initGroup(number);
        const groupShadow1 = initGroup(number);
        const groupShadow2 = initGroup(number);
        groupShadow1.element.classList.add('shadow');
        groupShadow1.element.classList.add('shadow1');
        groupShadow2.element.classList.add('shadow');
        groupShadow2.element.classList.add('shadow2');
        digits.append(group.element);
        digits.append(groupShadow1.element);
        digits.append(groupShadow2.element);
        main.append(digits);

        return {
            set number(val: number) {
                number = val;
                group.number = val;
                groupShadow1.number = val;
                groupShadow2.number = val;
            },
            get number() {
                return number;
            }
        };
    };

    const addColon = () => {
        const colonGroup = document.createElement('div');
        colonGroup.classList.add('colon-group');
        const colon = document.createElement('figure');
        colon.append(document.createElement('span'));
        const colonShadow1 = document.createElement('figure');
        colonShadow1.append(document.createElement('span'));
        const colonShadow2 = document.createElement('figure');
        colonShadow2.append(document.createElement('span'));
        colon.classList.add('colon');
        colonShadow1.classList.add('colon', 'shadow', 'shadow1');
        colonShadow2.classList.add('colon', 'shadow', 'shadow2');
        colonGroup.append(colon);
        colonGroup.append(colonShadow1);
        colonGroup.append(colonShadow2);
        main.append(colonGroup);
    };

    const initClock = () => {
        let now = new Date();
        let hours = now.getHours();
        let minutes = now.getMinutes();
        let seconds = now.getSeconds();

        const numberHour = addDigits(hours);
        addColon();
        const numberMinute = addDigits(minutes);
        addColon();
        const numberSecond = addDigits(seconds);

        let animationFrameId: number;
        const update = () => {
            now = new Date();
            const newSeconds = now.getSeconds();
            if (seconds !== newSeconds) {
                hours = now.getHours();
                minutes = now.getMinutes();
                seconds = newSeconds;
                numberHour.number = hours;
                numberMinute.number = minutes;
                numberSecond.number = seconds;
            }
            animationFrameId = requestAnimationFrame(update);
        };
        update();

        onBeforeUnmount(() => {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        });
    };

    if (/^(?:(?!chrome|android)[\s\S])*(?:safari|iPad|iPhone|iPod)/i.test(navigator.userAgent)) {
        document.body.classList.add('safari');
    }

    initClock();
});
</script>

<style scoped>
  .clock-container {
    perspective: 45em;
    transform-style: preserve-3d;
    width: 100%;
    height: 20em;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 1em 0;
  }

  .clock-wrapper {
    /* animation: camera-rotate 40s ease-in-out forwards infinite; */
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1vmin;
  }

  #clock-main {
    --s: 100%;
    --l: 50%;
    display: flex;
    color: rgba(255, 255, 255, 0.3);
    gap: 1em;
    width: 100%;
    height: 100%;
    position: relative;
    align-items: center;
    justify-content: center;
    animation-composition: add;
    animation: hue-rotate 20s linear infinite;
    translate: 0em 1em 10em;
    transform-style: preserve-3d;
  }

  /* camera-pan 30s linear forwards infinite */

  :deep(.digits) {
    transform-style: preserve-3d;
  }

  :deep(.digits .group) {
    display: flex;
    gap: 2em;
  }

  :deep(.digits .group .digit) {
    position: relative;
    height: 16em;
    aspect-ratio: 1/2;
    filter: drop-shadow(0px 0px 4px currentColor) drop-shadow(0px 0px 10px currentColor);
  }

  :deep(.digits .group .digit span) {
    --act: 0;
    --signX: 1;
    --signY: 1;
    position: absolute;
    background-color: white;
    transition: all 0.3s cubic-bezier(0.17, 0.67, 0.5, 1.15);
    opacity: calc(0.03 + 0.97 * var(--act));
    animation-composition: add;
    transform: scale(var(--signX), var(--signY));
  }

  :deep(.digits .group .digit span.end) {
    clip-path: polygon(15% 0%, 7.5% 20%, 25% 100%, 75% 100%, 92.5% 20%, 85% 0%);
    width: 100%;
    height: 10%;
  }

  :deep(.digits .group .digit span.end.top) {
    top: 0;
  }

  :deep(.digits .group .digit span.end.bottom) {
    top: initial;
    bottom: 0;
    --signY: -1;
  }

  :deep(.digits .group .digit span.side) {
    clip-path: polygon(0% 15%, 20% 7.5%, 100% 22.5%, 100% 85%, 20% 95%, 0% 90%);
    height: 50%;
    width: 20%;
  }

  :deep(.digits .group .digit span.side.left) {
    top: 0;
    left: 0;
  }

  :deep(.digits .group .digit span.side.left.bottom) {
    top: initial;
    bottom: 0;
    --signY: -1;
  }

  :deep(.digits .group .digit span.side.right) {
    top: 0;
    left: initial;
    right: 0;
    --signX: -1;
  }

  :deep(.digits .group .digit span.side.right.bottom) {
    top: initial;
    --signY: -1;
    bottom: 0;
  }

  :deep(.digits .group .digit span.middle) {
    clip-path: polygon(22.5% 0%, 6.5% 50%, 22.5% 100%, 77.5% 100%, 93.5% 50%, 77.5% 0%);
    top: 45%;
    height: 10%;
    width: 100%;
  }

  :deep(.digits .group .digit[data-digit="0"] :not(.middle)) {
    --act: 1;
  }

  :deep(.digits .group .digit[data-digit="1"] .right) {
    --act: 1;
  }

  :deep(.digits .group .digit[data-digit="2"] :not(.top.left, .bottom.right)) {
    --act: 1;
  }

  :deep(.digits .group .digit[data-digit="3"] :not(.left)) {
    --act: 1;
  }

  :deep(.digits .group .digit[data-digit="4"] :not(.end, .bottom.left)) {
    --act: 1;
  }

  :deep(.digits .group .digit[data-digit="5"] :not(.top.right, .bottom.left)) {
    --act: 1;
  }

  :deep(.digits .group .digit[data-digit="6"] :not(.top.right)) {
    --act: 1;
  }

  :deep(.digits .group .digit[data-digit="7"] .top),
  :deep(.digits .group .digit[data-digit="7"] .right) {
    --act: 1;
  }

  :deep(.digits .group .digit[data-digit="8"] > *) {
    --act: 1;
  }

  :deep(.digits .group .digit[data-digit="9"] :not(.bottom.left)) {
    --act: 1;
  }

  :deep(.colon-group) {
    transform-style: preserve-3d;
  }

  :deep(.colon-group .colon span) {
    display: flex;
    height: 16em;
    flex-direction: column;
    justify-content: space-evenly;
    width: 4em;
    align-items: center;
    filter: drop-shadow(0px 0px 4px currentColor) drop-shadow(0px 0px 10px currentColor);
  }

  :deep(.colon-group .colon span::before),
  :deep(.colon-group .colon span::after) {
    content: "";
    display: block;
    width: 2em;
    aspect-ratio: 1/1;
    background-color: white;
    border-radius: 2em;
  }

  :deep(.shadow) {
    top: 0;
    position: absolute;
    transform-origin: bottom center;
    transform: translateY(1em) translateZ(2em) rotateX(-90.1deg);
  }

  :deep(.shadow .digit span) {
    opacity: var(--act);
  }

  :deep(.shadow.shadow1) {
    opacity: 0.5;
    filter: drop-shadow(0px 0px 4px currentColor) drop-shadow(0px 0px 10px currentColor) blur(4em);
  }

  :deep(.shadow.shadow1 > span),
  :deep(.shadow.shadow1 .digit) {
    mask-image: linear-gradient(to bottom, white, rgba(0, 0, 0, 0.5));
  }

  :deep(.shadow.shadow2) {
    opacity: 0.4;
    filter: drop-shadow(0px 0px 4px currentColor) drop-shadow(0px 0px 10px currentColor) blur(4px);
  }

  :deep(.shadow.shadow2 > span),
  :deep(.shadow.shadow2 .digit) {
    opacity: var(--act);
    mask-image: linear-gradient(to top, black, rgba(0, 0, 0, 0.1) 60%, rgba(0, 0, 0, 0));
  }

  @keyframes camera-rotate {
    0% {
      transform: rotateY(-10deg);
    }
    50% {
      transform: rotateY(10deg);
    }
    100% {
      transform: rotateY(-10deg);
    }
  }

  @keyframes camera-pan {
    0% {
      transform: translate(0em, 0em);
    }
    20% {
      transform: translate(1em, 2em);
    }
    40% {
      transform: translate(-2em, 2.5em);
    }
    50% {
      transform: translate(-1.5em, 1.5em);
    }
    70% {
      transform: translate(-0.5em, -0.5em);
    }
    90% {
      transform: translate(1.5em, -1em);
    }
    100% {
      transform: translate(0em, 0em);
    }
  }

  @keyframes hue-rotate {
    0% {
      color: hsl(0deg, var(--s), var(--l));
    }
    8.33% {
      color: hsl(30deg, var(--s), var(--l));
    }
    16.67% {
      color: hsl(60deg, var(--s), var(--l));
    }
    25% {
      color: hsl(90deg, var(--s), var(--l));
    }
    33.33% {
      color: hsl(120deg, var(--s), var(--l));
    }
    41.67% {
      color: hsl(150deg, var(--s), var(--l));
    }
    50% {
      color: hsl(180deg, var(--s), var(--l));
    }
    58.33% {
      color: hsl(210deg, var(--s), var(--l));
    }
    66.67% {
      color: hsl(240deg, var(--s), var(--l));
    }
    75% {
      color: hsl(270deg, var(--s), var(--l));
    }
    83.33% {
      color: hsl(300deg, var(--s), var(--l));
    }
    91.67% {
      color: hsl(330deg, var(--s), var(--l));
    }
    100% {
      color: hsl(360deg, var(--s), var(--l));
    }
  }

  :deep(.safari .digit span) {
    transition: none !important;
  }

  :deep(.safari .digit span::before) {
    content: "";
    position: absolute;
    display: block;
    width: 400%;
    height: 400%;
    top: 0;
    left: 0;
    transform: translate(-50%, -50%);
  }
</style>
