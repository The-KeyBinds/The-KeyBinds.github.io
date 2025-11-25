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


    // Hybrid Marquee & Scroll Interaction with Vimeo Integration
    const showcaseSection = document.querySelector('.showcase');
    const scrollTrack = document.querySelector('.scroll-track');
    const showcaseContainer = document.querySelector('.showcase-scroller');

    if (showcaseSection && scrollTrack && showcaseContainer) {
        let position = 0;
        const speed = 0.5; // Auto-scroll speed
        let isHovering = false;
        let isVideoPlaying = false; // Track if any video is playing
        let animationId;

        // Initialize Vimeo Players
        const vimeoIframes = document.querySelectorAll('.vimeo-wrapper iframe');
        const vimeoPlayers = [];

        vimeoIframes.forEach((iframe, index) => {
            // Add unique ID to each iframe for Vimeo API
            iframe.id = `vimeo-player-${index}`;
            const player = new Vimeo.Player(iframe);
            vimeoPlayers.push(player);

            // Listen for play event
            player.on('play', () => {
                isVideoPlaying = true;
            });

            // Listen for pause event
            player.on('pause', () => {
                // Check if any other video is still playing
                Promise.all(vimeoPlayers.map(p => p.getPaused()))
                    .then(pausedStates => {
                        // If all videos are paused, resume marquee
                        isVideoPlaying = pausedStates.every(paused => paused) ? false : true;
                    });
            });

            // Listen for ended event
            player.on('ended', () => {
                // Check if any other video is still playing
                Promise.all(vimeoPlayers.map(p => p.getPaused()))
                    .then(pausedStates => {
                        isVideoPlaying = pausedStates.every(paused => paused) ? false : true;
                    });
            });
        });

        // Add click handlers to wrappers to play/pause videos
        const vimeoWrappers = document.querySelectorAll('.vimeo-wrapper');
        vimeoWrappers.forEach((wrapper, index) => {
            let clickTimeout = null;
            let clickCount = 0;

            wrapper.addEventListener('click', (e) => {
                // Only handle clicks on the overlay area (not on the controls at bottom)
                const rect = wrapper.getBoundingClientRect();
                const clickY = e.clientY - rect.top;
                const controlsHeight = 50; // Height we reserved for controls

                if (clickY < rect.height - controlsHeight) {
                    clickCount++;

                    if (clickCount === 1) {
                        // Wait to see if it's a double click
                        clickTimeout = setTimeout(() => {
                            // Single click - play/pause
                            const player = vimeoPlayers[index];
                            player.getPaused().then(paused => {
                                if (paused) {
                                    player.play();
                                } else {
                                    player.pause();
                                }
                            });
                            clickCount = 0;
                        }, 300); // 300ms delay to detect double click
                    } else if (clickCount === 2) {
                        // Double click - fullscreen
                        clearTimeout(clickTimeout);
                        const player = vimeoPlayers[index];
                        player.requestFullscreen();
                        clickCount = 0;
                    }
                }
            });
        });

        // Calculate single set width (assuming 4 sets of items)
        const getResetWidth = () => {
            return scrollTrack.scrollWidth / 4;
        };

        const animate = () => {
            // Only move if not hovering AND no video is playing
            if (!isHovering && !isVideoPlaying) {
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

    // Calendly Close Animation
    const observerCallback = (mutationsList, observer) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    if (node.classList && node.classList.contains('calendly-overlay')) {
                        const overlay = node;
                        const closeBtn = overlay.querySelector('.calendly-popup-close');
                        const popupContent = overlay.querySelector('.calendly-popup-content');

                        if (closeBtn && popupContent) {
                            const closeHandler = (e) => {
                                e.preventDefault();
                                e.stopPropagation();

                                overlay.classList.add('is-closing');
                                popupContent.classList.add('is-closing');

                                setTimeout(() => {
                                    Calendly.closePopupWidget();
                                }, 400); // Match animation duration
                            };

                            closeBtn.addEventListener('click', closeHandler);
                            overlay.addEventListener('click', (e) => {
                                if (e.target === overlay) {
                                    closeHandler(e);
                                }
                            });
                        }
                    }
                });
            }
        }
    };

    const observerConfig = {
        childList: true,
        subtree: false
    };
    const bodyObserver = new MutationObserver(observerCallback);
    bodyObserver.observe(document.body, observerConfig);
});
