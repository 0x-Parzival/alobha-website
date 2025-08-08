// Global variables and state
let isLoading = true;
let currentPhoneScreen = 0;
let phoneScreenInterval;
let animatedCounters = new Set();
let ticking = false;

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    // Initialize loading sequence
    initLoadingScreen();
    
    // Initialize all functionality after loading
    setTimeout(() => {
        initializeApp();
    }, 3000);
});

// Loading Screen Management
function initLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    const body = document.body;
    
    // Animate loading progress
    const progressBar = document.querySelector('.loading-progress');
    if (progressBar) {
        progressBar.style.animation = 'loading 3s ease-in-out forwards';
    }
    
    // Hide loading screen after animation
    setTimeout(() => {
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
        }
        body.classList.add('loaded');
        isLoading = false;
        
        // Start hero animations
        startHeroAnimations();
    }, 3000);
}

// Initialize all app functionality
function initializeApp() {
    initMobileMenu();
    initSmoothScrolling();
    initScrollEffects();
    initAnimatedCounters();
    initPhoneAnimation();
    initServiceCardEffects();
    initContactForm();
    initScrollAnimations();
    initTechnologyEffects();
    initProcessTimeline();
    initParallaxEffects();
    
    console.log('Alobha Technologies - Premium Website Initialized');
}

// Mobile Menu Functionality
function initMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navigation = document.getElementById('navigation');
    const navLinks = document.querySelectorAll('.nav__link');
    
    if (mobileMenuToggle && navigation) {
        mobileMenuToggle.addEventListener('click', function() {
            const isOpen = navigation.classList.contains('nav-open');
            
            if (isOpen) {
                closeMenu();
            } else {
                openMenu();
            }
        });
        
        // Close menu when clicking nav links
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                closeMenu();
                updateActiveNavLink(this);
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navigation.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                closeMenu();
            }
        });
        
        // Close menu with escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navigation.classList.contains('nav-open')) {
                closeMenu();
                mobileMenuToggle.focus();
            }
        });
    }
    
    function openMenu() {
        navigation.classList.add('nav-open');
        mobileMenuToggle.classList.add('active');
        mobileMenuToggle.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    }
    
    function closeMenu() {
        navigation.classList.remove('nav-open');
        mobileMenuToggle.classList.remove('active');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }
}

// Smooth Scrolling Navigation - FIXED VERSION
function initSmoothScrolling() {
    // Get all links that start with #
    const scrollLinks = document.querySelectorAll('a[href^="#"]');
    
    scrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const header = document.getElementById('header');
                const headerHeight = header ? header.offsetHeight : 80;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                // Use native smooth scroll with fallback
                if ('scrollBehavior' in document.documentElement.style) {
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                } else {
                    // Fallback for older browsers
                    scrollToPosition(targetPosition, 800);
                }
                
                // Update active nav link
                updateActiveNavLink(this);
                
                // Close mobile menu if open
                const navigation = document.getElementById('navigation');
                if (navigation && navigation.classList.contains('nav-open')) {
                    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
                    navigation.classList.remove('nav-open');
                    mobileMenuToggle.classList.remove('active');
                    mobileMenuToggle.setAttribute('aria-expanded', 'false');
                    document.body.style.overflow = '';
                }
            }
        });
    });
}

// Custom smooth scroll function with easing (fallback)
function scrollToPosition(target, duration) {
    const start = window.pageYOffset;
    const distance = target - start;
    let startTime = null;
    
    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = easeInOutQuad(timeElapsed, start, distance, duration);
        window.scrollTo(0, run);
        
        if (timeElapsed < duration) {
            requestAnimationFrame(animation);
        }
    }
    
    // Easing function
    function easeInOutQuad(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }
    
    requestAnimationFrame(animation);
}

// Update active navigation link
function updateActiveNavLink(activeLink) {
    const navLinks = document.querySelectorAll('.nav__link');
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    // Find the nav link that corresponds to this target
    if (activeLink.classList.contains('nav__link')) {
        activeLink.classList.add('active');
    } else {
        // For non-nav links (like buttons), find corresponding nav link
        const href = activeLink.getAttribute('href');
        const correspondingNavLink = document.querySelector(`.nav__link[href="${href}"]`);
        if (correspondingNavLink) {
            correspondingNavLink.classList.add('active');
        }
    }
}

