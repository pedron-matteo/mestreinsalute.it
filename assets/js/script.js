document.addEventListener('DOMContentLoaded', () => {
    // Load Components
    const basePath = window.location.pathname.includes('/') ? './' : '';
    // Must wait for components to load before initializing i18n completely

    // Promise wrapper for loading
    const loadHeader = loadComponent('header-placeholder', basePath + 'components/navbar.html');
    const loadFooter = loadComponent('footer-placeholder', basePath + 'components/footer.html');

    Promise.all([loadHeader, loadFooter]).then(() => {
        initNavbar();
        initI18n(); // Initialize translation after DOM elements are ready
    });

    // Sticky Header Logic
    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        if (header) {
            header.classList.toggle('scrolled', window.scrollY > 50);
        }
    });

    // Scroll Animations
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                entry.target.style.opacity = 1;
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.card, .intro-text, .intro-image, .service-item, .info-box, .step').forEach(el => {
        el.style.opacity = 0; // Set initial opacity
        observer.observe(el);
    });

    // Smooth Scrolling for anchor links (if exist in loaded content)
    document.addEventListener('click', function (e) {
        const anchor = e.target.closest('a');
        if (anchor && anchor.getAttribute('href') && anchor.getAttribute('href').startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });

    initHomeVideo();
});

function loadComponent(elementId, htmlPath) {
    return new Promise((resolve) => {
        const element = document.getElementById(elementId);
        if (!element) {
            resolve();
            return;
        }

        fetch(htmlPath)
            .then(response => {
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                return response.text();
            })
            .then(data => {
                element.innerHTML = data;
                resolve();
            })
            .catch(error => {
                console.error('Error loading component:', error);
                resolve(); // Resolve anyway to not block
            });
    });
}

function initNavbar() {
    // Mobile Menu Toggle logic
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = hamburger.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
        });
    }

    // Active Link Logic
    const currentPath = window.location.pathname.split('/').pop();
    const links = document.querySelectorAll('.nav-links a');

    links.forEach(link => {
        // Remove active from HTML template
        link.classList.remove('active');

        const linkPath = link.getAttribute('href');

        // Robust matching
        if (linkPath === currentPath) {
            link.classList.add('active');
        }
        // Handle root/index.html cases
        else if ((!currentPath || currentPath === '' || currentPath === 'index.html') && linkPath === 'index.html') {
            // Only if we are truly on index or root
            if (window.location.pathname.endsWith('/') || window.location.pathname.endsWith('index.html')) {
                link.classList.add('active');
            }
        }
    });

    // Language Switcher Logic in Navbar
    const langBtns = document.querySelectorAll('.lang-btn');
    langBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const lang = btn.getAttribute('data-lang');
            setLanguage(lang);
        });
    });
}

function initI18n() {
    // Check localStorage or default to 'it'
    const savedLang = localStorage.getItem('siteLang') || 'it';
    setLanguage(savedLang);
}

function setLanguage(lang) {
    if (!translations[lang]) return;

    // Save preference
    localStorage.setItem('siteLang', lang);

    // Update Text Content
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const translatedText = translations[lang][key];
        if (translatedText) {
            // Allow controlled inline HTML (e.g., links inside translated paragraphs).
            if (translatedText.includes('<') && translatedText.includes('>')) {
                element.innerHTML = translatedText;
            } else {
                element.textContent = translatedText;
            }
        }
    });

    // Update Placeholders
    document.querySelectorAll('[data-i18n-ph]').forEach(element => {
        const key = element.getAttribute('data-i18n-ph');
        if (translations[lang][key]) {
            element.placeholder = translations[lang][key];
        }
    });

    // Update Active Button State
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });

    document.dispatchEvent(new CustomEvent('i18n:changed', { detail: { lang } }));
}

function initHomeVideo() {
    const video = document.getElementById('homeIntroVideo');
    if (!video) return;

    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.controls = true;

    setTimeout(() => {
        video.play().catch(() => {
            // Autoplay can be blocked by browser policies.
        });
    }, 3000);
}
