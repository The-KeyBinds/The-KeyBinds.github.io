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
});
