// Service Worker for SEFRA CORRETORA Landing Page
// PWA capabilities and performance optimization

const CACHE_NAME = 'sefra-corretora-v1';
const STATIC_CACHE = 'sefra-static-v1';
const DYNAMIC_CACHE = 'sefra-dynamic-v1';

// Assets to cache on install
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/styles.css',
    '/script.js',
    '/analytics.js',
    '/assets/hero-home.webp',
    '/assets/logo-sefra.svg'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
    console.log('Service Worker installing...');
    
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then((cache) => {
                console.log('Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => {
                console.log('Static assets cached successfully');
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('Error caching static assets:', error);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('Service Worker activating...');
    
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                            console.log('Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('Service Worker activated');
                return self.clients.claim();
            })
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }
    
    // Skip external requests (analytics, etc.)
    if (url.origin !== location.origin) {
        return;
    }
    
    event.respondWith(
        caches.match(request)
            .then((cachedResponse) => {
                // Return cached version if available
                if (cachedResponse) {
                    console.log('Serving from cache:', request.url);
                    return cachedResponse;
                }
                
                // Fetch from network and cache
                return fetch(request)
                    .then((networkResponse) => {
                        // Don't cache non-successful responses
                        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                            return networkResponse;
                        }
                        
                        // Clone the response
                        const responseToCache = networkResponse.clone();
                        
                        // Cache dynamic content
                        caches.open(DYNAMIC_CACHE)
                            .then((cache) => {
                                cache.put(request, responseToCache);
                            });
                        
                        console.log('Serving from network and caching:', request.url);
                        return networkResponse;
                    })
                    .catch((error) => {
                        console.error('Network request failed:', error);
                        
                        // Return offline page for navigation requests
                        if (request.destination === 'document') {
                            return caches.match('/index.html');
                        }
                        
                        throw error;
                    });
            })
    );
});

// Background sync for form submissions
self.addEventListener('sync', (event) => {
    if (event.tag === 'background-sync-lead') {
        console.log('Background sync triggered for lead submission');
        
        event.waitUntil(
            // Retry failed lead submissions
            retryFailedSubmissions()
        );
    }
});

// Push notifications (optional)
self.addEventListener('push', (event) => {
    if (event.data) {
        const data = event.data.json();
        const options = {
            body: data.body,
            icon: '/assets/icon-192x192.png',
            badge: '/assets/badge-72x72.png',
            vibrate: [100, 50, 100],
            data: {
                dateOfArrival: Date.now(),
                primaryKey: data.primaryKey
            },
            actions: [
                {
                    action: 'explore',
                    title: 'Ver Simulação',
                    icon: '/assets/checkmark.png'
                },
                {
                    action: 'close',
                    title: 'Fechar',
                    icon: '/assets/xmark.png'
                }
            ]
        };
        
        event.waitUntil(
            self.registration.showNotification(data.title, options)
        );
    }
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// Helper function to retry failed submissions
async function retryFailedSubmissions() {
    try {
        // Get failed submissions from IndexedDB
        const failedSubmissions = await getFailedSubmissions();
        
        for (const submission of failedSubmissions) {
            try {
                const response = await fetch('/api/leads', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(submission.data)
                });
                
                if (response.ok) {
                    // Remove from failed submissions
                    await removeFailedSubmission(submission.id);
                    console.log('Successfully retried submission:', submission.id);
                }
            } catch (error) {
                console.error('Failed to retry submission:', error);
            }
        }
    } catch (error) {
        console.error('Error in background sync:', error);
    }
}

// IndexedDB helpers (simplified)
async function getFailedSubmissions() {
    // Implementation would use IndexedDB
    return [];
}

async function removeFailedSubmission(id) {
    // Implementation would use IndexedDB
    console.log('Removing failed submission:', id);
}

// Performance monitoring
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'PERFORMANCE_METRICS') {
        const metrics = event.data.metrics;
        
        // Log performance metrics
        console.log('Performance metrics:', metrics);
        
        // Send to analytics if needed
        if (metrics.lcp > 2500) {
            console.warn('LCP is above threshold:', metrics.lcp);
        }
    }
});

// Cache management
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'CLEAR_CACHE') {
        event.waitUntil(
            caches.keys().then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        return caches.delete(cacheName);
                    })
                );
            }).then(() => {
                event.ports[0].postMessage({ success: true });
            })
        );
    }
});

console.log('Service Worker loaded successfully');