document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const cursor = document.getElementById('custom-cursor');
    const rattleSound = document.getElementById('rattle-sound');

    // --- Custom Cursor Movement & Sound ---
    let mouseStillMovingTimeout;
    let hasPlayedForThisMovement = false;

    if (cursor && rattleSound) {
        document.addEventListener('mousemove', (e) => {
            if (cursor) {
                cursor.style.left = e.clientX + 'px';
                cursor.style.top = e.clientY + 'px';
            }
            if (!hasPlayedForThisMovement) {
                if (rattleSound && typeof rattleSound.play === 'function') {
                    rattleSound.currentTime = 0;
                    rattleSound.play().catch(error => console.warn("Rattle sound play error:", error));
                }
                hasPlayedForThisMovement = true;
            }
            clearTimeout(mouseStillMovingTimeout);
            mouseStillMovingTimeout = setTimeout(() => {
                hasPlayedForThisMovement = false;
            }, 150);
        });
        document.addEventListener('mouseleave', () => {
            if (cursor) cursor.style.display = 'none';
        });
        document.addEventListener('mouseenter', () => {
            if (cursor) cursor.style.display = 'block';
        });
    }

    // --- Initialize Particles.js (Now on all pages that have the #particles-js div) ---
    if (document.getElementById('particles-js') && typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            "particles": {
                "number": {
                    "value": 100, // Increased particle count
                    "density": {
                        "enable": true,
                        "value_area": 800
                    }
                },
                "color": {
                    "value": "#E8D8A1"
                },
                "shape": {
                    "type": "circle",
                    "stroke": {
                        "width": 0,
                        "color": "#000000"
                    },
                    "polygon": {
                        "nb_sides": 5
                    }
                },
                "opacity": {
                    "value": 0.5, // Slightly increased opacity for better visibility with interaction
                    "random": true,
                    "anim": {
                        "enable": true,
                        "speed": 0.8,
                        "opacity_min": 0.1,
                        "sync": false
                    }
                },
                "size": {
                    "value": 3.5, // Slightly increased size
                    "random": true,
                    "anim": {
                        "enable": false,
                        "speed": 40,
                        "size_min": 0.1,
                        "sync": false
                    }
                },
                "line_linked": {
                    "enable": false,
                },
                "move": {
                    "enable": true,
                    "speed": 0.9, // Slightly increased speed
                    "direction": "none", // Changed to "none" for more random drift with interactivity
                    "random": true,
                    "straight": false,
                    "out_mode": "out",
                    "bounce": false,
                    "attract": {
                        "enable": false,
                        "rotateX": 600,
                        "rotateY": 1200
                    }
                }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": {
                    "onhover": {
                        "enable": true, // Enable hover interactivity
                        "mode": "repel" // Particles will repel from cursor
                    },
                    "onclick": {
                        "enable": true, // Enable click interactivity
                        "mode": "push" // Push particles on click
                    },
                    "resize": true
                },
                "modes": {
                    "grab": { // Example: if you wanted to use "grab" mode
                        "distance": 140,
                        "line_linked": {
                            "opacity": 1
                        }
                    },
                    "bubble": { // Example: if you wanted to use "bubble" mode
                        "distance": 400,
                        "size": 40,
                        "duration": 2,
                        "opacity": 8,
                        "speed": 3
                    },
                    "repel": { // Configuration for "repel" mode
                        "distance": 100, // How far particles repel
                        "duration": 0.4
                    },
                    "push": { // Configuration for "push" mode
                        "particles_nb": 4 // Number of particles to push on click
                    },
                    "remove": { // Example: if you wanted to use "remove" mode
                        "particles_nb": 2
                    }
                }
            },
            "retina_detect": true
        });
    } else if (!document.getElementById('particles-js')) {
        // This warning is helpful if the div is missing on some pages
        // console.warn("Particles.js container (#particles-js) not found on this page.");
    } else if (typeof particlesJS === 'undefined') {
        console.warn("particles.js library not loaded or 'particlesJS' function not found.");
    }


    // --- Homepage Specific Logic ---
    if (body.classList.contains('home-page')) {
        const homeContent = document.getElementById('home-content');
        const bgMusic = document.getElementById('bg-music');

        if (bgMusic && typeof bgMusic.play === 'function') {
            const playMusic = () => {
                bgMusic.play().then(() => {
                    document.removeEventListener('click', playMusicInteraction);
                    document.removeEventListener('touchstart', playMusicInteraction);
                }).catch(error => {
                    console.warn("Background music autoplay prevented. Needs user interaction.", error);
                    document.removeEventListener('click', playMusicInteraction);
                    document.removeEventListener('touchstart', playMusicInteraction);
                    document.addEventListener('click', playMusicInteraction, { once: true });
                    document.addEventListener('touchstart', playMusicInteraction, { once: true });
                 });
            };
            const playMusicInteraction = () => playMusic();
            playMusic();
        }

        if (homeContent) {
            homeContent.addEventListener('click', () => {
                window.location.href = 'movies.html';
            });
        }
    }

    // --- Movies Library Page Specific Logic ---
    if (body.classList.contains('movies-page')) {
        const movieItems = document.querySelectorAll('.movie-item');
        const infoPanel = document.getElementById('info-panel');
        const infoPlaceholder = infoPanel ? infoPanel.querySelector('.info-placeholder') : null;
        const infoImage = document.getElementById('info-image');
        const infoTitle = document.getElementById('info-title');
        const infoSynopsis = document.getElementById('info-synopsis');
        const infoCast = document.getElementById('info-cast');
        const infoBuyLink = document.getElementById('info-buy-link');

        const themeAudios = {
            fistful: document.getElementById('fistful-theme'),
            fewmore: document.getElementById('fewmore-theme'),
            goodbadugly: document.getElementById('goodbadugly-theme')
        };
        let currentAudio = null;

        const movieData = {
            fistful: {
                title: 'A Fistful of Dollars',
                image: 'assets/images/fistful_poster.jpg',
                synopsis: 'A wandering gunfighter (Clint Eastwood) arrives in a Mexican border town plagued by a feud between two families, the Baxters and the Rojos. He decides to play them against each other for his own profit.',
                cast: 'Director: Sergio Leone | Cast: Clint Eastwood, Marianne Koch, Gian Maria Volontè',
                buyLink: 'YOUR_BLURAY_BUY_LINK_HERE_FISTFUL',
                page: 'fistful.html'
            },
            fewmore: {
                title: 'For a Few Dollars More',
                image: 'assets/images/fewmore_poster.jpg',
                synopsis: 'Two bounty hunters (Clint Eastwood and Lee Van Cleef) with differing methods form an uneasy alliance to track down the psychopathic outlaw El Indio (Gian Maria Volontè) and his gang.',
                cast: 'Director: Sergio Leone | Cast: Clint Eastwood, Lee Van Cleef, Gian Maria Volontè',
                buyLink: 'YOUR_BLURAY_BUY_LINK_HERE_FEWMORE',
                page: 'fewmore.html'
            },
            goodbadugly: {
                title: 'The Good, the Bad and the Ugly',
                image: 'assets/images/goodbadugly_poster.jpg',
                synopsis: 'During the American Civil War, three distinct gunmen – the precise Blondie (Clint Eastwood), the ruthless Angel Eyes (Lee Van Cleef), and the opportunistic Tuco (Eli Wallach) – race to find a fortune in buried Confederate gold.',
                cast: 'Director: Sergio Leone | Cast: Clint Eastwood, Eli Wallach, Lee Van Cleef',
                buyLink: 'YOUR_BLURAY_BUY_LINK_HERE_GBU',
                page: 'goodbadugly.html'
            }
        };

        const stopAllThemes = () => {
            Object.values(themeAudios).forEach(audio => {
                if (audio && typeof audio.pause === 'function' && !audio.paused) {
                    audio.pause();
                    audio.currentTime = 0;
                }
            });
            currentAudio = null;
        };

        const resetInfoPanel = () => {
            if (infoPlaceholder) infoPlaceholder.style.display = 'block';
            if (infoImage) {
                infoImage.style.display = 'none';
                infoImage.src = '';
            }
            if (infoTitle) infoTitle.textContent = '';
            if (infoSynopsis) infoSynopsis.textContent = '';
            if (infoCast) infoCast.textContent = '';
            if (infoBuyLink) {
                infoBuyLink.style.display = 'none';
                infoBuyLink.href = '#';
            }
            stopAllThemes();
        };

        movieItems.forEach(item => {
            const movieKey = item.dataset.movie;
            const data = movieData[movieKey];
            const themeAudio = themeAudios[movieKey];

            item.addEventListener('mouseenter', () => {
                if (!data) return;
                if (infoPlaceholder) infoPlaceholder.style.display = 'none';
                if (infoTitle) infoTitle.textContent = data.title;
                if (infoImage) {
                    infoImage.src = data.image;
                    infoImage.alt = data.title + ' scene';
                    infoImage.style.display = 'block';
                }
                if (infoSynopsis) infoSynopsis.textContent = data.synopsis;
                if (infoCast) infoCast.textContent = data.cast;
                if (infoBuyLink) {
                    infoBuyLink.href = data.buyLink;
                    infoBuyLink.style.display = 'inline-block';
                }
                stopAllThemes();
                if (themeAudio && typeof themeAudio.play === 'function') {
                    themeAudio.currentTime = 0;
                    themeAudio.play().catch(error => console.warn("Theme audio error:", error));
                    currentAudio = themeAudio;
                }
            });

            item.addEventListener('mouseleave', () => {
                resetInfoPanel();
            });

            item.addEventListener('click', () => {
                if (data && data.page) {
                    window.location.href = data.page;
                }
            });
        });

        if (infoPanel) {
             resetInfoPanel();
        }
    }

    if (body.classList.contains('movie-detail-page')) {
        // Specific JS for detail pages
    }
});
