// gesty-landing-scripts.js
// All main scripts extracted from index.html for performance and maintainability.

console.log('Gesty landing scripts loaded!');

document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM loaded, initializing nav...');

    const navToggle = document.querySelector('.nav-toggle');
    const navMobile = document.querySelector('.nav-mobile');
    const navMobileLinks = document.querySelectorAll('.nav-mobile-link');
    const header = document.querySelector('.header');

    // Verificar que los elementos existen
    console.log('Nav elements found:', {
        navToggle: !!navToggle,
        navMobile: !!navMobile,
        navMobileLinks: navMobileLinks.length,
        header: !!header
    });

    if (!navToggle) {
        console.error('Nav toggle button not found!');
        return;
    }

    if (!navMobile) {
        console.error('Nav mobile menu not found!');
        return;
    }

    // Función para toggle del menú móvil
    function toggleMobileMenu() {
        console.log('Toggling mobile menu...');

        const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
        const newState = !isExpanded;

        console.log('Current expanded state:', isExpanded, '-> New state:', newState);

        // Actualizar atributos
        navToggle.setAttribute('aria-expanded', newState);
        navMobile.setAttribute('aria-hidden', !newState);

        // Agregar clase para animaciones
        if (newState) {
            navMobile.classList.add('opening');
            setTimeout(() => navMobile.classList.remove('opening'), 400);
        }

        // Controlar scroll del body
        document.body.style.overflow = newState ? 'hidden' : 'auto';

        console.log('Menu toggled. New states:', {
            'aria-expanded': navToggle.getAttribute('aria-expanded'),
            'aria-hidden': navMobile.getAttribute('aria-hidden'),
            'body overflow': document.body.style.overflow
        });
    }

    // Event listener para el botón toggle
    navToggle.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('Nav toggle button clicked!');
        toggleMobileMenu();
    });

    // Cerrar menú al hacer click en un enlace
    navMobileLinks.forEach(link => {
        link.addEventListener('click', function () {
            console.log('Mobile nav link clicked, closing menu...');
            navToggle.setAttribute('aria-expanded', 'false');
            navMobile.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = 'auto';
        });
    });

    // Cerrar menú al hacer click fuera
    document.addEventListener('click', function (e) {
        if (!navToggle.contains(e.target) && !navMobile.contains(e.target)) {
            navToggle.setAttribute('aria-expanded', 'false');
            navMobile.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = 'auto';
        }
    });

    // Cerrar menú con tecla Escape
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            navToggle.setAttribute('aria-expanded', 'false');
            navMobile.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = 'auto';
        }
    });

    // Smooth scroll para los enlaces de navegación
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                e.preventDefault();
                const headerHeight = header.offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                // Cerrar menú móvil si está abierto
                navToggle.setAttribute('aria-expanded', 'false');
                navMobile.setAttribute('aria-hidden', 'true');
                document.body.style.overflow = 'auto';
            }
        });
    });

    // Header scroll effect mejorado (throttled with requestAnimationFrame)
    let lastScrollY = window.scrollY;
    let ticking = false;

    function onScroll() {
        const currentScrollY = window.scrollY;
        const scrollDirection = currentScrollY > lastScrollY ? 'down' : 'up';

        // Efecto de scroll básico
        if (currentScrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Efecto de ocultación del header al hacer scroll hacia abajo
        if (currentScrollY > 200 && scrollDirection === 'down') {
            header.style.transform = 'translateY(-100%)';
        } else if (scrollDirection === 'up' || currentScrollY < 200) {
            header.style.transform = 'translateY(0)';
        }

        lastScrollY = currentScrollY;
        ticking = false;
    }

    window.addEventListener('scroll', function () {
        if (!ticking) {
            window.requestAnimationFrame(onScroll);
            ticking = true;
        }
    });

    // Parallax scroll effects
    function parallaxScroll() {
        const scrolled = window.pageYOffset;

        // Hero parallax
        const heroElements = document.querySelectorAll('.hero-bg-element');
        heroElements.forEach((element, index) => {
            const rect = element.getBoundingClientRect();
            if (rect.bottom >= 0 && rect.top <= window.innerHeight) {
                const speed = 0.02 + (index * 0.01);
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px) rotate(${scrolled * 0.02}deg)`;
            }
        });

        // Features parallax
        const featureElements = document.querySelectorAll('.features-bg-element');
        featureElements.forEach((element, index) => {
            const rect = element.getBoundingClientRect();
            if (rect.bottom >= 0 && rect.top <= window.innerHeight) {
                const speed = 0.03 + (index * 0.01);
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px) rotate(${scrolled * 0.03}deg)`;
            }
        });

        // Pricing parallax
        const pricingElements = document.querySelectorAll('.pricing-bg-element');
        pricingElements.forEach((element, index) => {
            const rect = element.getBoundingClientRect();
            if (rect.bottom >= 0 && rect.top <= window.innerHeight) {
                const speed = 0.04 + (index * 0.015);
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px) rotate(${scrolled * 0.04}deg)`;
            }
        });

        parallaxTicking = false;
    }

    let parallaxTicking = false;
    window.addEventListener('scroll', function () {
        if (!parallaxTicking) {
            window.requestAnimationFrame(parallaxScroll);
            parallaxTicking = true;
        }
    });

    // Keyboard accessibility
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });

    document.addEventListener('mousedown', function () {
        document.body.classList.remove('keyboard-navigation');
    });

    // Efectos adicionales para el nav menu

    // Variable para throttling de scroll
    let activeNavTicking = false;

    // Efecto de hover mejorado para los enlaces de navegación
    const navLinksAll = document.querySelectorAll('.nav-link, .nav-mobile-link');
    navLinksAll.forEach(link => {
        link.addEventListener('mouseenter', function () {
            this.style.setProperty('--hover-scale', '1.05');
        });

        link.addEventListener('mouseleave', function () {
            this.style.setProperty('--hover-scale', '1');
        });
    });

    // Indicador de sección activa en el nav
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link[href^="#"], .nav-mobile-link[href^="#"]');

        let currentSection = '';
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= 100 && rect.bottom >= 100) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            const href = link.getAttribute('href').substring(1);
            if (href === currentSection) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        activeNavTicking = false;
    }

    // Actualizar enlaces activos en scroll
    window.addEventListener('scroll', function () {
        if (!activeNavTicking) {
            window.requestAnimationFrame(updateActiveNavLink);
            activeNavTicking = true;
        }
    });

    // Efecto de ripple en el botón hamburguesa
    function addRippleEffect(e) {
        const ripple = document.createElement('span');
        const rect = navToggle.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(1, 135, 95, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;

        navToggle.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    }

    // Agregar el efecto ripple al click del toggle
    navToggle.addEventListener('click', addRippleEffect);

    console.log('Nav initialization complete!');
});

// Fallback: Si por alguna razón el DOMContentLoaded no funciona
if (document.readyState === 'loading') {
    console.log('Document still loading, waiting for DOMContentLoaded...');
} else {
    console.log('Document already loaded, initializing immediately...');
    // El documento ya está cargado, ejecutar inmediatamente
    setTimeout(() => {
        const navToggle = document.querySelector('.nav-toggle');
        const navMobile = document.querySelector('.nav-mobile');

        if (navToggle && navMobile && !navToggle.hasAttribute('data-initialized')) {
            console.log('Initializing nav fallback...');
            navToggle.setAttribute('data-initialized', 'true');

            navToggle.addEventListener('click', function (e) {
                e.preventDefault();
                console.log('Fallback nav toggle clicked!');

                const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
                navToggle.setAttribute('aria-expanded', !isExpanded);
                navMobile.setAttribute('aria-hidden', isExpanded);
                document.body.style.overflow = isExpanded ? 'auto' : 'hidden';
            });
        }
    }, 100);
}


document.addEventListener('DOMContentLoaded', function () {
    console.log('Inicializando acordeones...');

    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', function () {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            const contentId = this.getAttribute('aria-controls');
            const content = document.getElementById(contentId);

            if (!content) return;

            // Toggle estado
            this.setAttribute('aria-expanded', !isExpanded);
            content.setAttribute('aria-hidden', isExpanded);

            // Animación suave
            if (!isExpanded) {
                content.style.maxHeight = content.scrollHeight + 'px';
            } else {
                content.style.maxHeight = '0';
            }

            console.log(`Acordeón ${contentId} ${!isExpanded ? 'abierto' : 'cerrado'}`);
        });
    });

    // Todos los acordeones inician cerrados
    console.log(`${accordionHeaders.length} acordeones inicializados (todos cerrados por defecto)`);
});
