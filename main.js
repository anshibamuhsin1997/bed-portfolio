// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {

    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if(mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });

        // Close mobile menu when a link is clicked
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        });
    }

    // Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 10) {
            navbar.classList.add('shadow-md', 'py-0');
            navbar.classList.remove('py-2');
        } else {
            navbar.classList.remove('shadow-md', 'py-0');
            navbar.classList.add('py-2');
        }
    });

    // Initialize GSAP and ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // Initial Hero Animations (will be called after Three.js is ready, or immediately)
    initHeroAnimations();
});

function initHeroAnimations() {
    // Parallax effect for hero elements
    gsap.to('.parallax-bg', {
        yPercent: 30,
        ease: 'none',
        scrollTrigger: {
            trigger: '#hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true
        }
    });

    // Fade in text elements
    const tl = gsap.timeline();
    tl.from('.hero-content > *', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out',
        delay: 0.5 // Wait for Three.js background to appear a bit
    });

    // Floating animation for specific elements
    gsap.to('.floating-element', {
        y: '-20px',
        duration: 2,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut'
    });

    // About Section Scroll Reveal
    gsap.from('.about-reveal', {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        scrollTrigger: {
            trigger: '#about',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        }
    });

    // Education Timeline Reveal
    gsap.from('.edu-reveal', {
        y: 50,
        opacity: 0,
        duration: 0.8,
        scrollTrigger: {
            trigger: '#education',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        }
    });

    gsap.from('.edu-card', {
        x: (index) => index % 2 === 0 ? -50 : 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.3,
        scrollTrigger: {
            trigger: '.timeline-line',
            start: 'top 70%',
            toggleActions: 'play none none reverse'
        }
    });

    gsap.fromTo('.timeline-line', 
        { height: 0 },
        {
            height: '100%',
            ease: 'none',
            scrollTrigger: {
                trigger: '#education',
                start: 'top 50%',
                end: 'bottom 80%',
                scrub: 1
            }
        }
    );

    // Skills Section
    gsap.from('.skill-reveal', {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        scrollTrigger: {
            trigger: '#skills',
            start: 'top 80%',
            onEnter: animateProgressCircles
        }
    });

    // Portfolio Section
    gsap.from('.portfolio-reveal', {
        y: 50,
        opacity: 0,
        duration: 0.8,
        scrollTrigger: {
            trigger: '#portfolio',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        }
    });
    
    gsap.from('.portfolio-card', {
        y: 50,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15,
        scrollTrigger: {
            trigger: '#portfolio',
            start: 'top 60%',
            toggleActions: 'play none none reverse'
        }
    });

    // Gallery Section
    gsap.from('.gallery-reveal', {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        scrollTrigger: {
            trigger: '#gallery',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        }
    });

    // Contact Section
    gsap.from('.contact-reveal', {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        scrollTrigger: {
            trigger: '#contact',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        }
    });
}

function animateProgressCircles() {
    const circles = document.querySelectorAll('.progress-ring__circle');
    // We embedded the target percentage in the visual text, or we can just animate the stroke offset to 0 as a simple effect,
    // Since stroke-dashoffset initially set in CSS matches the percentage, we can just trigger it via JS if needed,
    // but the CSS transition might handle it. For GSAP:
    
    circles.forEach(circle => {
        // Just reading the initial dashoffset set in HTML
        const targetOffset = circle.getAttribute('stroke-dashoffset');
        // Start at 283 (circumference)
        gsap.fromTo(circle, 
            { strokeDashoffset: 283 }, 
            { 
                strokeDashoffset: targetOffset, 
                duration: 1.5, 
                ease: "power2.out" 
            }
        );
    });
}
