document.addEventListener('DOMContentLoaded', () => {
    
    // --- Mobile Menu Toggle ---
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

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

    // --- Trailer Modal Logic ---
    const trailerModal = document.getElementById('trailer-modal');
    const openTrailerBtn = document.getElementById('open-trailer');
    const playTeaserBtn = document.getElementById('play-teaser-btn');
    const closeTrailerBtn = document.getElementById('close-trailer');
    const trailerVideo = document.getElementById('trailer-video');
    
    function openTrailer() {
        trailerModal.classList.remove('hidden');
        if(trailerVideo) {
            trailerVideo.play().catch(e => console.log("Autoplay prevented"));
        }
        // Pequeño delay para que la transición de opacidad funcione
        setTimeout(() => {
            trailerModal.classList.remove('opacity-0');
        }, 10);
    }

    function closeTrailer() {
        trailerModal.classList.add('opacity-0');
        setTimeout(() => {
            trailerModal.classList.add('hidden');
            if(trailerVideo) {
                trailerVideo.pause();
                trailerVideo.currentTime = 0;
            }
        }, 300);
    }

    if(openTrailerBtn) openTrailerBtn.addEventListener('click', (e) => { e.preventDefault(); openTrailer(); });
    if(playTeaserBtn) playTeaserBtn.addEventListener('click', (e) => { e.preventDefault(); openTrailer(); });
    if(closeTrailerBtn) closeTrailerBtn.addEventListener('click', closeTrailer);

    // --- Miniatura del tráiler (hero + modal) ---
    const TRAILER_SRC = 'assets/videos/Trailer.mp4';
    const trailerTeaserImg = document.getElementById('trailer-teaser-img');

    function applyTrailerThumbnail(dataURL) {
        if (trailerVideo) trailerVideo.poster = dataURL;
        if (trailerTeaserImg) {
            if (trailerTeaserImg.tagName === 'IMG') {
                trailerTeaserImg.src = dataURL;
            } else {
                trailerTeaserImg.poster = dataURL;
            }
        }
    }

    if (trailerTeaserImg && trailerTeaserImg.tagName === 'VIDEO') {
        trailerTeaserImg.addEventListener('loadedmetadata', () => {
            trailerTeaserImg.currentTime = 0.5;
        }, { once: true });
        trailerTeaserImg.addEventListener('seeked', () => {
            trailerTeaserImg.pause();
        }, { once: true });
    }

    if (trailerVideo) {
        const thumbVideo = document.createElement('video');
        thumbVideo.src = TRAILER_SRC;
        thumbVideo.muted = true;
        thumbVideo.playsInline = true;
        thumbVideo.preload = 'auto';
        thumbVideo.style.display = 'none';
        document.body.appendChild(thumbVideo);

        thumbVideo.addEventListener('seeked', () => {
            try {
                const canvas = document.createElement('canvas');
                canvas.width = thumbVideo.videoWidth || 640;
                canvas.height = thumbVideo.videoHeight || 360;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(thumbVideo, 0, 0, canvas.width, canvas.height);
                applyTrailerThumbnail(canvas.toDataURL('image/jpeg', 0.85));
            } catch (e) {
                thumbVideo.addEventListener('loadeddata', () => {
                    try {
                        const canvas = document.createElement('canvas');
                        canvas.width = thumbVideo.videoWidth || 640;
                        canvas.height = thumbVideo.videoHeight || 360;
                        canvas.getContext('2d').drawImage(thumbVideo, 0, 0, canvas.width, canvas.height);
                        applyTrailerThumbnail(canvas.toDataURL('image/jpeg', 0.85));
                    } catch (_) {
                        if (trailerTeaserImg && trailerTeaserImg.tagName === 'VIDEO') {
                            trailerTeaserImg.currentTime = 0.5;
                        }
                    }
                }, { once: true });
            }
            document.body.removeChild(thumbVideo);
        }, { once: true });

        thumbVideo.addEventListener('loadedmetadata', () => {
            thumbVideo.currentTime = 0.5;
        }, { once: true });
    }
    
    // Close modal on background click
    trailerModal.addEventListener('click', (e) => {
        if (e.target === trailerModal) {
            closeTrailer();
        }
    });

    // --- Elige tu Camino Logic (Interactive Video) ---
    const pathButtons = document.querySelectorAll('.path-btn');
    
    window.changeVideoPath = function(videoId, startTime = 0) {
        const player = document.getElementById('main-video-player');
        
        // Formatear URL con el tiempo de inicio y el parámetro si
        let url = `https://www.youtube.com/embed/${videoId}?si=B-9fSK37DAIreCws&rel=0&autoplay=1`;
        if (startTime > 0) {
            url += `&start=${startTime}`;
        }
        
        player.src = url;

        // Actualizar UI de los botones (estado activo)
        pathButtons.forEach(btn => {
            btn.classList.remove('bg-upseBlue', 'text-white');
            btn.classList.add('bg-white', 'text-upseBlue');
        });

        if (event && event.currentTarget) {
            const activeBtn = event.currentTarget;
            activeBtn.classList.remove('bg-white', 'text-upseBlue');
            activeBtn.classList.add('bg-upseBlue', 'text-white');
        }
    };

    // --- Lightbox Logic ---
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeLightboxBtn = document.getElementById('close-lightbox');
    const galleryImages = document.querySelectorAll('.gallery-img');

    if(lightboxModal && galleryImages.length > 0) {
        galleryImages.forEach(img => {
            img.addEventListener('click', () => {
                lightboxImg.src = img.src;
                lightboxModal.classList.remove('hidden');
                setTimeout(() => {
                    lightboxModal.classList.remove('opacity-0');
                }, 10);
            });
        });

        const closeLightbox = () => {
            lightboxModal.classList.add('opacity-0');
            setTimeout(() => {
                lightboxModal.classList.add('hidden');
                lightboxImg.src = '';
            }, 300);
        };

        if(closeLightboxBtn) closeLightboxBtn.addEventListener('click', closeLightbox);
        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal) closeLightbox();
        });
    }
});
