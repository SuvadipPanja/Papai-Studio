import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

// ─────────────────────────────────────────────
// 1. SMOOTH SCROLL (Lenis)
// ─────────────────────────────────────────────
const lenis = new Lenis({
    duration: 1.4,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothTouch: false,
});

lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

// ─────────────────────────────────────────────
// 2. CUSTOM CURSOR (desktop only)
// ─────────────────────────────────────────────
const isMobile = () => window.matchMedia('(max-width: 768px)').matches;
const cursor = document.getElementById('cursor');

if (cursor && !isMobile()) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let cursorX = mouseX;
    let cursorY = mouseY;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Smooth lagged cursor — camera shoulder = hotspot
    // SVG width=28. Top-left of camera translates to roughly 4,8
    function tickCursor() {
        cursorX += (mouseX - cursorX) * 0.15;
        cursorY += (mouseY - cursorY) * 0.15;
        // Use transform for GPU compositing
        cursor.style.transform = `translate(${cursorX - 4}px, ${cursorY - 8}px)`;
        requestAnimationFrame(tickCursor);
    }
    // Remove the margin offset from CSS since we handle it here
    cursor.style.marginLeft = '0';
    cursor.style.marginTop  = '0';
    tickCursor();

    // Cursor hover states
    document.addEventListener('mouseover', (e) => {
        const t = e.target.closest('a, button, .service-card, .blog-card, .tip-card, .review-card, .magnetic-btn, [onclick]');
        if (t) cursor.classList.add('hovered');
    });

    document.addEventListener('mouseout', (e) => {
        const t = e.target.closest('a, button, .service-card, .blog-card, .tip-card, .review-card, .magnetic-btn, [onclick]');
        if (t) cursor.classList.remove('hovered');
    });

    document.addEventListener('mousedown', () => cursor.classList.add('clicked'));
    document.addEventListener('mouseup', () => cursor.classList.remove('clicked'));
}

// ─────────────────────────────────────────────
// 3. NAVIGATION OVERLAY
// ─────────────────────────────────────────────
const menuBtn = document.getElementById('menuBtn');
const navOverlay = document.getElementById('navOverlay');
const navClose = document.getElementById('navClose');

function openNav() {
    navOverlay.classList.add('open');
    lenis.stop();
}

window.closeNav = function() {
    navOverlay.classList.remove('open');
    lenis.start();
};

if (menuBtn) menuBtn.addEventListener('click', openNav);
if (navClose) navClose.addEventListener('click', window.closeNav);

// Close on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') window.closeNav();
});

// ─────────────────────────────────────────────
// 4. LOADER + INTRO ANIMATION
// ─────────────────────────────────────────────
const loader = document.querySelector('.loader');
const counter = document.querySelector('.counter');
const loaderLogo = document.querySelector('.loader-logo');

if (loader && counter) {
    let progress = 0;

    function updateLoader() {
        progress += Math.random() * 3 + 0.5;
        if (progress > 100) progress = 100;
        counter.textContent = Math.floor(progress);
        if (progress < 100) {
            requestAnimationFrame(updateLoader);
        } else {
            startIntro();
        }
    }

    setTimeout(updateLoader, 300);
}

function startIntro() {
    const tl = gsap.timeline();

    tl.to(loaderLogo, { y: -30, opacity: 0, duration: 0.6, ease: 'power4.out' })
      .to(loader, { yPercent: -100, duration: 1, ease: 'power4.inOut' }, '-=0.2')
      .from('.global-glass-bg', { scale: 1.08, opacity: 0, duration: 2, ease: 'power3.out' }, '-=0.4')
      .from('.hero-text-bg', { scale: 0.85, opacity: 0, duration: 2, ease: 'power3.out' }, '-=1.8')
      .from('.header', { y: -30, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=1.5')
      .from('.social-sidebar', { x: 30, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=1')
      .from('.hero-tiny-top', { y: 20, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=1.2')
      .to('.hero-title .word', { y: 0, opacity: 1, stagger: 0.2, duration: 1.2, ease: 'power4.out' }, '-=0.6')
      .from('.hero-divider', { scaleY: 0, opacity: 0, duration: 0.8, ease: 'power4.inOut' }, '-=0.8')
      .from('.hero-subtitle', { y: 20, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.6')
      .from('.hero-cta-group', { y: 20, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.6')
      .from('.mouse-scroll-indicator', { opacity: 0, duration: 0.5 }, '-=0.3');
}

// ─────────────────────────────────────────────
// 5. MAGNETIC BUTTON EFFECT (desktop only)
// ─────────────────────────────────────────────
if (!isMobile()) {
    document.querySelectorAll('.magnetic-btn').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            gsap.to(btn, { x: x * 0.35, y: y * 0.35, duration: 0.5, ease: 'power2.out' });
        });
        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)' });
        });
    });
}

// ─────────────────────────────────────────────
// 6. SWIPER 3D CAROUSEL
// ─────────────────────────────────────────────
const swiper = new Swiper('.gallery-swiper', {
    effect: 'coverflow',
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: 'auto',
    loop: true,
    coverflowEffect: {
        rotate: 15,
        stretch: 0,
        depth: 300,
        modifier: 1,
        slideShadows: true,
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    autoplay: {
        delay: 3000,
        disableOnInteraction: false,
    }
});

// ─────────────────────────────────────────────
// 7. SCROLL TRIGGERED FADE-INS
// ─────────────────────────────────────────────
// Statement
gsap.from('.statement-text', {
    y: 60,
    opacity: 0,
    duration: 1.2,
    ease: 'power4.out',
    scrollTrigger: {
        trigger: '.statement-section',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
    }
});

// Section headings
gsap.utils.toArray('.section-heading, .section-label').forEach(el => {
    gsap.from(el, {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none reverse'
        }
    });
});

// Cards stagger
gsap.utils.toArray('.service-card, .tip-card, .review-card, .blog-card').forEach((card, i) => {
    gsap.from(card, {
        y: 50,
        opacity: 0,
        duration: 0.8,
        delay: i % 4 * 0.1,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: card,
            start: 'top 90%',
            toggleActions: 'play none none none'
        }
    });
});

// Info boxes
gsap.from('.info-box', {
    y: 60,
    opacity: 0,
    duration: 1,
    stagger: 0.2,
    ease: 'power3.out',
    scrollTrigger: {
        trigger: '.team-pricing-section',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
    }
});

// Hero bg parallax
gsap.to('.hero-bg', {
    yPercent: 25,
    ease: 'none',
    scrollTrigger: {
        trigger: '.hero-section',
        start: 'top top',
        end: 'bottom top',
        scrub: true
    }
});

// ─────────────────────────────────────────────
// 8. MODAL LOGIC
// ─────────────────────────────────────────────
window.toggleModal = function(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.toggle('active');
    // Pause/resume scroll
    if (modal.classList.contains('active')) {
        lenis.stop();
    } else {
        lenis.start();
    }
};

// Close modal on Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.custom-modal.active').forEach(m => {
            m.classList.remove('active');
        });
        lenis.start();
    }
});

// ─────────────────────────────────────────────
// 9. HEADER SHRINK ON SCROLL
// ─────────────────────────────────────────────
const header = document.getElementById('header');
ScrollTrigger.create({
    start: 'top -80px',
    onUpdate: (self) => {
        header.style.background = self.progress > 0
            ? 'rgba(7,7,7,0.95)'
            : 'transparent';
        header.style.backdropFilter = self.progress > 0 ? 'blur(10px)' : 'none';
        header.style.padding = self.progress > 0 ? '15px 40px' : '25px 40px';
        header.style.transition = 'all 0.4s ease';
    }
});
