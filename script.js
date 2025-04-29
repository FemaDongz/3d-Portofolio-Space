// Main JavaScript file for FEMA website

document.addEventListener('DOMContentLoaded', function() {
    // Initialize page loader
    initPageLoader();
    
    // Initialize the website with animations and time-based features
    initializeWebsite();
    
    // Setup custom cursor
    setupCustomCursor();
    
    // Initialize theme toggle
    initThemeToggle();
    
    // Initialize sound effects
    initSoundEffects();
});

/**
 * Initialize page loader animation
 */
function initPageLoader() {
    const pageLoader = document.querySelector('.page-loader');
    const loaderBar = document.querySelector('.loader-bar');
    
    // Animate loader bar
    let progress = 0;
    const interval = setInterval(() => {
        progress += 5;
        loaderBar.style.width = `${progress}%`;
        
        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                pageLoader.classList.add('loaded');
            }, 500);
        }
    }, 50);
}

/**
 * Initialize the website with all primary functionality
 */
function initializeWebsite() {
    // Set background based on current time
    updateBackgroundByTime();
    
    // Set up interval to check time every minute
    setInterval(updateBackgroundByTime, 60000);
    
    // Initialize animations with GSAP
    initAnimations();
    
    // Set up 3D card effects
    setup3DCardEffects();
    
    // Create stars for night sky
    createStars();
    
    // Setup navigation buttons for project cards
    setupProjectNavigation();
}

/**
 * Create stars for night sky background
 */
function createStars() {
    const starsContainer = document.querySelector('.stars');
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    
    // Create random stars
    for (let i = 0; i < 150; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        
        // Random positions
        const left = Math.random() * screenWidth;
        const top = Math.random() * screenHeight;
        
        // Random sizes
        const size = Math.random() * 2;
        
        // Random twinkle animation delay
        const delay = Math.random() * 5;
        
        star.style.left = `${left}px`;
        star.style.top = `${top}px`;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.animationDelay = `${delay}s`;
        
        starsContainer.appendChild(star);
    }
}

/**
 * Setup navigation buttons for project cards
 */
function setupProjectNavigation() {
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');
    const projectsContainer = document.querySelector('.projects-container');
    
    nextButton.addEventListener('click', () => {
        // On desktop we use GSAP animation
        if (window.innerWidth > 768) {
            const currentScrollLeft = projectsContainer.scrollLeft;
            gsap.to(projectsContainer, {
                scrollLeft: currentScrollLeft + 400,
                duration: 0.8,
                ease: "power2.out"
            });
        } else {
            // On mobile, we use native scroll with smooth behavior
            projectsContainer.scrollBy({
                left: window.innerWidth * 0.85,
                behavior: 'smooth'
            });
        }
    });
    
    prevButton.addEventListener('click', () => {
        if (window.innerWidth > 768) {
            const currentScrollLeft = projectsContainer.scrollLeft;
            gsap.to(projectsContainer, {
                scrollLeft: currentScrollLeft - 400,
                duration: 0.8,
                ease: "power2.out"
            });
        } else {
            projectsContainer.scrollBy({
                left: -window.innerWidth * 0.85,
                behavior: 'smooth'
            });
        }
    });
}

/**
 * Set up custom cursor effect
 */
function setupCustomCursor() {
    // Only on desktop devices
    if (window.innerWidth <= 768) return;
    
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    
    document.addEventListener('mousemove', (e) => {
        // Update cursor position with slight delay for outline
        gsap.to(cursorDot, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.1
        });
        
        gsap.to(cursorOutline, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.3
        });
    });
    
    // Hide cursor when leaving the window
    document.addEventListener('mouseout', () => {
        cursorDot.classList.add('hidden');
        cursorOutline.classList.add('hidden');
    });
    
    document.addEventListener('mouseover', () => {
        cursorDot.classList.remove('hidden');
        cursorOutline.classList.remove('hidden');
    });
    
    // Special cursor effects on interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .project-card, .theme-toggle, .sound-toggle');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursorDot.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursorOutline.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        });
        
        element.addEventListener('mouseleave', () => {
            cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
            cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
            cursorOutline.style.backgroundColor = 'transparent';
        });
    });
}

