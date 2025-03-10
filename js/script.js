document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('nav');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            nav.classList.toggle('active');
            this.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInsideNav = nav.contains(event.target);
        const isClickOnMenuBtn = mobileMenuBtn.contains(event.target);
        
        if (!isClickInsideNav && !isClickOnMenuBtn && nav.classList.contains('active')) {
            nav.classList.remove('active');
        }
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
                
                // Close mobile menu after clicking a link
                if (nav.classList.contains('active')) {
                    nav.classList.remove('active');
                }
            }
        });
    });
    
    // Add active class to nav links based on current page
    const currentLocation = window.location.pathname;
    const navLinks = document.querySelectorAll('nav ul li a');
    
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        if (currentLocation.includes(linkPath) && linkPath !== '') {
            link.classList.add('active');
        } else if (currentLocation === '/' && linkPath === 'index.html') {
            link.classList.add('active');
        }
    });

    // Header scroll effect
    const header = document.querySelector('header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Animation on scroll
    const animateElements = document.querySelectorAll('.service-card, .gallery-item, .about-text p, .section-header, .contact-card, .hours-table, .hours-info');
    
    // Observer options
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    // Create observer
    const observer = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Add initial hidden class and observe elements
    animateElements.forEach(el => {
        el.classList.add('hidden-element');
        observer.observe(el);
    });

    // Set animation order for grid items
    const setAnimationOrder = (selector) => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((el, index) => {
            el.style.setProperty('--animation-order', index);
        });
    };
    
    setAnimationOrder('.service-card');
    setAnimationOrder('.gallery-item');
    setAnimationOrder('.contact-card');

    // Check restaurant status
    checkRestaurantStatus();
    
    // Back to top button functionality
    const backToTopButton = document.getElementById('backToTop');
    if (backToTopButton) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        });
        
        backToTopButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Parallax effect for hero section
    const parallaxBg = document.getElementById('parallax-bg');
    if (parallaxBg) {
        window.addEventListener('scroll', function() {
            const scrollPosition = window.pageYOffset;
            parallaxBg.style.transform = `scale(1.1) translateY(${scrollPosition * 0.4}px)`;
        });
    }

    // Gestion du slider de la page d'accueil
    const heroSlides = document.querySelectorAll('.hero-slide');
    if (heroSlides.length > 0) {
        let currentSlide = 0;
        
        // Fonction pour changer de slide
        function changeSlide() {
            // Retirer la classe active de toutes les slides
            heroSlides.forEach(slide => {
                slide.classList.remove('active');
            });
            
            // Ajouter la classe active à la slide courante
            heroSlides[currentSlide].classList.add('active');
            
            // Passer à la slide suivante
            currentSlide = (currentSlide + 1) % heroSlides.length;
        }
        
        // Changer de slide toutes les 5 secondes
        setInterval(changeSlide, 5000);
        
        // Ajouter la classe in-view aux éléments de la hero section
        setTimeout(() => {
            document.querySelector('.hero-content h2').classList.add('in-view');
            document.querySelector('.hero-content p').classList.add('in-view');
            document.querySelector('.hero-buttons').classList.add('in-view');
        }, 500);
    }
    
    // Animation des éléments au scroll
    const animateElementsOnScroll = document.querySelectorAll('.animate-on-scroll');
    
    function checkScroll() {
        animateElementsOnScroll.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight * 0.8) {
                element.classList.add('in-view');
            }
        });
    }
    
    // Vérifier au chargement de la page
    checkScroll();
    
    // Vérifier au scroll
    window.addEventListener('scroll', checkScroll);
});

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    .hidden-element {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease-out, transform 0.6s ease-out;
    }
    
    .animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    .service-card.animate-in, .gallery-item.animate-in, .contact-card.animate-in {
        transition-delay: calc(var(--animation-order, 0) * 0.1s);
    }
