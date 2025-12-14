// DOM Elements
const loader = document.querySelector('.loader');
const backToTopBtn = document.getElementById('backToTop');
const themeToggle = document.getElementById('themeToggle');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');
const contactForm = document.getElementById('contactForm');
const testimonialSlides = document.querySelectorAll('.testimonial-slide');
const dots = document.querySelectorAll('.dot');
const prevArrow = document.querySelector('.testimonial-arrow.prev');
const nextArrow = document.querySelector('.testimonial-arrow.next');
const skillProgressBars = document.querySelectorAll('.skill-progress');
const typedTextElement = document.getElementById('typed-text');

// Loading Animation
window.addEventListener('load', () => {
    loader.classList.add('hidden');
});

// Back to Top Button
window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTopBtn.classList.add('show');
    } else {
        backToTopBtn.classList.remove('show');
    }
});

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Dark/Light Mode Toggle
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    
    // Update theme in localStorage
    const isDarkMode = document.body.classList.contains('dark-theme');
    localStorage.setItem('darkMode', isDarkMode);
});

// Check for saved theme preference
const savedTheme = localStorage.getItem('darkMode');
if (savedTheme === 'true') {
    document.body.classList.add('dark-theme');
}

// Mobile Navigation Toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 70,
                behavior: 'smooth'
            });
            
            // Update active nav link
            navLinks.forEach(link => {
                link.classList.remove('active');
            });
            this.classList.add('active');
        }
    });
});

// Active Section Detection
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollY >= (sectionTop - 100)) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Testimonials Carousel
let currentSlide = 0;
const totalSlides = testimonialSlides.length;

function showSlide(slideIndex) {
    // Reset all slides
    testimonialSlides.forEach(slide => {
        slide.classList.remove('active');
    });
    
    // Reset all dots
    dots.forEach(dot => {
        dot.classList.remove('active');
    });
    
    // Show current slide
    testimonialSlides[slideIndex].classList.add('active');
    dots[slideIndex].classList.add('active');
    currentSlide = slideIndex;
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    showSlide(currentSlide);
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    showSlide(currentSlide);
}

// Event listeners for carousel controls
prevArrow.addEventListener('click', prevSlide);
nextArrow.addEventListener('click', nextSlide);

// Event listeners for dots
dots.forEach(dot => {
    dot.addEventListener('click', () => {
        const slideIndex = parseInt(dot.getAttribute('data-slide'));
        showSlide(slideIndex);
    });
});

// Auto-slide testimonials every 5 seconds
let slideInterval = setInterval(nextSlide, 5000);

// Pause auto-slide on hover
const carousel = document.querySelector('.testimonials-carousel');
carousel.addEventListener('mouseenter', () => {
    clearInterval(slideInterval);
});

carousel.addEventListener('mouseleave', () => {
    slideInterval = setInterval(nextSlide, 5000);
});

// Animate Skill Bars on Scroll
function animateSkillBars() {
    skillProgressBars.forEach(bar => {
        const width = bar.getAttribute('data-width');
        const barPosition = bar.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;
        
        if (barPosition < screenPosition) {
            bar.style.width = `${width}%`;
        }
    });
}

window.addEventListener('scroll', animateSkillBars);

// Typing Effect for Hero Section
const typingTexts = [
    "Frontend Developer",
    "UI/UX Designer",
    "Web Developer",
    "React Specialist"
];
let textIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 100;

function typeEffect() {
    const currentText = typingTexts[textIndex];
    
    if (isDeleting) {
        // Deleting text
        typedTextElement.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 50;
    } else {
        // Typing text
        typedTextElement.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 100;
    }
    
    // If text is fully typed
    if (!isDeleting && charIndex === currentText.length) {
        // Pause at the end
        isDeleting = true;
        typingSpeed = 1500;
    } 
    // If text is fully deleted
    else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % typingTexts.length;
        typingSpeed = 500;
    }
    
    setTimeout(typeEffect, typingSpeed);
}

// Start typing effect when page loads
if (typedTextElement) {
    setTimeout(typeEffect, 1000);
}