/**
 * Initialize theme toggle functionality
 */
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
    }
    
    // Update toggle position based on current theme
    updateThemeToggleState();
    
    themeToggle.addEventListener('click', () => {
        if (document.body.getAttribute('data-theme') === 'dark') {
            document.body.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
        } else {
            document.body.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        }
        
        // Update toggle position
        updateThemeToggleState();
    });
}

/**
 * Update theme toggle button state
 */
function updateThemeToggleState() {
    const toggleThumb = document.querySelector('.theme-toggle-thumb');
    const isDarkTheme = document.body.getAttribute('data-theme') === 'dark';
    
    if (isDarkTheme) {
        toggleThumb.style.left = '30px';
    } else {
        toggleThumb.style.left = '5px';
    }
}

/**
 * Initialize sound effects
 */
function initSoundEffects() {
    const soundToggle = document.getElementById('sound-toggle');
    const audioVisualizer = document.getElementById('audio-visualizer');
    let audioContext;
    let audioSource;
    let analyzer;
    let isSoundEnabled = false;
    let animationFrame;
    let backgroundMusic;
    
    // Create audio bars for visualizer
    for (let i = 0; i < 30; i++) {
        const bar = document.createElement('div');
        bar.classList.add('audio-bar');
        audioVisualizer.appendChild(bar);
    }
    
    soundToggle.addEventListener('click', () => {
        if (!isSoundEnabled) {
            // Initialize audio
            if (!audioContext) {
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
                analyzer = audioContext.createAnalyser();
                analyzer.fftSize = 64;
                
                // Create and load background music
                backgroundMusic = new Audio();
                backgroundMusic.src = 'https://example.com/path-to-ambient-music.mp3'; // Replace with actual music URL
                backgroundMusic.loop = true;
                backgroundMusic.volume = 0.3;
                
                // Connect audio to analyzer
                audioSource = audioContext.createMediaElementSource(backgroundMusic);
                audioSource.connect(analyzer);
                analyzer.connect(audioContext.destination);
            }
            
            // Play music
            backgroundMusic.play();
            
            // Start visualizer
            audioVisualizer.classList.add('active');
            updateVisualizer();
            
            soundToggle.textContent = '🔇';
            isSoundEnabled = true;
        } else {
            // Stop music
            backgroundMusic.pause();
            
            // Stop visualizer
            audioVisualizer.classList.remove('active');
            cancelAnimationFrame(animationFrame);
            
            soundToggle.textContent = '🔊';
            isSoundEnabled = false;
        }
    });
    
    /**
     * Update audio visualizer animation
     */
    function updateVisualizer() {
        if (!isSoundEnabled) return;
        
        const bufferLength = analyzer.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyzer.getByteFrequencyData(dataArray);
        
        const bars = document.querySelectorAll('.audio-bar');
        const step = Math.floor(bufferLength / bars.length);
        
        for (let i = 0; i < bars.length; i++) {
            const value = dataArray[i * step];
            const height = value * 0.5; // Scale down the height
            bars[i].style.height = height + 'px';
        }
        
        animationFrame = requestAnimationFrame(updateVisualizer);
    }
}

/**
 * Update the background based on current time of day
 */
function updateBackgroundByTime() {
    const now = new Date();
    const hour = now.getHours();
    const background = document.getElementById('dynamic-background');
    
    // Remove all existing time classes
    background.classList.remove('morning-bg', 'noon-bg', 'evening-bg', 'night-bg', 
                               'morning-active', 'noon-active', 'evening-active', 'night-active');
    
    // Set appropriate background based on time
    if (hour >= 5 && hour < 10) {
        // Morning (5:00 AM - 9:59 AM)
        background.classList.add('morning-bg', 'morning-active');
        setTextColorForBackground('light');
    } else if (hour >= 10 && hour < 16) {
        // Noon (10:00 AM - 3:59 PM)
        background.classList.add('noon-bg', 'noon-active');
        setTextColorForBackground('light');
    } else if (hour >= 16 && hour < 19) {
        // Evening (4:00 PM - 6:59 PM)
        background.classList.add('evening-bg', 'evening-active');
        setTextColorForBackground('light');
    } else {
        // Night (7:00 PM - 4:59 AM)
        background.classList.add('night-bg', 'night-active');
        setTextColorForBackground('dark');
    }
}

/**
 * Adjust text colors based on background brightness
 * @param {string} mode - 'light' or 'dark'
 */
