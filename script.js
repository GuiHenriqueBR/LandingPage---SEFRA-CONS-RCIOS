// Landing Page JavaScript - SEFRA CORRETORA
// Simulador de Consórcio Interativo

class ConsorcioSimulator {
    constructor() {
        this.currentStep = 1;
        this.formData = {};
        this.init();
    }

    init() {
        this.bindEvents();
        this.initMobileMenu();
        this.initFormValidation();
        this.initAnalytics();
    }

    bindEvents() {
        // Modal triggers
        const modalTriggers = document.querySelectorAll('#open-simulador, #hero-simular, #cta-simular');
        modalTriggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                this.openModal();
                this.trackEvent('lead_initiated', { source: trigger.id });
            });
        });

        // Modal close
        const modalClose = document.querySelector('.modal-close');
        const modalOverlay = document.querySelector('#simulator-modal');
        
        modalClose.addEventListener('click', () => this.closeModal());
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) this.closeModal();
        });

        // Form navigation
        document.getElementById('next-step-1').addEventListener('click', () => this.nextStep());
        document.getElementById('next-step-2').addEventListener('click', () => this.nextStep());
        document.getElementById('prev-step-2').addEventListener('click', () => this.prevStep());
        document.getElementById('prev-step-3').addEventListener('click', () => this.prevStep());

        // Form submission
        document.getElementById('simulator-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitForm();
        });

        // Input formatting
        this.initInputFormatting();

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
                this.closeModal();
            }
        });
    }

    initMobileMenu() {
        const hamburger = document.querySelector('.hamburger');
        const navLinks = document.querySelector('.nav-links');
        
        if (hamburger && navLinks) {
            hamburger.addEventListener('click', () => {
                const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
                hamburger.setAttribute('aria-expanded', !isExpanded);
                navLinks.classList.toggle('active');
                hamburger.classList.toggle('active');
            });
        }
    }

    initFormValidation() {
        // Real-time validation
        const inputs = document.querySelectorAll('input[required]');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }

    initInputFormatting() {
        // Phone formatting
        const phoneInput = document.getElementById('telefone');
        if (phoneInput) {
            phoneInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length <= 11) {
                    value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
                    if (value.length < 14) {
                        value = value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
                    }
                }
                e.target.value = value;
            });
        }

        // Currency formatting
        const valorInput = document.getElementById('valor-imovel');
        if (valorInput) {
            valorInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                if (value) {
                    value = parseInt(value).toLocaleString('pt-BR');
                    e.target.value = value;
                }
            });
        }
    }

    openModal() {
        const modal = document.getElementById('simulator-modal');
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        
        // Focus management
        const firstInput = modal.querySelector('input');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 100);
        }
        
        // Trap focus
        this.trapFocus(modal);
    }

    closeModal() {
        const modal = document.getElementById('simulator-modal');
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        
        // Reset form
        this.resetForm();
    }

    trapFocus(modal) {
        const focusableElements = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        modal.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        lastElement.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        firstElement.focus();
                        e.preventDefault();
                    }
                }
            }
        });
    }

    nextStep() {
        if (this.validateCurrentStep()) {
            this.saveCurrentStepData();
            this.currentStep++;
            this.showStep(this.currentStep);
            this.trackEvent('form_step_completed', { step: this.currentStep - 1 });
        }
    }

    prevStep() {
        this.currentStep--;
        this.showStep(this.currentStep);
    }

    showStep(step) {
        const steps = document.querySelectorAll('.form-step');
        steps.forEach((stepElement, index) => {
            stepElement.classList.toggle('active', index + 1 === step);
        });

        // Update progress indicator if exists
        this.updateProgressIndicator(step);
    }

    updateProgressIndicator(step) {
        const totalSteps = 3;
        const progress = (step / totalSteps) * 100;
        
        // Create or update progress bar
        let progressBar = document.querySelector('.form-progress');
        if (!progressBar) {
            progressBar = document.createElement('div');
            progressBar.className = 'form-progress';
            progressBar.innerHTML = `
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progress}%"></div>
                </div>
                <div class="progress-text">Passo ${step} de ${totalSteps}</div>
            `;
            document.querySelector('.modal-header').appendChild(progressBar);
        } else {
            progressBar.querySelector('.progress-fill').style.width = `${progress}%`;
            progressBar.querySelector('.progress-text').textContent = `Passo ${step} de ${totalSteps}`;
        }
    }

    validateCurrentStep() {
        const currentStepElement = document.querySelector(`.form-step[data-step="${this.currentStep}"]`);
        const requiredInputs = currentStepElement.querySelectorAll('input[required]');
        let isValid = true;

        requiredInputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        return isValid;
    }

    validateField(input) {
        const value = input.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Clear previous errors
        this.clearFieldError(input);

        // Required validation
        if (input.hasAttribute('required') && !value) {
            errorMessage = 'Este campo é obrigatório';
            isValid = false;
        }

        // Specific validations
        if (value && input.type === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                errorMessage = 'Digite um e-mail válido';
                isValid = false;
            }
        }

        if (value && input.type === 'tel') {
            const phoneRegex = /^\(\d{2}\) \d{4,5}-\d{4}$/;
            if (!phoneRegex.test(value)) {
                errorMessage = 'Digite um telefone válido';
                isValid = false;
            }
        }

        if (value && input.name === 'valor_imovel') {
            const numericValue = parseInt(value.replace(/\D/g, ''));
            if (numericValue < 50000) {
                errorMessage = 'Valor mínimo: R$ 50.000';
                isValid = false;
            }
            if (numericValue > 5000000) {
                errorMessage = 'Valor máximo: R$ 5.000.000';
                isValid = false;
            }
        }

        if (!isValid) {
            this.showFieldError(input, errorMessage);
        }

        return isValid;
    }

    showFieldError(input, message) {
        input.classList.add('error');
        
        let errorElement = input.parentNode.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            errorElement.setAttribute('role', 'alert');
            input.parentNode.appendChild(errorElement);
        }
        errorElement.textContent = message;
    }

    clearFieldError(input) {
        input.classList.remove('error');
        const errorElement = input.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
    }

    saveCurrentStepData() {
        const currentStepElement = document.querySelector(`.form-step[data-step="${this.currentStep}"]`);
        const inputs = currentStepElement.querySelectorAll('input');
        
        inputs.forEach(input => {
            if (input.type === 'radio' && input.checked) {
                this.formData[input.name] = input.value;
            } else if (input.type !== 'radio') {
                this.formData[input.name] = input.value;
            }
        });
    }

    async submitForm() {
        if (!this.validateCurrentStep()) {
            return;
        }

        this.saveCurrentStepData();
        
        // Show loading state
        const submitButton = document.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Enviando...';
        submitButton.disabled = true;

        try {
            // Simulate API call
            await this.sendLeadData();
            
            // Show success step
            this.currentStep = 4;
            this.showStep(4);
            
            // Track conversion
            this.trackEvent('lead_submitted', {
                valor_imovel: this.formData.valor_imovel,
                prazo: this.formData.prazo,
                source: 'simulator'
            });

        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Erro ao enviar formulário. Tente novamente ou entre em contato pelo WhatsApp.');
        } finally {
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    }

    async sendLeadData() {
        // In a real implementation, this would send to your CRM/API
        const leadData = {
            ...this.formData,
            timestamp: new Date().toISOString(),
            source: 'landing_page',
            utm_params: this.getUTMParams()
        };

        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Lead data:', leadData);
                // Here you would typically send to your backend
                // await fetch('/api/leads', { method: 'POST', body: JSON.stringify(leadData) });
                resolve();
            }, 1000);
        });
    }

    getUTMParams() {
        const urlParams = new URLSearchParams(window.location.search);
        const utmParams = {};
        
        ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach(param => {
            if (urlParams.has(param)) {
                utmParams[param] = urlParams.get(param);
            }
        });
        
        return utmParams;
    }

    resetForm() {
        this.currentStep = 1;
        this.formData = {};
        this.showStep(1);
        
        // Clear all inputs
        const form = document.getElementById('simulator-form');
        form.reset();
        
        // Clear all errors
        const errorElements = form.querySelectorAll('.error-message');
        errorElements.forEach(error => error.remove());
        
        const errorInputs = form.querySelectorAll('.error');
        errorInputs.forEach(input => input.classList.remove('error'));
    }

    initAnalytics() {
        // Google Analytics 4 / Google Tag Manager
        if (typeof gtag !== 'undefined') {
            gtag('config', 'GA_MEASUREMENT_ID');
        }

        // Track page view
        this.trackEvent('page_view', {
            page_title: document.title,
            page_location: window.location.href
        });
    }

    trackEvent(eventName, parameters = {}) {
        // Google Analytics 4
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, parameters);
        }

        // Google Tag Manager
        if (typeof dataLayer !== 'undefined') {
            dataLayer.push({
                event: eventName,
                ...parameters
            });
        }

        // Facebook Pixel
        if (typeof fbq !== 'undefined') {
            if (eventName === 'lead_submitted') {
                fbq('track', 'Lead');
            } else if (eventName === 'lead_initiated') {
                fbq('track', 'InitiateCheckout');
            }
        }

        console.log('Event tracked:', eventName, parameters);
    }
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Intersection Observer for animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.advantage-card, .step-card, .product-card');
    animateElements.forEach(el => observer.observe(el));
}

// Lazy loading for images
function initLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }
}

// Performance optimization
function initPerformanceOptimizations() {
    // Preload critical resources
    const criticalImages = ['/assets/hero-home.webp'];
    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });

    // Defer non-critical scripts
    const scripts = document.querySelectorAll('script[data-defer]');
    scripts.forEach(script => {
        script.defer = true;
    });
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize simulator
    new ConsorcioSimulator();
    
    // Initialize other features
    initSmoothScrolling();
    initScrollAnimations();
    initLazyLoading();
    initPerformanceOptimizations();
    
    // Add loading class removal
    document.body.classList.remove('loading');
    document.body.classList.add('loaded');
});

// Service Worker registration for PWA capabilities
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Error handling
window.addEventListener('error', (e) => {
    console.error('JavaScript error:', e.error);
    // Send error to analytics if needed
});

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ConsorcioSimulator;
}