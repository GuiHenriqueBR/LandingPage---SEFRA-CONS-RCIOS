// Analytics Configuration for SEFRA CORRETORA Landing Page
// Google Analytics 4, Google Tag Manager, Facebook Pixel

// Google Analytics 4 Configuration
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

// Replace with your actual GA4 Measurement ID
gtag('config', 'G-XXXXXXXXXX', {
    page_title: document.title,
    page_location: window.location.href,
    custom_map: {
        'custom_parameter_1': 'valor_imovel',
        'custom_parameter_2': 'prazo_consorcio'
    }
});

// Enhanced Ecommerce Events for Lead Tracking
function trackLeadEvent(eventName, parameters = {}) {
    gtag('event', eventName, {
        event_category: 'Lead Generation',
        event_label: 'Consórcio Imobiliário',
        value: parameters.valor_imovel ? parseFloat(parameters.valor_imovel.replace(/\D/g, '')) / 100 : 0,
        currency: 'BRL',
        ...parameters
    });
}

// Facebook Pixel Configuration
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');

// Replace with your actual Facebook Pixel ID
fbq('init', 'YOUR_PIXEL_ID');
fbq('track', 'PageView');

// Custom Events for Lead Tracking
function trackFacebookEvent(eventName, parameters = {}) {
    fbq('track', eventName, {
        content_name: 'Consórcio Imobiliário',
        content_category: 'Financial Services',
        value: parameters.valor_imovel ? parseFloat(parameters.valor_imovel.replace(/\D/g, '')) / 100 : 0,
        currency: 'BRL',
        ...parameters
    });
}

// Google Tag Manager Configuration
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-XXXXXXX');

// Conversion Tracking Functions
const ConversionTracker = {
    // Track form initiation
    trackFormInitiation: function(source = 'unknown') {
        trackLeadEvent('form_initiation', { source });
        trackFacebookEvent('InitiateCheckout', { source });
        
        // GTM event
        dataLayer.push({
            event: 'form_initiation',
            form_type: 'consorcio_simulator',
            source: source
        });
    },

    // Track form step completion
    trackStepCompletion: function(step, data = {}) {
        trackLeadEvent('form_step_completion', { 
            step, 
            ...data 
        });
        
        dataLayer.push({
            event: 'form_step_completion',
            step: step,
            form_type: 'consorcio_simulator'
        });
    },

    // Track successful lead submission
    trackLeadSubmission: function(leadData) {
        const conversionValue = leadData.valor_imovel ? 
            parseFloat(leadData.valor_imovel.replace(/\D/g, '')) / 100 : 0;

        // GA4 Enhanced Ecommerce
        trackLeadEvent('purchase', {
            transaction_id: 'lead_' + Date.now(),
            value: conversionValue,
            currency: 'BRL',
            items: [{
                item_id: 'consorcio_imobiliario',
                item_name: 'Consórcio Imobiliário',
                category: 'Financial Services',
                quantity: 1,
                price: conversionValue
            }]
        });

        // Facebook Conversion API
        trackFacebookEvent('Lead', {
            content_name: 'Consórcio Imobiliário',
            content_category: 'Financial Services',
            value: conversionValue,
            currency: 'BRL'
        });

        // GTM event
        dataLayer.push({
            event: 'lead_submission',
            form_type: 'consorcio_simulator',
            lead_value: conversionValue,
            lead_data: leadData
        });
    },

    // Track WhatsApp clicks
    trackWhatsAppClick: function(source = 'unknown') {
        trackLeadEvent('whatsapp_click', { source });
        trackFacebookEvent('Contact', { source });
        
        dataLayer.push({
            event: 'whatsapp_click',
            source: source
        });
    },

    // Track CTA clicks
    trackCTAClick: function(ctaId, ctaText) {
        trackLeadEvent('cta_click', { 
            cta_id: ctaId,
            cta_text: ctaText 
        });
        
        dataLayer.push({
            event: 'cta_click',
            cta_id: ctaId,
            cta_text: ctaText
        });
    }
};

// UTM Parameter Tracking
function getUTMParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    const utmParams = {};
    
    const utmKeys = [
        'utm_source', 'utm_medium', 'utm_campaign', 
        'utm_term', 'utm_content', 'gclid', 'fbclid'
    ];
    
    utmKeys.forEach(key => {
        if (urlParams.has(key)) {
            utmParams[key] = urlParams.get(key);
        }
    });
    
    return utmParams;
}

// Store UTM parameters in session storage
function storeUTMParameters() {
    const utmParams = getUTMParameters();
    if (Object.keys(utmParams).length > 0) {
        sessionStorage.setItem('utm_params', JSON.stringify(utmParams));
    }
}

// Get stored UTM parameters
function getStoredUTMParameters() {
    const stored = sessionStorage.getItem('utm_params');
    return stored ? JSON.parse(stored) : {};
}

// Initialize UTM tracking
storeUTMParameters();

// Export for use in other scripts
window.ConversionTracker = ConversionTracker;
window.getStoredUTMParameters = getStoredUTMParameters;

// Auto-track page performance
if ('performance' in window) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            if (perfData) {
                gtag('event', 'page_performance', {
                    page_load_time: Math.round(perfData.loadEventEnd - perfData.fetchStart),
                    dom_content_loaded: Math.round(perfData.domContentLoadedEventEnd - perfData.fetchStart)
                });
            }
        }, 1000);
    });
}