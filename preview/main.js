document.addEventListener('DOMContentLoaded', () => {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-in-section');
    fadeElements.forEach(el => observer.observe(el));

    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            // Close other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });

            // Toggle current item
            item.classList.toggle('active');
        });
    });

    // Custom Video Player
    const videoWrappers = document.querySelectorAll('.video-wrapper');

    videoWrappers.forEach(wrapper => {
        const video = wrapper.querySelector('video');
        const playBtn = wrapper.querySelector('.play-btn');
        const progressBar = wrapper.querySelector('.progress-bar');
        const progressContainer = wrapper.querySelector('.progress-container');
        const playIconPath = playBtn.querySelector('path');

        const togglePlay = () => {
            if (video.paused) {
                video.play();
                wrapper.classList.add('playing');
                playIconPath.setAttribute('d', 'M6 19h4V5H6v14zm8-14v14h4V5h-4z'); // Pause icon
            } else {
                video.pause();
                wrapper.classList.remove('playing');
                playIconPath.setAttribute('d', 'M8 5v14l11-7z'); // Play icon
            }
        };

        playBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            togglePlay();
        });

        video.addEventListener('click', togglePlay);

        video.addEventListener('timeupdate', () => {
            if (video.duration) {
                const progress = (video.currentTime / video.duration) * 100;
                progressBar.style.width = `${progress}%`;
            }
        });

        progressContainer.addEventListener('click', (e) => {
            e.stopPropagation();
            const rect = progressContainer.getBoundingClientRect();
            const pos = (e.clientX - rect.left) / rect.width;
            if (video.duration) {
                video.currentTime = pos * video.duration;
            }
        });

        video.addEventListener('ended', () => {
            wrapper.classList.remove('playing');
            playIconPath.setAttribute('d', 'M8 5v14l11-7z');
            progressBar.style.width = '0%';
        });
    });
    // Hybrid Marquee & Scroll Interaction
    const showcaseSection = document.querySelector('.showcase');
    const scrollTrack = document.querySelector('.scroll-track');
    const showcaseContainer = document.querySelector('.showcase-scroller');

    if (showcaseSection && scrollTrack && showcaseContainer) {
        let position = 0;
        const speed = 0.5; // Auto-scroll speed
        let isHovering = false;
        let animationId;

        // Calculate single set width (assuming 4 sets of items)
        // We need to wait for images/videos to load or just measure the first half
        // A safer way is to measure the total width and divide by 4

        const getResetWidth = () => {
            return scrollTrack.scrollWidth / 4;
        };

        const animate = () => {
            if (!isHovering) {
                position -= speed;
            }

            const resetWidth = getResetWidth();

            // Handle infinite loop wrapping
            if (position <= -resetWidth) {
                position += resetWidth;
            } else if (position > 0) {
                position -= resetWidth;
            }

            scrollTrack.style.transform = `translateX(${position}px)`;
            animationId = requestAnimationFrame(animate);
        };

        // Start animation
        animate();

        // Hover handlers
        showcaseContainer.addEventListener('mouseenter', () => {
            isHovering = true;
        });

        showcaseContainer.addEventListener('mouseleave', () => {
            isHovering = false;
        });

        // Wheel handler
        showcaseContainer.addEventListener('wheel', (e) => {
            e.preventDefault(); // Prevent page scroll while interacting

            // Scroll sensitivity
            const delta = e.deltaY;
            position -= delta;

            // Immediate boundary check for smooth feel
            const resetWidth = getResetWidth();
            if (position <= -resetWidth) {
                position += resetWidth;
            } else if (position > 0) {
                position -= resetWidth;
            }

            scrollTrack.style.transform = `translateX(${position}px)`;
        }, { passive: false });
    }
});