function setTextColorForBackground(mode) {
    const body = document.body;
    
    if (mode === 'dark') {
        body.style.color = '#ffffff';
        document.querySelectorAll('.project-card-inner').forEach(card => {
            card.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
            card.style.backdropFilter = 'blur(10px)';
        });
        document.querySelectorAll('.project-details h3').forEach(title => {
            title.style.color = '#ffffff';
        });
        document.querySelectorAll('.project-details p').forEach(p => {
            p.style.color = 'rgba(255, 255, 255, 0.7)';
        });
        document.querySelector('footer').style.color = 'rgba(255, 255, 255, 0.6)';
    } else {
        body.style.color = '#333333';
        document.querySelectorAll('.project-card-inner').forEach(card => {
            card.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
            card.style.backdropFilter = 'blur(10px)';
        });
        document.querySelectorAll('.project-details h3').forEach(title => {
            title.style.color = '#333333';
        });
        document.querySelectorAll('.project-details p').forEach(p => {
            p.style.color = 'rgba(51, 51, 51, 0.7)';
        });
        document.querySelector('footer').style.color = 'rgba(51, 51, 51, 0.6)';
    }
}

/**
 * Initialize GSAP animations
 */
function initAnimations() {
    // Split text for letter animation
    const headerText = document.getElementById('main-title').textContent;
    document.getElementById('main-title').innerHTML = headerText.split('').map(char => 
        `<span class="char">${char === ' ' ? '&nbsp;' : char}</span>`
    ).join('');
    
    // Header text animation
    gsap.to(".char", {
        opacity: 1,
        y: 0,
        stagger: 0.05,
        delay: 1,
        ease: "power3.out"
    });
    
    // Subtitle animation
    gsap.to("#subtitle", {
        opacity: 1,
        y: 0,
        duration: 1,
        delay: 1.5,
        ease: "power3.out"
    });
    
    // Section title animation
    gsap.to(".projects-section h2", {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: 1.8,
        ease: "power2.out"
    });
    
    // Navigation buttons animation
    gsap.to(".projects-nav", {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: 2,
        ease: "power2.out"
    });
    
    // Staggered animation for project cards
    gsap.to(".project-card", {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.15,
        delay: 2.2,
        ease: "power2.out"
    });
}

/**
 * Set up 3D effects for project cards
 */
function setup3DCardEffects() {
    const cards = document.querySelectorAll('.project-card');
    
    cards.forEach(card => {
        // For desktop - mouse hover effect
        card.addEventListener('mousemove', e => {
            if (window.innerWidth <= 768) return; // Skip on mobile devices
            
            const cardRect = card.getBoundingClientRect();
            const cardCenterX = cardRect.left + cardRect.width / 2;
            const cardCenterY = cardRect.top + cardRect.height / 2;
            
            // Calculate rotation based on mouse position relative to card center
            const mouseX = e.clientX;
            const mouseY = e.clientY;
            
            const rotateY = (mouseX - cardCenterX) / 20;
            const rotateX = (cardCenterY - mouseY) / 20;
            
            const inner = card.querySelector('.project-card-inner');
            inner.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg) translateZ(10px)`;
        });
        
        // Reset card on mouse leave
        card.addEventListener('mouseleave', () => {
            const inner = card.querySelector('.project-card-inner');
            inner.style.transform = 'rotateY(0) rotateX(0) translateZ(0)';
        });
    });
    
    // Handle touch events for mobile
    setupMobileCardInteractions();
}

/**
 * Set up touch-based interactions for mobile devices
 */
function setupMobileCardInteractions() {
    // On mobile, we want to ensure the horizontal scrolling works well
    const projectsContainer = document.querySelector('.projects-container');
    
    if (window.innerWidth <= 768) {
        // Make scrolling indicator visible for a while, then fade it out
        const scrollIndicator = document.querySelector('.mobile-scroll-indicator');
        scrollIndicator.style.display = 'block';
        
        setTimeout(() => {
            gsap.to(scrollIndicator, {
                opacity: 0,
                duration: 1.5,
                delay: 3,
                ease: "power2.inOut"
            });
        }, 2000);
        
        // Add scroll snap for better mobile experience
        projectsContainer.style.scrollSnapType = 'x mandatory';
    }
}

/**
 * Helper function to add a new project card
 * This can be called later to dynamically add more projects
 * @param {Object} projectData - Project information
 */
function ad
