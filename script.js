// ===== DOM ELEMENTS =====
const header = document.querySelector('.header');
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const navLinksItems = document.querySelectorAll('.nav-links a');
const contactForm = document.getElementById('contactForm');
const darkModeToggle = document.getElementById('darkModeToggle');

// ===== DARK MODE TOGGLE =====
const initDarkMode = () => {
    // Check for saved preference or system preference
    const savedMode = localStorage.getItem('darkMode');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedMode === 'enabled' || (!savedMode && prefersDark)) {
        document.body.classList.add('dark-mode');
        updateDarkModeIcon(true);
    }
};

const updateDarkModeIcon = (isDark) => {
    const icon = darkModeToggle.querySelector('i');
    if (isDark) {
        icon.classList.remove('fa-lightbulb');
        icon.classList.add('fa-moon');
    } else {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-lightbulb');
    }
};

darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    
    // Save preference
    localStorage.setItem('darkMode', isDark ? 'enabled' : 'disabled');
    
    // Update icon
    updateDarkModeIcon(isDark);
    
    // Add animation effect
    darkModeToggle.style.transform = 'rotate(360deg) scale(1.2)';
    setTimeout(() => {
        darkModeToggle.style.transform = '';
    }, 300);
});

// Initialize dark mode on page load
initDarkMode();

// ===== NAVBAR SCROLL EFFECT =====
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// ===== MOBILE NAVIGATION =====
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close mobile nav when clicking a link
navLinksItems.forEach(item => {
    item.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// ===== PRODUCT CATEGORY FILTER =====
const categoryBtns = document.querySelectorAll('.category-btn');
const productCards = document.querySelectorAll('.product-card');

categoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        categoryBtns.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');
        
        const category = btn.dataset.category;
        
        productCards.forEach(card => {
            if (category === 'all' || card.dataset.category === category) {
                card.style.display = 'block';
                card.style.animation = 'fadeInUp 0.5s ease forwards';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// ===== NAVBAR SCROLL EFFECT =====
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// ===== MOBILE NAVIGATION =====
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close mobile nav when clicking a link
navLinksItems.forEach(item => {
    item.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// ===== ACTIVE NAV LINK ON SCROLL =====
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinksItems.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===== CONTACT FORM SUBMISSION =====
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        // Simple validation
        if (!data.name || !data.email || !data.message) {
            alert('Please fill in all required fields.');
            return;
        }
        
        // Simulate form submission
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            alert('Thank you for your message! We will get back to you soon.');
            contactForm.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 1500);
    });
}

// ===== NEWSLETTER FORM =====
const newsletterForm = document.querySelector('.newsletter-form');

if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailInput = newsletterForm.querySelector('input[type="email"]');
        
        if (emailInput.value) {
            alert('Thank you for subscribing to our newsletter!');
            emailInput.value = '';
        }
    });
}

// ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.service-card, .process-step, .project-card, .testimonial-card').forEach(el => {
    observer.observe(el);
});

// ===== STATS COUNTER ANIMATION =====
const statItems = document.querySelectorAll('.stat-item h3');
let statsAnimated = false;

const animateStats = () => {
    if (statsAnimated) return;
    
    statItems.forEach(stat => {
        const target = parseInt(stat.textContent);
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                stat.textContent = target + '+';
                clearInterval(timer);
            } else {
                stat.textContent = Math.floor(current) + '+';
            }
        }, 40);
    });
    
    statsAnimated = true;
};

// Trigger stats animation when hero section is visible
const heroSection = document.querySelector('.hero');
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            setTimeout(animateStats, 500);
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

if (heroSection) {
    statsObserver.observe(heroSection);
}

// ===== PARALLAX EFFECT ON HERO =====
window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero');
    if (hero) {
        const scrolled = window.pageYOffset;
        hero.style.backgroundPositionY = scrolled * 0.5 + 'px';
    }
});

// ===== PROJECT CARDS HOVER EFFECT =====
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.querySelector('.project-overlay').style.opacity = '1';
        this.querySelector('.project-overlay').style.transform = 'translateY(0)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.querySelector('.project-overlay').style.opacity = '0';
        this.querySelector('.project-overlay').style.transform = 'translateY(20px)';
    });
});

