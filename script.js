// Main JavaScript file for FEMA website

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the website with animations and time-based features
    initializeWebsite();
});

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
}

/**
 * Update the background based on current time of day
 */
function updateBackgroundByTime() {
    const now = new Date();
    const hour = now.getHours();
    const background = document.getElementById('dynamic-background');
    
    // Remove all existing time classes
    background.classList.remove('morning-bg', 'noon-bg', 'evening-bg', 'night-bg', 'night-active');
    
    // Set appropriate background based on time
    if (hour >= 5 && hour < 10) {
        // Morning (5:00 AM - 9:59 AM)
        background.classList.add('morning-bg');
        setTextColorForBackground('light');
    } else if (hour >= 10 && hour < 16) {
        // Noon (10:00 AM - 3:59 PM)
        background.classList.add('noon-bg');
        setTextColorForBackground('light');
    } else if (hour >= 16 && hour < 19) {
        // Evening (4:00 PM - 6:59 PM)
        background.classList.add('evening-bg');
        setTextColorForBackground('light');
    } else {
        // Night (7:00 PM - 4:59 AM)
        background.classList.add('night-bg');
        background.classList.add('night-active'); // Activate stars
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
    // Header animations
    gsap.to(".header", {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out"
    });
    
    // Staggered animation for project cards
    gsap.to(".project-card", {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power2.out",
        delay: 0.5
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
function addProjectCard(projectData) {
    // Create a new project card element
    const projectCard = document.createElement('div');
    projectCard.className = 'project-card';
    
    // Create the inner structure
    projectCard.innerHTML = `
        <div class="project-card-inner">
            <div class="project-image">
                <img src="${projectData.imageUrl || '/api/placeholder/600/400'}" alt="${projectData.title}">
            </div>
            <div class="project-details">
                <h3>${projectData.title}</h3>
                <p>${projectData.description}</p>
                <a href="${projectData.link || '#'}" class="project-link">Lihat Project</a>
            </div>
        </div>
    `;
    
    // Add the new card to the container
    const projectsContainer = document.querySelector('.projects-container');
    projectsContainer.appendChild(projectCard);
    
    // Apply animations to the new card
    gsap.fromTo(projectCard, 
        { opacity: 0, y: 30 }, 
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
    );
    
    // Apply 3D effects to the new card
    const inner = projectCard.querySelector('.project-card-inner');
    
    projectCard.addEventListener('mousemove', e => {
        if (window.innerWidth <= 768) return;
        
        const cardRect = projectCard.getBoundingClientRect();
        const cardCenterX = cardRect.left + cardRect.width / 2;
        const cardCenterY = cardRect.top + cardRect.height / 2;
        
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        
        const rotateY = (mouseX - cardCenterX) / 20;
        const rotateX = (cardCenterY - mouseY) / 20;
        
        inner.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg) translateZ(10px)`;
    });
    
    projectCard.addEventListener('mouseleave', () => {
        inner.style.transform = 'rotateY(0) rotateX(0) translateZ(0)';
    });
}

// Check for browser resize and adjust layout if needed
window.addEventListener('resize', function() {
    if (window.innerWidth <= 768) {
        document.querySelector('.mobile-scroll-indicator').style.display = 'block';
    } else {
        document.querySelector('.mobile-scroll-indicator').style.display = 'none';
    }
});