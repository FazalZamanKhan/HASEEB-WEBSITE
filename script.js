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
    const isActive = hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');

    // prevent page scroll when menu open
    if (navLinks.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
        document.body.classList.add('menu-open');
    } else {
        document.body.style.overflow = '';
        document.body.classList.remove('menu-open');
    }
});

// Close mobile nav when clicking a link
navLinksItems.forEach(item => {
    item.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.style.overflow = '';
        document.body.classList.remove('menu-open');
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
// (Duplicate mobile nav block removed - handled above)

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
        // message element below the button
        const messageEl = contactForm.querySelector('#contactMessage');
        const showMessage = (msg, type = 'success') => {
            if (!messageEl) return;
            messageEl.textContent = msg;
            messageEl.classList.remove('success', 'error');
            messageEl.classList.add(type === 'error' ? 'error' : 'success');
            messageEl.style.display = 'block';
            if (type !== 'error') setTimeout(() => { messageEl.style.display = 'none'; }, 8000);
        };

        // Simple validation: require name, message, and at least one of email or phone
        if (!data.name || !data.message || (!data.email && !data.phone)) {
            showMessage('Please provide your name, message, and at least an email or phone number.', 'error');
            return;
        }

        // Simulate form submission
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;

        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        // Real API call to backend (use relative path so it works when deployed)
        fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).then(async (resp) => {
            if (!resp.ok) throw new Error((await resp.json()).error || 'Request failed');
            showMessage('Thank you for your message! We will get back to you soon.', 'success');
            contactForm.reset();
        }).catch((err) => {
            console.error(err);
            showMessage('Failed to send message. Please try again later.', 'error');
        }).finally(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        });
    });
}

// ===== NEWSLETTER FORM =====
const newsletterForm = document.querySelector('.newsletter-form');

if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailInput = newsletterForm.querySelector('input[type="email"]');
        
        if (emailInput.value) {
            // show small inline confirmation near newsletter (reuse footer area)
            const note = document.createElement('div');
            note.className = 'form-message success';
            note.style.marginTop = '8px';
            note.textContent = 'Thank you for subscribing to our newsletter!';
            newsletterForm.appendChild(note);
            setTimeout(() => note.remove(), 5000);
            emailInput.value = '';
        }
    });
}

// ===== FOOTER MODALS (Privacy / Terms) =====
const privacyBtn = document.getElementById('privacyBtn');
const termsBtn = document.getElementById('termsBtn');
const privacyModal = document.getElementById('privacyModal');
const termsModal = document.getElementById('termsModal');

const openModal = (modal) => {
    if (!modal) return;
    modal.setAttribute('aria-hidden', 'false');
    // prevent body scroll
    document.body.style.overflow = 'hidden';
};

const closeModal = (modal) => {
    if (!modal) return;
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
};

// Attach openers
if (privacyBtn && privacyModal) {
    privacyBtn.addEventListener('click', (e) => { e.preventDefault(); openModal(privacyModal); });
}
if (termsBtn && termsModal) {
    termsBtn.addEventListener('click', (e) => { e.preventDefault(); openModal(termsModal); });
}

