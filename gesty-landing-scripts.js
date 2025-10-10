// gesty-landing-scripts.js
// All main scripts extracted from index.html for performance and maintainability.

console.log('Gesty landing scripts loaded!');

document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM loaded, initializing nav...');

    // Detectar dispositivos móviles y capacidades
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
    const isLowEndDevice = navigator.hardwareConcurrency <= 2 || navigator.deviceMemory <= 2;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Configurar optimizaciones globales
    if (isMobile || isLowEndDevice) {
        document.documentElement.style.setProperty('--transition', 'all 0.2s ease');
        document.body.classList.add('mobile-optimized');
    }

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

    // Función optimizada para toggle del menú móvil
    function toggleMobileMenu() {
        console.log('Toggling mobile menu...');

        const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
        const newState = !isExpanded;

        console.log('Current expanded state:', isExpanded, '-> New state:', newState);

        // Usar requestAnimationFrame para optimizar cambios de DOM
        requestAnimationFrame(() => {
            // Actualizar atributos
            navToggle.setAttribute('aria-expanded', newState);
            navMobile.setAttribute('aria-hidden', !newState);

            // Controlar scroll del body de manera más eficiente
            if (newState) {
                document.body.style.overflow = 'hidden';
                document.body.style.position = 'fixed';
                document.body.style.width = '100%';
            } else {
                document.body.style.overflow = '';
                document.body.style.position = '';
                document.body.style.width = '';
            }
        });

        console.log('Menu toggled. New states:', {
            'aria-expanded': newState,
            'aria-hidden': !newState
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

    // Header scroll effect optimizado para móvil
    let lastScrollY = window.scrollY;
    let ticking = false;
    let scrollTimeout;

    function onScroll() {
        const currentScrollY = window.scrollY;
        const scrollDirection = currentScrollY > lastScrollY ? 'down' : 'up';
        const scrollDelta = Math.abs(currentScrollY - lastScrollY);

        // Solo procesar si el scroll es significativo (reduce cálculos innecesarios)
        if (scrollDelta < 5 && isMobile) {
            ticking = false;
            return;
        }

        // Efecto de scroll básico con menos cálculos
        if (currentScrollY > 50) {
            if (!header.classList.contains('scrolled')) {
                header.classList.add('scrolled');
            }
        } else {
            if (header.classList.contains('scrolled')) {
                header.classList.remove('scrolled');
            }
        }

        // Efecto de ocultación del header optimizado
        if (currentScrollY > 200 && scrollDirection === 'down' && scrollDelta > 10) {
            header.style.transform = 'translateY(-100%)';
        } else if (scrollDirection === 'up' || currentScrollY < 200) {
            header.style.transform = 'translateY(0)';
        }

        lastScrollY = currentScrollY;
        ticking = false;
    }

    // Throttle más agresivo en móvil
    window.addEventListener('scroll', function () {
        if (!ticking) {
            if (isMobile) {
                // En móvil, usar timeout más largo para reducir carga
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    window.requestAnimationFrame(onScroll);
                }, 16); // ~60fps máximo
            } else {
                window.requestAnimationFrame(onScroll);
            }
            ticking = true;
        }
    }, { passive: true });

    // Parallax scroll effects - Deshabilitado en móvil para mejor rendimiento
    function parallaxScroll() {
        // Deshabilitar parallax en móvil y dispositivos con preferencia de movimiento reducido
        if (isMobile || prefersReducedMotion) {
            parallaxTicking = false;
            return;
        }

        const scrolled = window.pageYOffset;

        // Hero parallax - Solo si está visible
        const heroElements = document.querySelectorAll('.hero-bg-element');
        if (heroElements.length > 0) {
            const heroSection = document.querySelector('.hero');
            const heroRect = heroSection?.getBoundingClientRect();

            if (heroRect && heroRect.bottom >= 0 && heroRect.top <= window.innerHeight) {
                heroElements.forEach((element, index) => {
                    const speed = 0.02 + (index * 0.01);
                    const yPos = -(scrolled * speed);
                    element.style.transform = `translateY(${yPos}px) rotate(${scrolled * 0.02}deg)`;
                });
            }
        }

        // Features parallax - Solo si está visible
        const featureElements = document.querySelectorAll('.features-bg-element');
        if (featureElements.length > 0) {
            const featuresSection = document.querySelector('.features');
            const featuresRect = featuresSection?.getBoundingClientRect();

            if (featuresRect && featuresRect.bottom >= 0 && featuresRect.top <= window.innerHeight) {
                featureElements.forEach((element, index) => {
                    const speed = 0.03 + (index * 0.01);
                    const yPos = -(scrolled * speed);
                    element.style.transform = `translateY(${yPos}px) rotate(${scrolled * 0.03}deg)`;
                });
            }
        }

        parallaxTicking = false;
    }

    let parallaxTicking = false;

    // Solo agregar parallax si no es móvil
    if (!isMobile && !prefersReducedMotion) {
        window.addEventListener('scroll', function () {
            if (!parallaxTicking) {
                window.requestAnimationFrame(parallaxScroll);
                parallaxTicking = true;
            }
        }, { passive: true });
    }

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

    // Indicador de sección activa en el nav - Optimizado
    function updateActiveNavLink() {
        // Reducir frecuencia en móvil
        if (isMobile && Math.random() > 0.3) {
            activeNavTicking = false;
            return;
        }

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
                if (!link.classList.contains('active')) {
                    link.classList.add('active');
                }
            } else {
                if (link.classList.contains('active')) {
                    link.classList.remove('active');
                }
            }
        });

        activeNavTicking = false;
    }

    // Actualizar enlaces activos en scroll con throttling más agresivo en móvil
    window.addEventListener('scroll', function () {
        if (!activeNavTicking) {
            if (isMobile) {
                // En móvil, actualizar menos frecuentemente
                setTimeout(() => {
                    window.requestAnimationFrame(updateActiveNavLink);
                }, 100);
            } else {
                window.requestAnimationFrame(updateActiveNavLink);
            }
            activeNavTicking = true;
        }
    }, { passive: true });

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
    console.log('Inicializando acordeones mejorados...');

    const accordionHeaders = document.querySelectorAll('.accordion-header');
    const accordionItems = document.querySelectorAll('.accordion-item');

    // Función para cerrar todos los acordeones excepto el actual
    function closeOtherAccordions(currentHeader) {
        accordionHeaders.forEach(header => {
            if (header !== currentHeader) {
                const contentId = header.getAttribute('aria-controls');
                const content = document.getElementById(contentId);

                if (content && header.getAttribute('aria-expanded') === 'true') {
                    header.setAttribute('aria-expanded', 'false');
                    content.setAttribute('aria-hidden', 'true');
                    content.style.maxHeight = '0';
                    content.style.paddingTop = '0';
                    content.style.paddingBottom = '0';

                    // Remover clases de estado activo
                    header.classList.remove('accordion-active');
                    header.closest('.accordion-item').classList.remove('accordion-expanded');
                }
            }
        });
    }

    // Función mejorada para animar la apertura/cierre del acordeón
    function animateAccordion(content, isOpening, header) {
        // Limpiar cualquier timeout previo
        if (content.animationTimeout) {
            clearTimeout(content.animationTimeout);
        }

        if (isOpening) {
            // Preparar para la apertura
            content.style.display = 'block';
            content.style.maxHeight = 'none';
            content.style.opacity = '0';
            content.style.transform = 'translateY(-10px)';

            // Calcular altura real del contenido
            const realHeight = content.scrollHeight;

            // Resetear para la animación
            content.style.maxHeight = '0';
            content.style.paddingTop = '0';
            content.style.paddingBottom = '0';

            // Agregar clase para activar animaciones CSS
            content.classList.add('accordion-opening');

            // Forzar reflow y comenzar animación
            requestAnimationFrame(() => {
                content.style.maxHeight = realHeight + 40 + 'px'; // +40px para padding
                content.style.paddingTop = '1.5rem';
                content.style.paddingBottom = '1.5rem';
                content.style.opacity = '1';
                content.style.transform = 'translateY(0)';
            });

            // Limpiar después de la animación
            content.animationTimeout = setTimeout(() => {
                if (content.getAttribute('aria-hidden') === 'false') {
                    content.style.maxHeight = 'none';
                    content.classList.remove('accordion-opening');
                }
            }, 400);

            // Agregar efecto de glow al header y contenedor
            header.classList.add('accordion-active');
            const accordionItem = header.closest('.accordion-item');
            accordionItem.classList.add('accordion-expanded');

            // Manejar animación especial para la primera apertura
            handleFirstOpen(accordionItem);

        } else {
            // Preparar para el cierre
            const currentHeight = content.scrollHeight;
            content.style.maxHeight = currentHeight + 'px';
            content.classList.add('accordion-closing');

            // Remover efecto de glow del header y contenedor
            header.classList.remove('accordion-active');
            header.closest('.accordion-item').classList.remove('accordion-expanded');

            requestAnimationFrame(() => {
                content.style.maxHeight = '0';
                content.style.paddingTop = '0';
                content.style.paddingBottom = '0';
                content.style.opacity = '0';
                content.style.transform = 'translateY(-15px)';
            });

            // Limpiar después del cierre
            content.animationTimeout = setTimeout(() => {
                content.style.display = 'none';
                content.classList.remove('accordion-closing');
            }, 300);
        }
    }

    accordionHeaders.forEach((header, index) => {
        // Agregar efecto de ripple al hacer click
        header.addEventListener('click', function (e) {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            const contentId = this.getAttribute('aria-controls');
            const content = document.getElementById(contentId);

            if (!content) return;

            // Crear efecto ripple
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(0, 191, 255, 0.2);
                border-radius: 50%;
                transform: scale(0);
                animation: accordionRipple 0.6s ease-out;
                pointer-events: none;
                z-index: 1;
            `;

            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);

            // Cerrar otros acordeones (comportamiento de acordeón único)
            closeOtherAccordions(this);

            // Toggle estado actual
            const newState = !isExpanded;
            this.setAttribute('aria-expanded', newState);
            content.setAttribute('aria-hidden', !newState);

            // Animar
            animateAccordion(content, newState, this);

            // Scroll suave al acordeón abierto
            if (newState) {
                setTimeout(() => {
                    const headerRect = this.getBoundingClientRect();
                    const headerTop = window.pageYOffset + headerRect.top;
                    const headerHeight = document.querySelector('.header')?.offsetHeight || 70;

                    window.scrollTo({
                        top: headerTop - headerHeight - 20,
                        behavior: 'smooth'
                    });
                }, 200);
            }

            console.log(`Acordeón ${contentId} ${newState ? 'abierto' : 'cerrado'}`);
        });

        // Soporte para navegación por teclado
        header.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                const nextHeader = accordionHeaders[index + 1] || accordionHeaders[0];
                nextHeader.focus();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                const prevHeader = accordionHeaders[index - 1] || accordionHeaders[accordionHeaders.length - 1];
                prevHeader.focus();
            }
        });

        // Mejorar accesibilidad con focus visible
        header.addEventListener('focus', function () {
            this.style.outline = '2px solid var(--primary)';
            this.style.outlineOffset = '2px';
        });

        header.addEventListener('blur', function () {
            this.style.outline = 'none';
        });
    });

    // Agregar estilos CSS para la animación de ripple
    const style = document.createElement('style');
    style.textContent = `
        @keyframes accordionRipple {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
        
        .accordion-header {
            position: relative;
            overflow: hidden;
        }
    `;
    document.head.appendChild(style);

    // Variable para rastrear si es la primera apertura
    let isFirstOpen = true;

    // Función para manejar la primera apertura especial
    function handleFirstOpen(accordionItem) {
        if (isFirstOpen) {
            accordionItem.classList.add('first-open');
            isFirstOpen = false;

            // Remover la clase después de la animación
            setTimeout(() => {
                accordionItem.classList.remove('first-open');
            }, 400);
        }
    }

    // Todos los acordeones inician cerrados
    console.log(`${accordionHeaders.length} acordeones mejorados inicializados (todos cerrados por defecto)`);
});