`;
document.head.appendChild(style);

// Restaurant status checker
function checkRestaurantStatus() {
    const statusElement = document.getElementById('restaurant-status');
    if (!statusElement) return;
    
    // Nettoyer le contenu existant
    statusElement.innerHTML = '';
    
    // Créer l'élément pour l'information de statut actuel
    const statusInfo = document.createElement('div');
    statusInfo.className = 'status-info';
    
    const statusDot = document.createElement('span');
    statusDot.className = 'status-dot';
    
    const statusText = document.createElement('span');
    statusText.className = 'status-text';
    
    statusInfo.appendChild(statusDot);
    statusInfo.appendChild(statusText);
    statusElement.appendChild(statusInfo);
    
    const now = new Date();
    const day = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const currentTime = hours * 60 + minutes;
    
    // Restaurant hours (in minutes from midnight)
    const openingHours = {
        0: { open: [[12*60, 14*60], [19*60, 22*60]] }, // Sunday
        1: { open: [[12*60, 14*60], [19*60, 22*60]] }, // Monday
        2: { open: [] }, // Tuesday - closed
        3: { open: [] }, // Wednesday - closed
        4: { open: [[12*60, 14*60], [19*60, 22*60]] }, // Thursday
        5: { open: [[12*60, 14*60], [19*60, 22*60]] }, // Friday
        6: { open: [[12*60, 14*60], [19*60, 22*60]] }  // Saturday
    };
    
    // Check if restaurant is open
    let isOpen = false;
    let closingSoon = false;
    let nextOpeningInfo = null;
    
    // Check current day's hours
    if (openingHours[day].open.length > 0) {
        for (const [open, close] of openingHours[day].open) {
            if (currentTime >= open && currentTime < close) {
                isOpen = true;
                // Check if closing within 30 minutes
                if (close - currentTime <= 30) {
                    closingSoon = true;
                }
                break;
            }
        }
    }
    
    // Update status display
    if (isOpen) {
        if (closingSoon) {
            statusDot.className = 'status-dot closing-soon';
            statusText.textContent = 'Fermeture bientôt';
        } else {
            statusDot.className = 'status-dot open';
            statusText.textContent = 'Ouvert maintenant';
        }
    } else {
        statusDot.className = 'status-dot closed';
        statusText.textContent = 'Fermé actuellement';
        
        // Find next opening time
        nextOpeningInfo = findNextOpeningTime(day, currentTime, openingHours);
    }
    
    // Add next opening information if closed
    if (!isOpen && nextOpeningInfo) {
        const nextOpeningElement = document.createElement('div');
        nextOpeningElement.className = 'next-opening';
        nextOpeningElement.textContent = nextOpeningInfo;
        statusElement.appendChild(nextOpeningElement);
    }
}

// Helper function to find next opening time
function findNextOpeningTime(currentDay, currentTime, openingHours) {
    // Check if there's a later opening time today
    if (openingHours[currentDay].open.length > 0) {
        for (const [open, close] of openingHours[currentDay].open) {
            if (open > currentTime) {
                const openHour = Math.floor(open / 60);
                const openMin = open % 60;
                return `Ouverture aujourd'hui à ${openHour}h${openMin === 0 ? '00' : openMin}`;
            }
        }
    }
    
    // Check future days
    let nextDay = currentDay;
    let daysChecked = 0;
    
    while (daysChecked < 7) {
        nextDay = (nextDay + 1) % 7;
        daysChecked++;
        
        if (openingHours[nextDay].open.length > 0) {
            const dayNames = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
            const [open, close] = openingHours[nextDay].open[0];
            const openHour = Math.floor(open / 60);
            const openMin = open % 60;
            
            if (daysChecked === 1) {
                return `Ouverture demain à ${openHour}h${openMin === 0 ? '00' : openMin}`;
            } else {
                return `Ouverture ${dayNames[nextDay]} à ${openHour}h${openMin === 0 ? '00' : openMin}`;
            }
        }
    }
    
    return null;
}

// Check status every minute
setInterval(checkRestaurantStatus, 60000);