// Close buttons and overlay
document.querySelectorAll('.site-modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target.matches('[data-close]') || e.target.classList.contains('modal-close')) {
            closeModal(modal);
        }
    });
    // close on Escape
    document.addEventListener('keydown', (ev) => {
        if (ev.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') closeModal(modal);
    });
});

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
    // Match Get In Touch WhatsApp link and open in new tab
    whatsappBtn.href = 'https://api.whatsapp.com/send?phone=923334106520';
    whatsappBtn.target = '_blank';
    whatsappBtn.rel = 'noopener';
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
    const gap = 20; // gap between cards in pixels
    const totalCards = cards.length;

    const computeSizes = () => {
        const card = cards[0];
        const cardWidth = (card && card.offsetWidth) ? card.offsetWidth : 1;
        const containerWidth = carousel.parentElement ? carousel.parentElement.offsetWidth : carousel.offsetWidth;
        let totalWidth = 0;
        cards.forEach(c => { totalWidth += c.offsetWidth || 0; });
        const totalGap = Math.max(0, (totalCards - 1) * gap);
        totalWidth += totalGap;
        const maxTranslate = Math.max(0, totalWidth - containerWidth);
        const visibleCards = Math.max(1, Math.floor(containerWidth / (cardWidth + gap)));
        const maxIndex = Math.max(0, totalCards - visibleCards);
        return { cardWidth, containerWidth, totalWidth, maxTranslate, visibleCards, maxIndex };
    };

    const updateCarousel = () => {
        const { cardWidth, maxTranslate, maxIndex } = computeSizes();
        if (currentIndex > maxIndex) currentIndex = maxIndex;

        const moveAmount = currentIndex * (cardWidth + gap);
        const translateX = Math.min(moveAmount, maxTranslate);
        carousel.style.transform = `translateX(-${translateX}px)`;

        prevBtn.style.opacity = currentIndex === 0 ? '0.5' : '1';
        prevBtn.style.cursor = currentIndex === 0 ? 'default' : 'pointer';
        nextBtn.style.opacity = currentIndex >= maxIndex ? '0.5' : '1';
        nextBtn.style.cursor = currentIndex >= maxIndex ? 'default' : 'pointer';
    };

    prevBtn.addEventListener('click', () => {
        const { maxIndex } = computeVisibleAndMax();
        if (currentIndex > 0) {
            currentIndex = Math.max(0, currentIndex - 1);
            updateCarousel();
        }
    });

    nextBtn.addEventListener('click', () => {
        const { maxIndex } = computeSizes();
        if (currentIndex < maxIndex) {
            currentIndex = Math.min(maxIndex, currentIndex + 1);
            updateCarousel();
        } else {
            // still clamp translate in case of fractional widths
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
    const gap = 20;
    const totalCards = cards.length;

    const computeSizes = () => {
        const card = cards[0];
        const cardWidth = (card && card.offsetWidth) ? card.offsetWidth : 1;
        const containerWidth = carousel.parentElement ? carousel.parentElement.offsetWidth : carousel.offsetWidth;
        let totalWidth = 0;
        cards.forEach(c => { totalWidth += c.offsetWidth || 0; });
        const totalGap = Math.max(0, (totalCards - 1) * gap);
        totalWidth += totalGap;
        const maxTranslate = Math.max(0, totalWidth - containerWidth);
        const visibleCards = Math.max(1, Math.floor(containerWidth / (cardWidth + gap)));
        const maxIndex = Math.max(0, totalCards - visibleCards);
        return { cardWidth, containerWidth, totalWidth, maxTranslate, visibleCards, maxIndex };
    };

    const updateCarousel = () => {
        const { cardWidth, maxTranslate, maxIndex } = computeSizes();
        if (currentIndex > maxIndex) currentIndex = maxIndex;
        const moveAmount = currentIndex * (cardWidth + gap);
        const translateX = Math.min(moveAmount, maxTranslate);
        carousel.style.transform = `translateX(-${translateX}px)`;

        prevBtn.style.opacity = currentIndex === 0 ? '0.5' : '1';
        prevBtn.style.cursor = currentIndex === 0 ? 'default' : 'pointer';
        nextBtn.style.opacity = currentIndex >= maxIndex ? '0.5' : '1';
        nextBtn.style.cursor = currentIndex >= maxIndex ? 'default' : 'pointer';
    };

    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex = Math.max(0, currentIndex - 1);
            updateCarousel();
        }
    });

    nextBtn.addEventListener('click', () => {
        const { maxIndex } = computeSizes();
        if (currentIndex < maxIndex) {
            currentIndex = Math.min(maxIndex, currentIndex + 1);
            updateCarousel();
        } else {
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
    const gap = 20;
    const totalCards = cards.length;

    const computeSizes = () => {
        const card = cards[0];
        const cardWidth = (card && card.offsetWidth) ? card.offsetWidth : 1;
        const containerWidth = carousel.parentElement ? carousel.parentElement.offsetWidth : carousel.offsetWidth;
        let totalWidth = 0;
        cards.forEach(c => { totalWidth += c.offsetWidth || 0; });
        const totalGap = Math.max(0, (totalCards - 1) * gap);
        totalWidth += totalGap;
        const maxTranslate = Math.max(0, totalWidth - containerWidth);
        const visibleCards = Math.max(1, Math.floor(containerWidth / (cardWidth + gap)));
        const maxIndex = Math.max(0, totalCards - visibleCards);
        return { cardWidth, containerWidth, totalWidth, maxTranslate, visibleCards, maxIndex };
    };

    const updateCarousel = () => {
        const { cardWidth, maxTranslate, maxIndex } = computeSizes();
        if (currentIndex > maxIndex) currentIndex = maxIndex;
        const moveAmount = currentIndex * (cardWidth + gap);
        const translateX = Math.min(moveAmount, maxTranslate);
        carousel.style.transform = `translateX(-${translateX}px)`;

        prevBtn.style.opacity = currentIndex === 0 ? '0.5' : '1';
        prevBtn.style.cursor = currentIndex === 0 ? 'default' : 'pointer';
        nextBtn.style.opacity = currentIndex >= maxIndex ? '0.5' : '1';
        nextBtn.style.cursor = currentIndex >= maxIndex ? 'default' : 'pointer';
    };

    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex = Math.max(0, currentIndex - 1);
            updateCarousel();
        }
    });

    nextBtn.addEventListener('click', () => {
        const { maxIndex } = computeSizes();
        if (currentIndex < maxIndex) {
            currentIndex = Math.min(maxIndex, currentIndex + 1);
            updateCarousel();
        } else {
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

// Ensure all images have native lazy-loading where supported
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('img').forEach(img => {
        if (!img.hasAttribute('loading')) {
            img.setAttribute('loading', 'lazy');
        }
    });
});

// Ensure mobile nav is closed when resizing to desktop widths
window.addEventListener('resize', () => {
    try {
        const hamburgerEl = document.querySelector('.hamburger');
        const navLinksEl = document.querySelector('.nav-links');
        if (window.innerWidth > 992) {
            if (hamburgerEl) hamburgerEl.classList.remove('active');
            if (navLinksEl) navLinksEl.classList.remove('active');
            // restore body overflow if a modal/menu was open
            document.body.style.overflow = '';
        }
    } catch (e) {
        // fail silently
        console.warn('Resize handler error', e);
    }
});
