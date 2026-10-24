import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

import bridalPresetImg from './Data/retouch_bridal.jpg';
import sindoorPresetImg from './Data/retouch_sindoor.jpg';
import haldiPresetImg from './Data/retouch_haldi.jpg';

gsap.registerPlugin(ScrollTrigger);

// ─────────────────────────────────────────────
// 1. SMOOTH SCROLL (Lenis — Optimized 60-120fps)
// ─────────────────────────────────────────────
const lenis = new Lenis({
    duration: 0.85, // Snappy & silky-smooth response, eliminates the sluggish floaty delay
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 1.0,
    touchMultiplier: 1.2,
    infinite: false,
});

lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(500, 33);

// ─────────────────────────────────────────────
// 2. NAVIGATION OVERLAY
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
const loaderBar = document.getElementById('loaderBar');
const heroVideo = document.getElementById('heroVideo');

if (loader && counter) {
    let progress = 0;

    function updateLoader() {
        progress += Math.random() * 3 + 0.8;
        if (progress > 100) progress = 100;
        const pct = Math.floor(progress);
        counter.textContent = pct;
        // Drive the progress bar fill
        if (loaderBar) loaderBar.style.width = pct + '%';
        if (progress < 100) {
            requestAnimationFrame(updateLoader);
        } else {
            startIntro();
        }
    }

    setTimeout(updateLoader, 200);
}