// Scroll Effects (Header, animations)
function initScrollEffects() {
    const header = document.getElementById('header');
    let lastScrollTop = 0;
    let headerVisible = true;
    
    function handleScroll() {
        if (ticking) return;
        
        requestAnimationFrame(() => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Header glass effect
            if (scrollTop > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            // Hide/show header on scroll (only on larger screens)
            if (window.innerWidth > 768) {
                if (scrollTop > lastScrollTop && scrollTop > 200 && headerVisible) {
                    // Scrolling down
                    header.style.transform = 'translateY(-100%)';
                    headerVisible = false;
                } else if (scrollTop < lastScrollTop && !headerVisible) {
                    // Scrolling up
                    header.style.transform = 'translateY(0)';
                    headerVisible = true;
                }
            }
            
            // Update active nav based on scroll position
            updateActiveNavOnScroll();
            
            lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
            ticking = false;
        });
        
        ticking = true;
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true });
}

// Update active nav link based on scroll position
function updateActiveNavOnScroll() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav__link');
    const scrollPosition = window.pageYOffset + 100;
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition <= sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
    
    // Set home as active if at top
    if (scrollPosition < 100) {
        const homeLink = document.querySelector('.nav__link[href="#home"]');
        if (homeLink) {
            homeLink.classList.add('active');
        }
    }
}

// Animated Counters
function initAnimatedCounters() {
    const counters = document.querySelectorAll('[data-count]');
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const counterId = counter.dataset.count;
                
                if (!animatedCounters.has(counterId)) {
                    animateCounter(counter);
                    animatedCounters.add(counterId);
                }
            }
        });
    }, {
        threshold: 0.5
    });
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

function animateCounter(element) {
    const target = parseInt(element.dataset.count);
    const duration = 2000; // 2 seconds
    const step = target / (duration / 16); // 60fps
    let current = 0;
    
    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        // Format the number
        let displayValue = Math.floor(current);
        if (target >= 1000) {
            displayValue = Math.floor(current / 1000) + 'K+';
        } else {
            displayValue = Math.floor(current) + '+';
        }
        
        element.textContent = displayValue;
    }, 16);
}

// Phone 3D Animation and Screen Switching
function initPhoneAnimation() {
    const phone3d = document.getElementById('phone3d');
    const screens = document.querySelectorAll('.screen-content');
    
    if (phone3d && screens.length > 0) {
        // Start screen switching
        startScreenSwitching();
        
        // Pause animation on hover
        phone3d.addEventListener('mouseenter', () => {
            phone3d.style.animationPlayState = 'paused';
            pauseScreenSwitching();
        });
        
        phone3d.addEventListener('mouseleave', () => {
            phone3d.style.animationPlayState = 'running';
            startScreenSwitching();
        });
        
        // Touch support
        phone3d.addEventListener('touchstart', () => {
            phone3d.style.animationPlayState = 'paused';
            pauseScreenSwitching();
        });
        
        phone3d.addEventListener('touchend', () => {
            setTimeout(() => {
                phone3d.style.animationPlayState = 'running';
                startScreenSwitching();
            }, 2000);
        });
    }
}

function startScreenSwitching() {
    const screens = document.querySelectorAll('.screen-content');
    
    if (screens.length > 1) {
        phoneScreenInterval = setInterval(() => {
            // Remove active class from current screen
            screens[currentPhoneScreen].classList.remove('active');
            
            // Move to next screen
            currentPhoneScreen = (currentPhoneScreen + 1) % screens.length;
            
            // Add active class to new screen
            screens[currentPhoneScreen].classList.add('active');
        }, 4000);
    }
}

function pauseScreenSwitching() {
    if (phoneScreenInterval) {
        clearInterval(phoneScreenInterval);
    }
}

