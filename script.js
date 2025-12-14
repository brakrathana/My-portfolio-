// ===========================================
// Portfolio Website - Main JavaScript
// ===========================================

// DOM Elements
const loader = document.querySelector('.loader');
const backToTopBtn = document.getElementById('backToTop');
const themeToggle = document.getElementById('themeToggle');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');
const contactForm = document.getElementById('contactForm');
const yearSpan = document.getElementById('currentYear');

// Testimonials Carousel Elements
const testimonialSlides = document.querySelectorAll('.testimonial-slide');
const dots = document.querySelectorAll('.dot');
const prevBtn = document.querySelector('.slider-btn.prev');
const nextBtn = document.querySelector('.slider-btn.next');

// Typing Effect Elements
const typedTextSpan = document.querySelector('.typed-text');
const cursorSpan = document.querySelector('.cursor');

// Skill Progress Elements
const skillProgressBars = document.querySelectorAll('.skill-progress');
const skillProgressFills = document.querySelectorAll('.skill-progress-fill');

// ===========================================
// Global Variables
// ===========================================
let currentSlide = 0;
let slideInterval;
const slideDuration = 5000; // 5 seconds

// Text for typing effect
const textArray = [
    "Frontend Developer",
    "UI/UX Designer",
    "Web Developer",
    "React Specialist"
];
const typingDelay = 100;
const erasingDelay = 50;
const newTextDelay = 1500;
let textArrayIndex = 0;
let charIndex = 0;

// ===========================================
// Utility Functions
// ===========================================
function debounce(func, wait = 10, immediate = true) {
    let timeout;
    return function() {
        const context = this, args = arguments;
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

// ===========================================
// Loading Animation
// ===========================================
window.addEventListener('load', () => {
    setTimeout(() => {
        loader.classList.add('hidden');
        document.body.style.overflow = 'auto';
        
        // Initialize animations after loading
        initAnimations();
    }, 1000);
});

// ===========================================
// Theme Toggle
// ===========================================
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Update toggle button icon based on theme
    updateThemeIcon(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Update toggle button icon
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const moonIcon = themeToggle.querySelector('.fa-moon');
    const sunIcon = themeToggle.querySelector('.fa-sun');
    
    if (theme === 'dark') {
        moonIcon.style.display = 'none';
        sunIcon.style.display = 'block';
    } else {
        moonIcon.style.display = 'block';
        sunIcon.style.display = 'none';
    }
}

// ===========================================
// Navigation
// ===========================================
function toggleMobileMenu() {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', hamburger.classList.contains('active'));
    
    // Toggle body scroll
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : 'auto';
}

function closeMobileMenu() {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = 'auto';
}

function smoothScroll(e) {
    e.preventDefault();
    
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    
    const targetElement = document.querySelector(targetId);
    if (!targetElement) return;
    
    const headerHeight = document.querySelector('.navbar').offsetHeight;
    const targetPosition = targetElement.offsetTop - headerHeight;
    
    window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
    });
    
    // Close mobile menu if open
    if (navMenu.classList.contains('active')) {
        closeMobileMenu();
    }
}

// ===========================================
// Back to Top Button
// ===========================================
function handleScroll() {
    // Show/hide back to top button
    if (window.scrollY > 300) {
        backToTopBtn.classList.add('show');
    } else {
        backToTopBtn.classList.remove('show');
    }
    
    // Add shadow to navbar on scroll
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Update active nav link
    updateActiveNavLink();
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// ===========================================
// Active Navigation Link
// ===========================================
function updateActiveNavLink() {
    const scrollPosition = window.scrollY + 100;
    
    document.querySelectorAll('section').forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// ===========================================
// Typing Effect
// ===========================================
function typeEffect() {
    if (charIndex < textArray[textArrayIndex].length) {
        // Typing
        if (!cursorSpan.classList.contains('typing')) {
            cursorSpan.classList.add('typing');
        }
        typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
        charIndex++;
        setTimeout(typeEffect, typingDelay);
    } else {
        // Finished typing, start erasing
        cursorSpan.classList.remove('typing');
        setTimeout(eraseEffect, newTextDelay);
    }
}

function eraseEffect() {
    if (charIndex > 0) {
        // Erasing
        if (!cursorSpan.classList.contains('typing')) {
            cursorSpan.classList.add('typing');
        }
        typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
        charIndex--;
        setTimeout(eraseEffect, erasingDelay);
    } else {
        // Finished erasing, move to next text
        cursorSpan.classList.remove('typing');
        textArrayIndex = (textArrayIndex + 1) % textArray.length;
        setTimeout(typeEffect, typingDelay + 500);
    }
}

// ===========================================
// Testimonials Carousel
// ===========================================
function showSlide(n) {
    // Remove active class from all slides and dots
    testimonialSlides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    // Calculate new slide index
    currentSlide = (n + testimonialSlides.length) % testimonialSlides.length;
    
    // Add active class to current slide and dot
    testimonialSlides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
}

function nextSlide() {
    showSlide(currentSlide + 1);
}

function prevSlide() {
    showSlide(currentSlide - 1);
}

function goToSlide(e) {
    if (!e.target.classList.contains('dot')) return;
    
    const slideIndex = parseInt(e.target.getAttribute('data-slide'));
    showSlide(slideIndex);
    resetSlideInterval();
}

function startSlideInterval() {
    slideInterval = setInterval(nextSlide, slideDuration);
}

function resetSlideInterval() {
    clearInterval(slideInterval);
    startSlideInterval();
}

// ===========================================
// Skills Animation
// ===========================================
function animateSkills() {
    skillProgressBars.forEach(bar => {
        const width = bar.getAttribute('data-width');
        if (isElementInViewport(bar)) {
            bar.style.width = `${width}%`;
        }
    });
    
    skillProgressFills.forEach(fill => {
        const width = fill.getAttribute('data-width');
        if (isElementInViewport(fill)) {
            fill.style.width = `${width}%`;
        }
    });
}

function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
        rect.bottom >= 0
    );
}

// ===========================================
// Form Validation
// ===========================================
function validateForm(e) {
    e.preventDefault();
    
    let isValid = true;
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const subject = document.getElementById('subject');
    const message = document.getElementById('message');
    
    // Reset error messages
    document.querySelectorAll('.error-message').forEach(error => {
        error.classList.remove('show');
    });
    
    // Name validation
    if (!name.value.trim()) {
        showError('nameError', 'Name is required');
        isValid = false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim()) {
        showError('emailError', 'Email is required');
        isValid = false;
    } else if (!emailRegex.test(email.value)) {
        showError('emailError', 'Please enter a valid email address');
        isValid = false;
    }
    
    // Subject validation
    if (!subject.value.trim()) {
        showError('subjectError', 'Subject is required');
        isValid = false;
    } else if (subject.value.trim().length < 5) {
        showError('subjectError', 'Subject must be at least 5 characters long');
        isValid = false;
    }
    
    // Message validation
    if (!message.value.trim()) {
        showError('messageError', 'Message is required');