// Form Validation
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Reset previous errors
        clearErrors();
        
        // Get form values
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const subject = document.getElementById('subject').value.trim();
        const message = document.getElementById('message').value.trim();
        
        let isValid = true;
        
        // Validate name
        if (name === '') {
            showError('nameError', 'Name is required');
            isValid = false;
        } else if (name.length < 2) {
            showError('nameError', 'Name must be at least 2 characters');
            isValid = false;
        }
        
        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email === '') {
            showError('emailError', 'Email is required');
            isValid = false;
        } else if (!emailRegex.test(email)) {
            showError('emailError', 'Please enter a valid email address');
            isValid = false;
        }
        
        // Validate subject
        if (subject === '') {
            showError('subjectError', 'Subject is required');
            isValid = false;
        } else if (subject.length < 5) {
            showError('subjectError', 'Subject must be at least 5 characters');
            isValid = false;
        }
        
        // Validate message
        if (message === '') {
            showError('messageError', 'Message is required');
            isValid = false;
        } else if (message.length < 10) {
            showError('messageError', 'Message must be at least 10 characters');
            isValid = false;
        }
        
        // If form is valid, show success message
        if (isValid) {
            // In a real application, you would send the form data to a server here
            document.getElementById('formSuccess').textContent = 'Thank you! Your message has been sent successfully.';
            contactForm.reset();
            
            // Clear success message after 5 seconds
            setTimeout(() => {
                document.getElementById('formSuccess').textContent = '';
            }, 5000);
        }
    });
}

function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    errorElement.textContent = message;
}

function clearErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(element => {
        element.textContent = '';
    });
    
    document.getElementById('formSuccess').textContent = '';
}

// Update current year in footer
const currentYear = new Date().getFullYear();
const yearElement = document.getElementById('currentYear');
if (yearElement) {
    yearElement.textContent = currentYear;
}

// Animate skill bars on page load
window.addEventListener('load', () => {
    // Trigger skill bar animation
    animateSkillBars();
    
    // Trigger skill progress fill animation
    const skillFillBars = document.querySelectorAll('.skill-progress-fill');
    skillFillBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0';
        setTimeout(() => {
            bar.style.width = width;
        }, 500);
    });
});

// Download CV button functionality
const downloadBtn = document.querySelector('.download-btn');
if (downloadBtn) {
    downloadBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Create a sample PDF content (in a real scenario, this would link to an actual PDF file)
        const pdfContent = `
            JOHN DOE - FRONTEND DEVELOPER RESUME
            
            CONTACT INFORMATION
            Email: john.doe@example.com
            Phone: +1 (123) 456-7890
            Location: New York, USA
            LinkedIn: linkedin.com/in/johndoe
            GitHub: github.com/johndoe
            
            SUMMARY
            Frontend Developer with 5+ years of experience creating responsive, 
            user-friendly websites and applications. Specialized in HTML, CSS, 
            JavaScript, and React.js.
            
            EXPERIENCE
            Senior Frontend Developer | Tech Solutions Inc. | 2021-Present
            - Lead frontend development for multiple client projects
            - Implement responsive designs and optimize web performance
            
            Frontend Developer | Creative Agency Co. | 2019-2021
            - Developed websites and web applications for various clients
            - Collaborated with designers to implement pixel-perfect UI
            
            EDUCATION
            Master in Computer Science | Stanford University | 2020-2022
            Bachelor in Software Engineering | MIT | 2016-2020
            
            SKILLS
            • HTML5/CSS3/SCSS
            • JavaScript (ES6+)
            • React.js
            • UI/UX Design
            • Responsive Web Design
            • Git/GitHub
            • Web Performance Optimization
        `;
        
        // Create a Blob with the PDF content
        const blob = new Blob([pdfContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        
        // Create a temporary link element to trigger download
        const link = document.createElement('a');
        link.href = url;
        link.download = 'JohnDoe_Resume.pdf';
        document.body.appendChild(link);
        link.click();
        
        // Clean up
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        // Show a message to the user
        alert('Your resume download has started. In a real application, this would download an actual PDF file.');
    });
}