// ===== PRELOADER (Optional) =====
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// ===== SCROLL TO TOP FUNCTIONALITY =====
const createScrollToTop = () => {
    const scrollBtn = document.createElement('button');
    scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: var(--primary-color);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 999;
        font-size: 18px;
        box-shadow: 0 4px 15px rgba(232, 90, 27, 0.4);
    `;
    
    document.body.appendChild(scrollBtn);
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            scrollBtn.style.opacity = '1';
            scrollBtn.style.visibility = 'visible';
        } else {
            scrollBtn.style.opacity = '0';
            scrollBtn.style.visibility = 'hidden';
        }
    });
    
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
};

createScrollToTop();

// ===== WHATSAPP FLOATING BUTTON =====
const createWhatsAppButton = () => {
    const whatsappBtn = document.createElement('a');
    whatsappBtn.href = 'https://wa.me/919876543210?text=Hello%2C%20I%20am%20interested%20in%20your%20cables.%20Please%20share%20price%20list.';
    whatsappBtn.target = '_blank';
    whatsappBtn.innerHTML = '<i class="fab fa-whatsapp"></i>';
    whatsappBtn.className = 'whatsapp-float';
    whatsappBtn.title = 'Chat on WhatsApp';
    whatsappBtn.style.cssText = `
        position: fixed;
        bottom: 100px;
        right: 30px;
        width: 60px;
        height: 60px;
        background: #25D366;
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        transition: all 0.3s ease;
        z-index: 999;
        font-size: 28px;
        box-shadow: 0 4px 15px rgba(37, 211, 102, 0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        text-decoration: none;
    `;
    
    document.body.appendChild(whatsappBtn);
    
    whatsappBtn.addEventListener('mouseenter', () => {
        whatsappBtn.style.transform = 'scale(1.1)';
    });
    
    whatsappBtn.addEventListener('mouseleave', () => {
        whatsappBtn.style.transform = 'scale(1)';
    });
};

createWhatsAppButton();

// ===== SERVICES CAROUSEL =====
const initServicesCarousel = () => {
    const carousel = document.getElementById('servicesCarousel');
    const prevBtn = document.getElementById('servicesPrev');
    const nextBtn = document.getElementById('servicesNext');
    
    if (!carousel || !prevBtn || !nextBtn) return;
    
    const cards = carousel.querySelectorAll('.service-card');
    if (cards.length === 0) return;
    
    let currentIndex = 0;
    const visibleCards = 3;
    const totalCards = cards.length;
    const maxIndex = totalCards - visibleCards;
    const gap = 20; // gap between cards in pixels
    
    const updateCarousel = () => {
        // Get the actual card width
        const card = cards[0];
        const cardWidth = card.offsetWidth;
        const moveAmount = currentIndex * (cardWidth + gap);
        carousel.style.transform = `translateX(-${moveAmount}px)`;
        
        // Update button visibility
        prevBtn.style.opacity = currentIndex === 0 ? '0.5' : '1';
        prevBtn.style.cursor = currentIndex === 0 ? 'default' : 'pointer';
        nextBtn.style.opacity = currentIndex >= maxIndex ? '0.5' : '1';
        nextBtn.style.cursor = currentIndex >= maxIndex ? 'default' : 'pointer';
    };
    
    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        }
    });
    
    nextBtn.addEventListener('click', () => {
        if (currentIndex < maxIndex) {
            currentIndex++;
            updateCarousel();
        }
    });
    
    // Handle resize
    window.addEventListener('resize', () => {
        updateCarousel();
    });
    
    // Initial state
    updateCarousel();
};

// ===== ADVANTAGES CAROUSEL =====
const initAdvantagesCarousel = () => {
    const carousel = document.getElementById('advantagesCarousel');
    const prevBtn = document.getElementById('advantagesPrev');
    const nextBtn = document.getElementById('advantagesNext');
    
    if (!carousel || !prevBtn || !nextBtn) return;
    
    const cards = carousel.querySelectorAll('.service-card');
    if (cards.length === 0) return;
    
    let currentIndex = 0;
    const visibleCards = 3;
    const totalCards = cards.length;
    const maxIndex = totalCards - visibleCards;
    const gap = 20;
    
    const updateCarousel = () => {
        const card = cards[0];
        const cardWidth = card.offsetWidth;
        const moveAmount = currentIndex * (cardWidth + gap);
        carousel.style.transform = `translateX(-${moveAmount}px)`;
        
        prevBtn.style.opacity = currentIndex === 0 ? '0.5' : '1';
        prevBtn.style.cursor = currentIndex === 0 ? 'default' : 'pointer';
        nextBtn.style.opacity = currentIndex >= maxIndex ? '0.5' : '1';
        nextBtn.style.cursor = currentIndex >= maxIndex ? 'default' : 'pointer';
    };
    
    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        }
    });
    
    nextBtn.addEventListener('click', () => {
        if (currentIndex < maxIndex) {
            currentIndex++;
            updateCarousel();
        }
    });
    
    window.addEventListener('resize', () => {
        updateCarousel();
    });
    
    updateCarousel();
};

// ===== INDUSTRIES CAROUSEL =====
const initIndustriesCarousel = () => {
    const carousel = document.getElementById('industriesCarousel');
    const prevBtn = document.getElementById('industriesPrev');
    const nextBtn = document.getElementById('industriesNext');
    
    if (!carousel || !prevBtn || !nextBtn) return;
    
    const cards = carousel.querySelectorAll('.service-card');
    if (cards.length === 0) return;
    
    let currentIndex = 0;
    const visibleCards = 3;
    const totalCards = cards.length;
    const maxIndex = totalCards - visibleCards;
    const gap = 20;
    
    const updateCarousel = () => {
        const card = cards[0];
        const cardWidth = card.offsetWidth;
        const moveAmount = currentIndex * (cardWidth + gap);
        carousel.style.transform = `translateX(-${moveAmount}px)`;
        
        prevBtn.style.opacity = currentIndex === 0 ? '0.5' : '1';
        prevBtn.style.cursor = currentIndex === 0 ? 'default' : 'pointer';
        nextBtn.style.opacity = currentIndex >= maxIndex ? '0.5' : '1';
        nextBtn.style.cursor = currentIndex >= maxIndex ? 'default' : 'pointer';
    };
    
    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        }
    });
    
    nextBtn.addEventListener('click', () => {
        if (currentIndex < maxIndex) {
            currentIndex++;
            updateCarousel();
        }
    });
    
    window.addEventListener('resize', () => {
        updateCarousel();
    });
    
    updateCarousel();
};


let servicesCarouselUpdater, advantagesCarouselUpdater, industriesCarouselUpdater;
document.addEventListener('DOMContentLoaded', () => {
    servicesCarouselUpdater = initServicesCarousel();
    advantagesCarouselUpdater = initAdvantagesCarousel();
    industriesCarouselUpdater = initIndustriesCarousel();
});

window.addEventListener('resize', () => {
    if (typeof servicesCarouselUpdater === 'function') servicesCarouselUpdater();
    if (typeof advantagesCarouselUpdater === 'function') advantagesCarouselUpdater();
    if (typeof industriesCarouselUpdater === 'function') industriesCarouselUpdater();
});

console.log('HASEEB CABLES Website loaded successfully!');