// Service Card Effects
function initServiceCardEffects() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            // Add subtle tilt effect
            this.style.transform = 'translateY(-8px) rotateX(2deg) rotateY(1deg)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) rotateX(0) rotateY(0)';
        });
        
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            this.style.transform = `translateY(-8px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
    });
}

// Contact Form Functionality
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;
            
            // Basic validation
            if (!validateForm(formData)) {
                return;
            }
            
            // Show loading state
            submitButton.innerHTML = `
                <div style="display: flex; align-items: center; gap: 8px;">
                    <div class="spinner"></div>
                    Sending...
                </div>
            `;
            submitButton.disabled = true;
            
            // Simulate form submission
            setTimeout(() => {
                showNotification('Thank you! Your message has been sent successfully. We\'ll get back to you within 24 hours.', 'success');
                contactForm.reset();
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
            }, 2000);
        });
    }
}

function validateForm(formData) {
    const name = formData.get('name')?.trim();
    const email = formData.get('email')?.trim();
    const message = formData.get('message')?.trim();
    
    if (!name) {
        showNotification('Please enter your full name.', 'error');
        return false;
    }
    
    if (!email || !isValidEmail(email)) {
        showNotification('Please enter a valid email address.', 'error');
        return false;
    }
    
    if (!message) {
        showNotification('Please enter your project details.', 'error');
        return false;
    }
    
    return true;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <div class="notification-icon">${getNotificationIcon(type)}</div>
            <div class="notification-message">${message}</div>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    // Add styles
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: '10000',
        background: type === 'success' ? 'rgba(0,128,128,0.95)' : type === 'error' ? 'rgba(220,38,38,0.95)' : 'rgba(59,130,246,0.95)',
        color: 'white',
        padding: '16px 20px',
        borderRadius: '12px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
        backdropFilter: 'blur(20px)',
        maxWidth: '400px',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease, opacity 0.3s ease',
        fontSize: '14px',
        fontWeight: '500'
    });
    
    // Notification content styles
    const content = notification.querySelector('.notification-content');
    Object.assign(content.style, {
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
    });
    
    const closeBtn = notification.querySelector('.notification-close');
    Object.assign(closeBtn.style, {
        background: 'none',
        border: 'none',
        color: 'white',
        fontSize: '20px',
        cursor: 'pointer',
        padding: '0',
        marginLeft: 'auto'
    });
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);
}

function getNotificationIcon(type) {
    switch(type) {
        case 'success': return '✓';
        case 'error': return '✗';
        case 'warning': return '⚠';
        default: return 'ℹ';
    }
}

// Scroll Animations using Intersection Observer
function initScrollAnimations() {
    const animateElements = document.querySelectorAll('.service-card, .tech-category, .team-member, .timeline-item, .glass-card');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Set initial state and observe
    animateElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = `all 0.6s ease ${index * 0.1}s`;
        observer.observe(element);
    });
}

// Technology Section Effects
function initTechnologyEffects() {
    const techCategories = document.querySelectorAll('.tech-category');
    
    techCategories.forEach(category => {
        const techItems = category.querySelectorAll('.tech-item');
        
        category.addEventListener('mouseenter', () => {
            techItems.forEach((item, index) => {
                setTimeout(() => {
                    item.style.transform = 'translateX(4px)';
                    if (!item.classList.contains('featured')) {
                        item.style.backgroundColor = 'var(--color-primary)';
                        item.style.color = 'white';
                    }
                }, index * 100);
            });
        });
        
        category.addEventListener('mouseleave', () => {
            techItems.forEach(item => {
                item.style.transform = 'translateX(0)';
                if (!item.classList.contains('featured')) {
                    item.style.backgroundColor = '';
                    item.style.color = '';
                }
            });
        });
    });
}

// Process Timeline Animation
function initProcessTimeline() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const marker = entry.target.querySelector('.timeline-marker');
                const content = entry.target.querySelector('.content-card');
                
                if (marker && content) {
                    // Animate marker
                    setTimeout(() => {
                        marker.style.transform = 'translateX(-50%) scale(1.1)';
                        marker.style.boxShadow = '0 8px 30px rgba(0,128,128,0.4)';
                        
                        setTimeout(() => {
                            marker.style.transform = 'translateX(-50%) scale(1)';
                        }, 300);
                    }, 200);
                    
                    // Animate content
                    setTimeout(() => {
                        content.style.transform = 'translateY(0)';
                        content.style.opacity = '1';
                    }, 400);
                }
            }
        });
    }, {
        threshold: 0.3
    });
    
    timelineItems.forEach(item => {
        const content = item.querySelector('.content-card');
        if (content) {
            content.style.transform = 'translateY(20px)';
            content.style.opacity = '0';
            content.style.transition = 'all 0.6s ease';
        }
        
        timelineObserver.observe(item);
    });
}

// Parallax Effects
function initParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.hero-particles, .floating-elements');
    
    function updateParallax() {
        if (ticking) return;
        
        requestAnimationFrame(() => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            parallaxElements.forEach(element => {
                element.style.transform = `translateY(${rate}px)`;
            });
            
            ticking = false;
        });
        
        ticking = true;
    }
    
    window.addEventListener('scroll', updateParallax, { passive: true });
}

// Hero Animations
function startHeroAnimations() {
    const heroElements = document.querySelectorAll('.hero__badge, .hero__title, .hero__subtitle, .hero__stats, .hero__buttons, .hero__visual');
    
    heroElements.forEach((element, index) => {
        if (element) {
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 200 + 500);
        }
    });
}

// Utility Functions
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction() {
        const context = this;
        const args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Window Resize Handler
window.addEventListener('resize', debounce(function() {
    // Reset header visibility on resize
    const header = document.getElementById('header');
    if (header && window.innerWidth <= 768) {
        header.style.transform = 'translateY(0)';
    }
    
    // Close mobile menu if switching to desktop
    if (window.innerWidth > 768) {
        const navigation = document.getElementById('navigation');
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        
        if (navigation?.classList.contains('nav-open')) {
            navigation.classList.remove('nav-open');
            mobileMenuToggle?.classList.remove('active');
            mobileMenuToggle?.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    }
}, 250));

// Performance optimizations
// Preload critical resources
function preloadResources() {
    const criticalImages = [
        'https://ppl-ai-code-interpreter-files.s3.amazonaws.com/web/direct-files/743975a26b7bea9c695fcaee028f02c9/9f6c7d3b-6f2e-45cd-9c89-1cda111dcefc/45831640.png'
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Initialize preloading
preloadResources();

// Add CSS for spinner and additional animations
function injectDynamicStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .spinner {
            width: 16px;
            height: 16px;
            border: 2px solid rgba(255,255,255,0.3);
            border-top: 2px solid white;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .service-card {
            transform-style: preserve-3d;
            transition: all 0.3s ease;
        }
        
        .tech-item {
            transition: all 0.3s ease;
        }
        
        .phone-reflection {
            position: absolute;
            bottom: -100%;
            left: 0;
            right: 0;
            height: 100%;
            background: linear-gradient(180deg, rgba(0,0,0,0.1) 0%, transparent 70%);
            transform: rotateX(180deg);
            opacity: 0.3;
        }
        
        /* Enhanced mobile menu animation */
        @media (max-width: 768px) {
            .header__nav {
                backdrop-filter: blur(20px);
                -webkit-backdrop-filter: blur(20px);
            }
            
            .nav__list {
                animation: slideInFromRight 0.5s ease;
            }
            
            @keyframes slideInFromRight {
                from {
                    transform: translateX(100px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        }
        
        /* Accessibility improvements */
        @media (prefers-reduced-motion: reduce) {
            .phone-3d {
                animation: none !important;
            }
            
            .float-element {
                animation: none !important;
            }
            
            * {
                transition-duration: 0.01ms !important;
                animation-duration: 0.01ms !important;
            }
        }
        
        /* Focus styles for better accessibility */
        .btn:focus-visible,
        .form-control:focus-visible,
        .nav__link:focus-visible {
            outline: 3px solid var(--color-primary);
            outline-offset: 2px;
        }
    `;
    
    document.head.appendChild(style);
}