function startIntro() {
    const tl = gsap.timeline({
        onComplete: () => {
            // Reveal cursor only after intro is completely done
            document.body.classList.add('ready');
        }
    });

    tl.to(loaderLogo, { y: -40, opacity: 0, duration: 0.5, ease: 'power4.out' })
      .to(loader, { yPercent: -100, duration: 1.1, ease: 'power4.inOut' }, '-=0.15')
      .from('.global-glass-bg', { scale: 1.06, opacity: 0, duration: 2.2, ease: 'power3.out' }, '-=0.5')
      .from('.hero-text-bg', { scale: 0.88, opacity: 0, duration: 2, ease: 'power3.out' }, '-=2')
      .from('.header', { y: -30, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=1.6')
      .from('.social-sidebar', { x: 30, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=1')
      .from('.hero-tiny-top', { y: 20, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=1')
      .to('.hero-title .word', { y: 0, opacity: 1, stagger: 0.2, duration: 1.2, ease: 'power4.out' }, '-=0.7')
      .from('.hero-divider', { scaleY: 0, opacity: 0, duration: 0.8, ease: 'power4.inOut' }, '-=0.6')
      .from('.hero-subtitle', { y: 20, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.5')
      .from('.hero-cta-group', { y: 20, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.5')
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
// 6. SWIPER — Coverflow Gallery
// ─────────────────────────────────────────────
if (typeof Swiper !== 'undefined') {
    new Swiper('.gallery-swiper', {
        effect: 'coverflow',
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: 'auto',
        loop: true,
        coverflowEffect: {
            rotate: 20,
            stretch: 30,
            depth: 250,
            modifier: 1,
            slideShadows: true,
        },
        autoplay: {
            delay: 3500,
            disableOnInteraction: false,
        },
        navigation: {
            nextEl: '.gallery-swiper .swiper-button-next',
            prevEl: '.gallery-swiper .swiper-button-prev',
        },
        pagination: {
            el: '.gallery-swiper .swiper-pagination',
            clickable: true,
        },
    });

    // ─────────────────────────────────────────────
    // 6b. SWIPER — Coverflow Reels
    // ─────────────────────────────────────────────
    const reelsSwiper = new Swiper('.reels-swiper', {
        effect: 'coverflow',
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: 'auto',
        loop: true,
        coverflowEffect: {
            rotate: 20,
            stretch: 30,
            depth: 250,
            modifier: 1,
            slideShadows: true,
        },
        navigation: {
            nextEl: '.reels-swiper .swiper-button-next',
            prevEl: '.reels-swiper .swiper-button-prev',
        },
        pagination: {
            el: '.reels-swiper .swiper-pagination',
            clickable: true,
        },
        on: {
            init: function() {
                // Play video in the first active slide
                const activeVideo = this.slides[this.activeIndex].querySelector('video');
                if (activeVideo) activeVideo.play().catch(() => {});
            },
            slideChange: function() {
                // Pause all videos
                this.slides.forEach(slide => {
                    const video = slide.querySelector('video');
                    if (video) {
                        video.pause();
                        video.currentTime = 0; // Reset to start
                    }
                });
                // Play active one
                const activeVideo = this.slides[this.activeIndex].querySelector('video');
                if (activeVideo) activeVideo.play().catch(() => {});
            }
        }
    });
}

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

// Editorial Offer Card Reveal
gsap.from('.editorial-offer-card', {
    y: 50,
    opacity: 0,
    duration: 1,
    ease: 'power3.out',
    scrollTrigger: {
        trigger: '.editorial-offer-section',
        start: 'top 85%',
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
// 9. HEADER SHRINK ON SCROLL (Zero reflow / GPU-accelerated)
// ─────────────────────────────────────────────
const header = document.getElementById('header');
ScrollTrigger.create({
    start: 'top -80px',
    onUpdate: (self) => {
        if (header) {
            header.classList.toggle('scrolled', self.progress > 0);
        }
    }
});

// ─────────────────────────────────────────────
// 10. VIDEO REEL INTERACTION LOGIC
// ─────────────────────────────────────────────
// The swiper on:slideChange handles basic play/pause.
// This adds click-to-unmute and ensures smooth interaction.
document.querySelectorAll('.hover-reel').forEach(video => {
    const parentSlide = video.closest('.swiper-slide');
    
    // Toggle mute on click if it's the active slide
    if (parentSlide) {
        parentSlide.addEventListener('click', () => {
            if (parentSlide.classList.contains('swiper-slide-active')) {
                video.muted = !video.muted;
            }
        });
    }
});

// ─────────────────────────────────────────────
// 11. THE ART OF RETOUCHING: BEFORE & AFTER SLIDER
// ─────────────────────────────────────────────
const comparisonRange = document.getElementById('comparisonRange');
const beforeLayer = document.getElementById('beforeLayer');
const dividerHandle = document.getElementById('dividerHandle');
const comparisonStage = document.getElementById('comparisonStage');

function setSliderPosition(val) {
    const clamped = Math.max(0, Math.min(100, val));
    if (beforeLayer) {
        beforeLayer.style.clipPath = `inset(0 ${100 - clamped}% 0 0)`;
        beforeLayer.style.webkitClipPath = `inset(0 ${100 - clamped}% 0 0)`;
    }
    if (dividerHandle) dividerHandle.style.left = clamped + '%';
    if (comparisonRange) comparisonRange.value = clamped;
}

if (comparisonRange) {
    comparisonRange.addEventListener('input', (e) => {
        setSliderPosition(e.target.value);
    });
}

// Retouch Presets
const retouchPresets = {
    bridal: {
        img: bridalPresetImg,
        camTitle: 'Nikon Z6 II · 85mm Prime',
        camDesc: 'Full-Frame Sensor RAW • Uncompressed 14-Bit Color Profile',
        gradeTitle: 'Papai Signature 3D LUT',
        gradeDesc: 'Warm Bengali Wedding Skin Tones & Deep Crimson Depth',
        retouchTitle: 'Editorial Retouching',
        retouchDesc: 'Frequency Separation + Natural Skin Texture Preservation'
    },
    sindoor: {
        img: sindoorPresetImg,
        camTitle: 'Nikon Z8 · 35mm f/1.4 S',
        camDesc: 'High Dynamic Range Mandap Sensor RAW Capture',
        gradeTitle: 'Royal Alta & Gold LUT',
        gradeDesc: 'Preservation of Alta Reds & Golden Mukut Highlights',
        retouchTitle: 'Highlight Recovery',
        retouchDesc: 'Specular Glare Reduction & Cinematic Film Halation'
    },
    haldi: {
        img: haldiPresetImg,
        camTitle: 'Nikon Z6 II · 24-70mm f/2.8 S',
        camDesc: 'High-Speed 1/1000s RAW Splash Capture',
        gradeTitle: 'Solar Turmeric Glow',
        gradeDesc: 'Vibrant Yellow Separation & Warm Ambient Sunlight',
        retouchTitle: 'Clarity & Droplet Pop',
        retouchDesc: 'Micro-Contrast Enhancement on Turmeric & Petals'
    }
};

window.switchRetouchPreset = function(presetKey) {
    const preset = retouchPresets[presetKey];
    if (!preset) return;

    // Update active tab styling
    document.querySelectorAll('.retouch-tab').forEach(tab => {
        tab.classList.toggle('active', tab.getAttribute('data-preset') === presetKey);
    });

    const beforeImg = document.getElementById('beforeImg');
    const afterImg = document.getElementById('afterImg');

    if (beforeImg && afterImg) {
        // Direct assignment with fast crossfade
        beforeImg.src = preset.img;
        afterImg.src = preset.img;
    }

    const camTitle = document.getElementById('captionCamTitle');
    const camDesc = document.getElementById('captionCamDesc');
    const gradeTitle = document.getElementById('captionGradeTitle');
    const gradeDesc = document.getElementById('captionGradeDesc');
    const retouchTitle = document.getElementById('captionRetouchTitle');
    const retouchDesc = document.getElementById('captionRetouchDesc');

    if (camTitle) camTitle.textContent = preset.camTitle;
    if (camDesc) camDesc.textContent = preset.camDesc;
    if (gradeTitle) gradeTitle.textContent = preset.gradeTitle;
    if (gradeDesc) gradeDesc.textContent = preset.gradeDesc;
    if (retouchTitle) retouchTitle.textContent = preset.retouchTitle;
    if (retouchDesc) retouchDesc.textContent = preset.retouchDesc;

    setSliderPosition(50);
};

// Initialize slider position
setSliderPosition(50);

// ─────────────────────────────────────────────
// 12. INTERACTIVE WEDDING PACKAGE & QUOTE ESTIMATOR
// ─────────────────────────────────────────────
let estimatorState = {
    celebration: { type: 'wedding', title: 'Full Bengali Wedding', base: 55000 },
    duration: { days: '1', title: '1 Day Grand Coverage', mult: 1.0 },
    addons: {
        drone: { name: '4K Aerial Drone Coverage', price: 8000, active: true },
        reels: { name: '3× Instagram Cinematic Reels', price: 6000, active: true },
        album: { name: '40-Page Velvet Photobook', price: 10000, active: false },
        ssd: { name: 'Raw Footage & Flash Drive', price: 3500, active: false }
    },
    eventDate: ''
};

window.selectCelebration = function(btn) {
    const parent = btn.parentElement;
    parent.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');

    estimatorState.celebration = {
        type: btn.getAttribute('data-type'),
        title: btn.getAttribute('data-title'),
        base: parseInt(btn.getAttribute('data-base'), 10)
    };
    window.updateEstimatedQuote();
};

window.selectDuration = function(btn) {
    const parent = btn.parentElement;
    parent.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');

    estimatorState.duration = {
        days: btn.getAttribute('data-days'),
        title: btn.getAttribute('data-title'),
        mult: parseFloat(btn.getAttribute('data-mult'))
    };
    window.updateEstimatedQuote();
};

window.toggleAddon = function(card) {
    const addonKey = card.getAttribute('data-addon');
    if (!estimatorState.addons[addonKey]) return;

    const isActive = !estimatorState.addons[addonKey].active;
    estimatorState.addons[addonKey].active = isActive;

    card.classList.toggle('active', isActive);
    const checkbox = card.querySelector('.custom-checkbox');
    if (checkbox) checkbox.textContent = isActive ? '✓' : '';

    window.updateEstimatedQuote();
};

window.updateEstimatedQuote = function() {
    const dateInput = document.getElementById('eventDateInput');
    if (dateInput) {
        estimatorState.eventDate = dateInput.value;
    }

    // Calculation: Base * Mult + Active Addons
    const baseTotal = estimatorState.celebration.base * estimatorState.duration.mult;
    let addonsTotal = 0;
    const activeAddonsList = [];

    Object.keys(estimatorState.addons).forEach(key => {
        const item = estimatorState.addons[key];
        if (item.active) {
            addonsTotal += item.price;
            activeAddonsList.push(item.name);
        }
    });

    const finalEstimate = Math.round((baseTotal + addonsTotal) / 1000) * 1000;
    const formattedPrice = '₹' + finalEstimate.toLocaleString('en-IN');

    const priceDisplay = document.getElementById('quotePriceText');
    if (priceDisplay) {
        priceDisplay.textContent = formattedPrice;
    }

    // Inclusions List update
    const inclusionsUl = document.getElementById('quoteInclusionsList');
    if (inclusionsUl) {
        let html = `
            <li><span>✓</span> <strong>${estimatorState.celebration.title}</strong> (${estimatorState.duration.title})</li>
            <li><span>✓</span> Dual Full-Frame Nikon Bodies (Z6 II &amp; Z8)</li>
            <li><span>✓</span> Master Colour Grading &amp; Skin Retouching</li>
        `;
        activeAddonsList.forEach(name => {
            html += `<li><span>✓</span> ${name}</li>`;
        });
        html += `<li><span>✓</span> Private Online Cloud Archive</li>`;
        inclusionsUl.innerHTML = html;
    }

    // WhatsApp dynamic booking link
    const whatsappBtn = document.getElementById('quoteWhatsappBtn');
    if (whatsappBtn) {
        let datePart = estimatorState.eventDate ? ` around ${estimatorState.eventDate}` : '';
        let addonsPart = activeAddonsList.length > 0 ? ` with ${activeAddonsList.join(', ')}` : '';
        const msg = encodeURIComponent(
            `Hi Papai Studio! I customized a package on your website for ${estimatorState.celebration.title} (${estimatorState.duration.title})${addonsPart}${datePart}. ` +
            `Estimated tariff shown is ${formattedPrice}. Could you please check date availability and share the detailed itinerary?`
        );
        whatsappBtn.href = `https://wa.me/917001192076?text=${msg}`;
    }
};

// Initialize Quote Calculation
setTimeout(() => {
    if (document.getElementById('quote-calculator')) {
        window.updateEstimatedQuote();
    }
}, 300);

// ─────────────────────────────────────────────
// 13. AMBIENT AUDIO CONTROLLER (Web Audio Synthesizer)
// ─────────────────────────────────────────────
const ambientAudioBtn = document.getElementById('ambientAudioBtn');
const audioStatusText = document.getElementById('audioStatusText');
let audioCtx = null;
let ambientOscillators = [];
let isAudioPlaying = false;

function toggleAmbientSoundscape() {
    if (!audioCtx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContextClass();
    }

    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }

    if (isAudioPlaying) {
        // Stop audio
        ambientOscillators.forEach(osc => {
            try {
                osc.gainNode.gain.linearRampToValueAtTime(0.0001, audioCtx.currentTime + 0.6);
                setTimeout(() => osc.stop(), 700);
            } catch (e) {}
        });
        ambientOscillators = [];
        isAudioPlaying = false;
        if (ambientAudioBtn) ambientAudioBtn.classList.remove('playing');
        if (audioStatusText) audioStatusText.textContent = 'Atmosphere';
    } else {
        // Start warm Bengali wedding ambient chord (D - F# - A - D warm harmonic acoustic pad)
        const freqs = [146.83, 220.00, 277.18, 369.99, 440.00]; // D3, A3, C#4, F#4, A4
        const masterGain = audioCtx.createGain();
        masterGain.gain.setValueAtTime(0.0001, audioCtx.currentTime);
        masterGain.gain.linearRampToValueAtTime(0.08, audioCtx.currentTime + 1.2);
        masterGain.connect(audioCtx.destination);

        ambientOscillators = freqs.map((freq, idx) => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
            osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

            // Subtle slow acoustic modulation
            const lfo = audioCtx.createOscillator();
            const lfoGain = audioCtx.createGain();
            lfo.frequency.setValueAtTime(0.2 + idx * 0.05, audioCtx.currentTime);
            lfoGain.gain.setValueAtTime(1.5, audioCtx.currentTime);
            lfo.connect(lfoGain);
            lfoGain.connect(osc.frequency);
            lfo.start();

            gain.gain.setValueAtTime(0.03, audioCtx.currentTime);
            osc.connect(gain);
            gain.connect(masterGain);
            osc.gainNode = masterGain;
            osc.start();
            return osc;
        });

        isAudioPlaying = true;
        if (ambientAudioBtn) ambientAudioBtn.classList.add('playing');
        if (audioStatusText) audioStatusText.textContent = 'Playing ♫';
    }
}

if (ambientAudioBtn) {
    ambientAudioBtn.addEventListener('click', toggleAmbientSoundscape);
}

// ─────────────────────────────────────────────
// 14. HERO VIDEO AUDIO CONTROLS (Low Volume setup)
// ─────────────────────────────────────────────
if (heroVideo) {
    heroVideo.volume = 0.15;
    const attemptPlayVideo = () => {
        heroVideo.muted = false;
        let playPromise = heroVideo.play();
        if (playPromise !== undefined) {
            playPromise.catch(() => {
                heroVideo.muted = true;
                heroVideo.play().catch(() => {});
                const unmuteOnInteract = () => {
                    heroVideo.muted = false;
                    heroVideo.volume = 0.15;
                    ['click', 'touchstart', 'scroll'].forEach(evt => {
                        document.removeEventListener(evt, unmuteOnInteract);
                    });
                };
                ['click', 'touchstart', 'scroll'].forEach(evt => {
                    document.addEventListener(evt, unmuteOnInteract, { once: true });
                });
            });
        }
    };
    setTimeout(attemptPlayVideo, 100);
}
