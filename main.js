import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

// Register GSAP Plugin
gsap.registerPlugin(ScrollTrigger);

// 1. Initialize Lenis for Smooth Scroll
const lenis = new Lenis({
    duration: 1.5,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Integrate Lenis with GSAP ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);


// 2. Custom Cursor Logic
const cursor = document.querySelector('.cursor');
const hoverTargets = document.querySelectorAll('.hover-target, a, .menu-btn');

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let cursorX = window.innerWidth / 2;
let cursorY = window.innerHeight / 2;

// Track mouse position
window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// Smoothly move the cursor using GSAP lag/easing approach
function easeCursor() {
    cursorX += (mouseX - cursorX) * 0.15;
    cursorY += (mouseY - cursorY) * 0.15;
    
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
    
    requestAnimationFrame(easeCursor);
}
easeCursor();

// Hover effect for Cursor
hoverTargets.forEach(target => {
    target.addEventListener('mouseenter', () => {
        cursor.classList.add('hovered');
    });
    target.addEventListener('mouseleave', () => {
        cursor.classList.remove('hovered');
    });
});


// 3. Cinematic Loader Sequence
const loader = document.querySelector('.loader');
const counter = document.querySelector('.counter');
const loaderLogo = document.querySelector('.loader-logo');

let progress = 0;
const targetProgress = 100;

function updateLoader() {
    // Fake loading progress
    progress += Math.random() * 2;
    if (progress > targetProgress) progress = targetProgress;
    
    counter.textContent = Math.floor(progress);
    
    if (progress < targetProgress) {
        requestAnimationFrame(updateLoader);
    } else {
        // Loader fully loaded -> Start GSAP timeline
        startIntro();
    }
}

// Start loading simulation
setTimeout(updateLoader, 500);

function startIntro() {
    const tl = gsap.timeline();
    
    // Animate loader away
    tl.to(loaderLogo, { y: -50, opacity: 0, duration: 0.8, ease: "power4.out" })
      .to(loader, { yPercent: -100, duration: 1.2, ease: "power4.inOut" }, "-=0.3")
      .from('.global-glass-bg', { scale: 1.1, opacity: 0, duration: 2, ease: "power3.out" }, "-=0.5")
      .from('.hero-text-bg', { scale: 0.8, opacity: 0, duration: 2, ease: "power3.out" }, "-=1.5")
      .from('.header', { y: -50, opacity: 0, duration: 1 }, "-=1")
      .from('.hero-tiny-top', { y: 20, opacity: 0, duration: 1, ease: "power3.out" }, "-=1")
      .to('.hero-title .word', { y: 0, opacity: 1, stagger: 0.2, duration: 1.5, ease: "power4.out" }, "-=0.8")
      .from('.hero-divider', { height: 0, opacity: 0, duration: 1, ease: "power4.inOut" }, "-=1")
      .from('.hero-subtitle', { y: 30, opacity: 0, duration: 1.5, ease: "power3.out" }, "-=0.8")
      .from('.magnetic-btn', { scale: 0.8, opacity: 0, duration: 1, ease: "power4.out" }, "-=1")
      .from('.mouse-scroll-indicator', { opacity: 0, duration: 1 }, "-=0.5");
}

// 4. GSAP ScrollTrigger Animations

// Magnetic Buttons Logic for 3D Professionalism
const magneticBtns = document.querySelectorAll('.magnetic-btn');

magneticBtns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const h = rect.width / 2;
        
        const x = e.clientX - rect.left - h;
        const y = e.clientY - rect.top - (rect.height / 2);

        gsap.to(btn, {
            x: x * 0.4,
            y: y * 0.4,
            duration: 0.5,
            ease: "power3.out"
        });
    });

    btn.addEventListener('mouseleave', () => {
        gsap.to(btn, {
            x: 0,
            y: 0,
            duration: 0.7,
            ease: "elastic.out(1, 0.3)"
        });
    });
});

// Hero bg parallax
gsap.to(".hero-bg", {
    yPercent: 30,
    ease: "none",
    scrollTrigger: {
        trigger: ".hero-section",
        start: "top top",
        end: "bottom top",
        scrub: true
    }
});

// Horizontal Gallery Scroll
const gallerySection = document.querySelector('.gallery-section');
const galleryContainer = document.querySelector('.gallery-container');

// Calculate the total width to move
function getScrollAmount() {
    let galleryWidth = galleryContainer.scrollWidth;
    return -(galleryWidth - window.innerWidth);
}

const tween = gsap.to(galleryContainer, {
    x: getScrollAmount,
    duration: 3,
    ease: "none"
});

ScrollTrigger.create({
    trigger: gallerySection,
    start: "top 20%",
    end: () => `+=${getScrollAmount() * -1}`,
    pin: true,
    animation: tween,
    scrub: 1,
    invalidateOnRefresh: true
});

// Image parallax inside the horizontal scroll
gsap.utils.toArray('.gallery-img').forEach((img, i) => {
    gsap.fromTo(img, 
        { scale: 1.2 }, 
        { 
            scale: 1, 
            ease: "none",
            scrollTrigger: {
                trigger: img.parentElement,
                containerAnimation: tween,
                start: "left right",
                end: "right left",
                scrub: true
            }
        }
    );
});

// Fade in statement section
gsap.from('.statement-text', {
    y: 100,
    opacity: 0,
    duration: 1.5,
    ease: "power4.out",
    scrollTrigger: {
        trigger: ".statement-section",
        start: "top 80%",
        toggleActions: "play none none reverse"
    }
});

// Modal Logic
window.toggleModal = function(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.classList.toggle('active');
    }
};
