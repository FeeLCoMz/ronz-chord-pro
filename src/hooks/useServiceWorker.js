import { useEffect, useState } from 'react';

export const useServiceWorker = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [swReady, setSwReady] = useState(false);
  const [swWaiting, setSwWaiting] = useState(false);

  useEffect(() => {
    // Register Service Worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-worker.js')
        .then(registration => {
          console.log('[SW] Registered successfully:', registration);
          setSwReady(true);

          // Check for updates periodically
          setInterval(() => {
            registration.update();
          }, 60000); // Check every minute

          // Listen for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setSwWaiting(true);
              }
            });
          });
        })
        .catch(error => {
          console.error('[SW] Registration failed:', error);
        });
    }

    // Handle online/offline status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const skipWaiting = () => {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
      setSwWaiting(false);
    }
  };

  const clearCache = () => {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      return new Promise((resolve) => {
        const channel = new MessageChannel();
        channel.port1.onmessage = (event) => {
          if (event.data.cleared) {
            resolve(true);
          }
        };
        navigator.serviceWorker.controller.postMessage(
          { type: 'CLEAR_CACHE' },
          [channel.port2]
        );
      });
    }
    return Promise.resolve(false);
  };

  const requestSync = (tag) => {
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
      navigator.serviceWorker.ready
        .then(registration => {
          return registration.sync.register(tag);
        })
        .then(() => {
          console.log('[SW] Sync registered for tag:', tag);
        })
        .catch(error => {
          console.error('[SW] Sync registration failed:', error);
        });
    }
  };

  return {
    isOnline,
    swReady,
    swWaiting,
    skipWaiting,
    clearCache,
    requestSync
  };
};
