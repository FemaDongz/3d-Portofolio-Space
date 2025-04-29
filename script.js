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
/**
 * Helper function to add a new project card
 * This can be called later to dynamically add more projects
 * @param {Object} projectData - Project information
 */
function addProject(projectData) {
    // Create project card container
    const projectCard = document.createElement('div');
    projectCard.classList.add('project-card');
    
    // Create inner card structure
    const cardInner = document.createElement('div');
    cardInner.classList.add('project-card-inner');
    
    // Add project image container
    const imageContainer = document.createElement('div');
    imageContainer.classList.add('project-image');
    
    // Add image element
    const image = document.createElement('img');
    image.src = projectData.imageUrl;
    image.alt = projectData.title;
    imageContainer.appendChild(image);
    
    // Add featured badge if project is featured
    if (projectData.featured) {
        const badge = document.createElement('div');
        badge.classList.add('project-badge');
        badge.textContent = 'Featured';
        imageContainer.appendChild(badge);
    }
    
    // Create project details section
    const detailsContainer = document.createElement('div');
    detailsContainer.classList.add('project-details');
    
    // Add project title
    const title = document.createElement('h3');
    title.textContent = projectData.title;
    detailsContainer.appendChild(title);
    
    // Add project description
    const desc = document.createElement('p');
    desc.textContent = projectData.description;
    detailsContainer.appendChild(desc);
    
    // Create links section
    const linksContainer = document.createElement('div');
    linksContainer.classList.add('project-links');
    
    // Add main project link
    const mainLink = document.createElement('a');
    mainLink.href = projectData.link;
    mainLink.classList.add('project-link');
    mainLink.textContent = 'View Project';
    
    // Add icon to link
    const icon = document.createElement('i');
    icon.classList.add('fas', 'fa-arrow-right');
    mainLink.appendChild(icon);
    
    linksContainer.appendChild(mainLink);
    
    // Add tech tags if available
    if (projectData.technologies && projectData.technologies.length > 0) {
        const techContainer = document.createElement('div');
        techContainer.classList.add('project-tech');
        
        // Add up to 2 tech tags for mobile friendliness
        for (let i = 0; i < Math.min(projectData.technologies.length, 2); i++) {
            const tag = document.createElement('span');
            tag.classList.add('tech-tag');
            tag.textContent = projectData.technologies[i];
            techContainer.appendChild(tag);
        }
        
        linksContainer.appendChild(techContainer);
    }
    
    // Assemble all elements
    detailsContainer.appendChild(linksContainer);
    cardInner.appendChild(imageContainer);
    cardInner.appendChild(detailsContainer);
    projectCard.appendChild(cardInner);
    
    // Get projects container and append new card
    const projectsContainer = document.querySelector('.projects-container');
    projectsContainer.appendChild(projectCard);
    
    // Apply entrance animation after a short delay
    setTimeout(() => {
        projectCard.style.opacity = '1';
        projectCard.style.transform = 'translateY(0)';
    }, 100);
    
    // Setup 3D effect for the new card
    setupCardInteraction(projectCard);
    
    // Return the created card element
    return projectCard;
}

/**
 * Setup 3D interaction effect for a single card
 * @param {HTMLElement} card - Project card element
 */
function setupCardInteraction(card) {
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
}

/**
 * Load project data from JSON file or API endpoint
 * @param {string} dataUrl - URL to project data JSON
 */
function loadProjects(dataUrl) {
    fetch(dataUrl)
        .then(response => response.json())
        .then(data => {
            // Clear existing projects if needed
            const projectsContainer = document.querySelector('.projects-container');
            projectsContainer.innerHTML = '';
            
            // Add each project from the data
            data.projects.forEach(project => {
                addProject(project);
            });
        })
        .catch(error => {
            console.error('Error loading projects:', error);
            
            // Load fallback projects in case of error
            loadFallbackProjects();
        });
}

/**
 * Load fallback projects if API fails
 */
function loadFallbackProjects() {
    // Sample fallback projects
    const fallbackProjects = [
        {
            title: "FEMA Disaster Recovery",
            description: "Interactive portal for disaster relief applications and status tracking",
            imageUrl: "/images/projects/disaster-recovery.jpg",
            link: "#disaster-recovery",
            technologies: ["React", "Node.js"],
            featured: true
        },
        {
            title: "Relief Fund Tracker",
            description: "Real-time dashboard for tracking disaster relief fund allocation",
            imageUrl: "/images/projects/relief-fund.jpg",
            link: "#relief-fund",
            technologies: ["D3.js", "Firebase"]
        },
        {
            title: "Emergency Alert System",
            description: "Mobile-first notification system for emergency broadcasts",
            imageUrl: "/images/projects/alert-system.jpg",
            link: "#alert-system",
            technologies: ["React Native", "AWS"]
        },
        {
            title: "Volunteer Management",
            description: "Platform connecting volunteers with disaster relief opportunities",
            imageUrl: "/images/projects/volunteer.jpg",
            link: "#volunteer",
            technologies: ["Vue.js", "MongoDB"]
        }
    ];
    
    // Add fallback projects to the container
    fallbackProjects.forEach(project => {
        addProject(project);
    });
}

/**
 * Create ripple effect on buttons and interactive elements
 */
function createRippleEffect() {
    document.addEventListener('click', function(event) {
        // Only add ripple to elements with ripple class
        if (!event.target.classList.contains('btn') && 
            !event.target.classList.contains('project-link') &&
            !event.target.classList.contains('nav-button')) {
            return;
        }
        
        const button = event.target;
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
        ripple.style.top = `${event.clientY - rect.top - size / 2}px`;
        
        button.appendChild(ripple);
        
        // Remove ripple after animation completes
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
}

/**
 * Initialize contact form functionality
 */
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        
        // Validate form
        if (!name || !email || !message) {
            showNotification('Please fill in all fields', 'error');
            return;
        }
        
        // Simulate form submission
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';
        
        // Simulate API call with timeout
        setTimeout(() => {
            // Reset form
            contactForm.reset();
            submitButton.disabled = false;
            submitButton.textContent = originalText;
            
            // Show success message
            showNotification('Message sent successfully!', 'success');
        }, 1500);
    });
}

/**
 * Display notification message
 * @param {string} message - Notification message
 * @param {string} type - Notification type (success, error, info)
 */
function showNotification(message, type = 'info') {
    // Create notification element if it doesn't exist
    let notification = document.querySelector('.notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.classList.add('notification');
        document.body.appendChild(notification);
    }
    
    // Set message and type
    notification.textContent = message;
    notification.className = 'notification'; // Reset classes
    notification.classList.add(`notification-${type}`);
    
    // Show notification
    notification.classList.add('show');
    
    // Hide after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

/**
 * Initialize the application when DOM is fully loaded
 */
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
    
    // Create ripple effects
    createRippleEffect();
    
    // Initialize contact form if it exists
    initContactForm();
    
    // Load projects from API or fallback
    loadProjects('/api/projects.json');
});
