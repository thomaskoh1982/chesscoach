// ======================
// Initialize EmailJS with your Public Key
// ======================
(function() {
    emailjs.init("TOhOxDy9IfuPpY1S7");
})();

// ======================
// Mobile Navigation Toggle
// ======================
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close menu when clicking links
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// ======================
// Smooth Scrolling
// ======================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// ======================
// Navbar Scroll Effect
// ======================
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'linear-gradient(135deg, rgba(102, 126, 234, 0.95) 0%, rgba(118, 75, 162, 0.95) 100%)';
        navbar.style.backdropFilter = 'blur(10px)';
    } else {
        navbar.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        navbar.style.backdropFilter = 'none';
    }
});

// ======================
// Scroll Animations
// ======================
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.benefit-card, .service-card, .about-text, .about-image').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// ======================
// Form Submission Handler
// ======================
const contactForm = document.getElementById('chess-form');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Validate required fields
        const requiredFields = contactForm.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.style.borderColor = '#ff6b6b';
                isValid = false;
            } else {
                field.style.borderColor = '';
            }
        });

        // Email validation
        const emailField = contactForm.querySelector('#parent-email');
        if (emailField && !/^\S+@\S+\.\S+$/.test(emailField.value)) {
            emailField.style.borderColor = '#ff6b6b';
            isValid = false;
            showNotification('Please enter a valid email address', 'error');
            return;
        }

        if (!isValid) {
            showNotification('Please fill all required fields', 'error');
            return;
        }

        // Submit form
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';

        try {
            // Send via EmailJS
            await emailjs.sendForm(
                'service_x02j4o9',
                'template_yswp2pd',
                contactForm
            );
            
            showNotification('Message sent successfully! Coach Thomas will contact you soon.', 'success');
            contactForm.reset();
        } catch (error) {
            console.error('EmailJS Error:', error);
            
            // Fallback to Formspree
            try {
                const formspreeResponse = await fetch('https://formspree.io/f/xblyvnpa', {
                    method: 'POST',
                    body: new FormData(contactForm),
                    headers: { 'Accept': 'application/json' }
                });
                
                if (formspreeResponse.ok) {
                    showNotification('Sent via backup method!', 'success');
                    contactForm.reset();
                } else {
                    throw new Error('Formspree submission failed');
                }
            } catch (fallbackError) {
                console.error('Formspree Error:', fallbackError);
                showNotification('Failed to send. Please try again later or contact us directly.', 'error');
            }
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });
}

// ======================
// Notification System
// ======================
function showNotification(message, type) {
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${type === 'success' ? '✓' : '⚠'}</span>
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;

    // Styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : '#F44336'};
        color: white;
        padding: 12px 24px;
        border-radius: 4px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        animation: notificationSlideIn 0.3s ease-out;
        display: flex;
        align-items: center;
        gap: 12px;
    `;

    document.body.appendChild(notification);

    // Auto-remove after 5s
    const autoRemove = setTimeout(() => {
        notification.style.animation = 'notificationSlideOut 0.3s ease-in';
        setTimeout(() => notification.remove(), 300);
    }, 5000);

    // Manual close
    notification.querySelector('.notification-close').addEventListener('click', () => {
        clearTimeout(autoRemove);
        notification.style.animation = 'notificationSlideOut 0.3s ease-in';
        setTimeout(() => notification.remove(), 300);
    });
}

// ======================
// Interactive Elements
// ======================
// Chess piece hover effects
document.querySelectorAll('.piece').forEach(piece => {
    piece.addEventListener('mouseenter', () => {
        piece.style.transform = 'scale(1.2) rotate(15deg)';
        piece.style.transition = 'transform 0.3s ease';
    });
    piece.addEventListener('mouseleave', () => {
        piece.style.transform = '';
    });
});

// Button ripple effect
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${e.clientX - rect.left - size/2}px;
            top: ${e.clientY - rect.top - size/2}px;
            background: rgba(255,255,255,0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s linear;
        `;
        
        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    });
});

// ======================
// Scroll Effects
// ======================
window.addEventListener('scroll', () => {
    // Parallax effect for floating pieces
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const heroHeight = hero?.offsetHeight;
    
    if (hero && scrolled < heroHeight) {
        document.querySelectorAll('.piece').forEach((piece, index) => {
            const speed = 0.5 + (index * 0.1);
            piece.style.transform = `translateY(${scrolled * speed}px)`;
        });
    }

    // Chess icon rotation
    const chessIcon = document.querySelector('.chess-icon');
    if (chessIcon) {
        chessIcon.style.transform = `rotate(${scrolled * 0.5}deg)`;
    }
});

// ======================
// Page Load Effects
// ======================
window.addEventListener('load', () => {
    // Fade-in animation
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);

    // Typing effect for hero title
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        let i = 0;
        const typing = setInterval(() => {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(typing);
            }
        }, 80);
    }
});

// ======================
// Animation CSS
// ======================
const style = document.createElement('style');
style.textContent = `
    @keyframes notificationSlideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes notificationSlideOut {
        to { transform: translateX(100%); opacity: 0; }
    }
    @keyframes ripple {
        to { transform: scale(4); opacity: 0; }
    }
`;
document.head.appendChild(style);