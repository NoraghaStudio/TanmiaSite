// Main JavaScript

document.addEventListener('DOMContentLoaded', () => {

    // Header Scroll Effect
    const header = document.querySelector('header');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.padding = '0';
            header.style.background = 'rgba(255, 255, 255, 0.98)';
        } else {
            header.style.padding = '10px 0';
            header.style.background = 'rgba(255, 255, 255, 0.95)';
        }
    });

    // Smooth Scroll for Navigation Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return; // Do nothing for empty hashes

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Scroll Reveal Animation
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const elementsToAnimate = document.querySelectorAll('.feature-card, .about-text, .about-image, .app-item, .gallery-item, .project-item, .section-header, .gaina-specs-banner, .eco-benefit, .exclusive-agent-card, .grand-prize-card, .roi-banner');

    elementsToAnimate.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
        observer.observe(el);
    });

    // Add visible class styling dynamically
    const style = document.createElement('style');
    style.innerHTML = `
        .visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);

    // Mobile Menu Toggle (Simple)
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('nav');

    menuBtn.addEventListener('click', () => {
        nav.classList.toggle('active');
    });

    // Close menu when clicking a link
    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
        });
    });

    // Unified Gallery Controller with Swipe Support
    function setupGallery(containerId, mainImgId, mainViewId, prevBtnId, nextBtnId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const mainImg = document.getElementById(mainImgId);
        const mainView = document.getElementById(mainViewId);
        const prevBtn = document.getElementById(prevBtnId) || container.querySelector('.gallery-control.prev');
        const nextBtn = document.getElementById(nextBtnId) || container.querySelector('.gallery-control.next');

        let currentIndex = 0;
        const images = JSON.parse(container.getAttribute('data-images') || "[]");

        if (images.length === 0) return;

        function update(index) {
            currentIndex = index;
            const newSrc = images[currentIndex];

            mainImg.style.opacity = '0';
            setTimeout(() => {
                mainImg.src = newSrc;
                mainView.setAttribute('data-src', newSrc);
                mainImg.style.opacity = '1';
            }, 200);
        }

        const goNext = () => update((currentIndex + 1) % images.length);
        const goPrev = () => update((currentIndex - 1 + images.length) % images.length);

        if (prevBtn) prevBtn.addEventListener('click', goPrev);
        if (nextBtn) nextBtn.addEventListener('click', goNext);

        // Touch/Swipe Support
        let touchStartX = 0;
        let touchEndX = 0;

        mainView.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        mainView.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });

        function handleSwipe() {
            const threshold = 50;
            if (touchEndX < touchStartX - threshold) goNext(); // Swipe Left -> Next
            if (touchEndX > touchStartX + threshold) goPrev(); // Swipe Right -> Prev
        }
    }

    // Lightbox Logic
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeLightbox = document.querySelector('.close-lightbox');
    const nextBtnLB = document.querySelector('.next-lightbox');
    const prevBtnLB = document.querySelector('.prev-lightbox');

    let currentImages = [];
    let currentIndexLB = 0;

    function openLightbox(src, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        currentImages = JSON.parse(container.getAttribute('data-images') || "[]");
        currentIndexLB = currentImages.indexOf(src);
        if (currentIndexLB === -1) currentIndexLB = 0;

        lightboxModal.style.display = 'block';
        lightboxImg.src = currentImages[currentIndexLB];
        document.body.style.overflow = 'hidden';
    }

    function closeLightboxFunc() {
        lightboxModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    function showNext() {
        if (currentImages.length === 0) return;
        currentIndexLB = (currentIndexLB + 1) % currentImages.length;
        lightboxImg.src = currentImages[currentIndexLB];
    }

    function showPrev() {
        if (currentImages.length === 0) return;
        currentIndexLB = (currentIndexLB - 1 + currentImages.length) % currentImages.length;
        lightboxImg.src = currentImages[currentIndexLB];
    }

    // Attach click events to main display wrappers
    const recordsView = document.getElementById('records-main-view');
    const projectsView = document.getElementById('projects-main-view');
    const casesView = document.getElementById('cases-main-view');

    if (recordsView) {
        recordsView.addEventListener('click', function () {
            openLightbox(this.getAttribute('data-src'), 'records-product-container');
        });
    }

    if (projectsView) {
        projectsView.addEventListener('click', function () {
            openLightbox(this.getAttribute('data-src'), 'projects-product-container');
        });
    }

    if (casesView) {
        casesView.addEventListener('click', function () {
            openLightbox(this.getAttribute('data-src'), 'cases-product-container');
        });
    }

    closeLightbox.addEventListener('click', closeLightboxFunc);
    lightboxModal.addEventListener('click', (e) => { if (e.target === lightboxModal) closeLightboxFunc(); });
    nextBtnLB.addEventListener('click', showNext);
    prevBtnLB.addEventListener('click', showPrev);

    document.addEventListener('keydown', (e) => {
        if (lightboxModal.style.display === 'block') {
            if (e.key === 'ArrowRight') showNext();
            if (e.key === 'ArrowLeft') showPrev();
            if (e.key === 'Escape') closeLightboxFunc();
        }
    });

    // Initialize both galleries
    setupGallery('records-product-container', 'main-gallery-img', 'records-main-view');
    setupGallery('projects-product-container', 'main-projects-img', 'projects-main-view');
    setupGallery('cases-product-container', 'main-cases-img', 'cases-main-view');

    // Standalone Lightbox Support
    const standaloneTriggers = document.querySelectorAll('.standalone-lightbox');
    standaloneTriggers.forEach(trigger => {
        trigger.addEventListener('click', function () {
            const img = this.querySelector('img');
            if (img) {
                // Initialize as a single-image gallery
                currentImages = [img.src || img.getAttribute('src')]; 
                currentIndexLB = 0;
                
                lightboxModal.style.display = 'block';
                lightboxImg.src = currentImages[0];
                document.body.style.overflow = 'hidden';
            }
        });
    });
});