// Inject dynamic styles
injectDynamicStyles();

// Easter egg - Konami Code
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];

document.addEventListener('keydown', function(e) {
    konamiCode.push(e.code);
    konamiCode = konamiCode.slice(-konamiSequence.length);
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        showNotification('🎉 You found the easter egg! Welcome to Alobha Technologies - where innovation meets excellence!', 'success');
        
        // Add some fun effects
        const phone3d = document.getElementById('phone3d');
        if (phone3d) {
            phone3d.style.animation = 'rotate3d 2s linear infinite, float 1s ease-in-out infinite';
        }
        
        konamiCode = [];
    }
});

// Service Worker Registration (for PWA support)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // We're not registering an actual service worker, but this shows the structure
        console.log('PWA features ready for implementation');
    });
}

// Analytics and Performance Monitoring
function initAnalytics() {
    // Track page load time
    window.addEventListener('load', function() {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        console.log(`Page loaded in ${loadTime}ms`);
    });
    
    // Track user interactions
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn') || e.target.classList.contains('service-card')) {
            console.log('User interaction tracked:', e.target.textContent?.trim() || e.target.className);
        }
    });
}

// Initialize analytics
initAnalytics();

// Global error handler
window.addEventListener('error', function(e) {
    console.error('Global error caught:', e.error);
    // In production, you'd send this to your error tracking service
});

// Unhandled promise rejection handler
window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
    // In production, you'd send this to your error tracking service
});

// Export functions for potential external use
window.AlobhaTechnologies = {
    showNotification,
    scrollToPosition,
    updateActiveNavLink
};

console.log('🚀 Alobha Technologies - Premium Website Loaded Successfully!');
console.log('✨ Featuring: CMMI Level 5 Excellence, 15+ Years Experience, 9000+ Projects Delivered');
console.log('💼 Contact us at: alobha.payment@gmail.com');

// Final initialization check
document.addEventListener('readystatechange', function() {
    if (document.readyState === 'complete') {
        console.log('📍 All resources loaded. Website ready for interaction.');
        
        // Final performance check
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            if (perfData) {
                console.log(`📊 Performance Metrics:
                - DOM Content Loaded: ${Math.round(perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart)}ms
                - Total Load Time: ${Math.round(perfData.loadEventEnd - perfData.loadEventStart)}ms`);
            }
        }, 1000);
    }
});