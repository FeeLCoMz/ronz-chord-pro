# Service Worker Implementation Guide

RoNz Chord Pro now includes a Service Worker for offline support and improved performance.

## Features

### 1. **Offline Caching**

- App shell caching (HTML, CSS, JS)
- API response caching for offline access
- Fallback responses when offline

### 2. **Cache Strategies**

- **App Resources**: Cache first, fallback to network
- **API Calls**: Network first, fallback to cache
- **Documents**: Cache first for reliability

### 3. **Automatic Updates**

- Checks for updates every 60 seconds
- Notifies user when update is available
- Seamless background sync

### 4. **Background Sync**

- Queues requests when offline
- Syncs when connection is restored
- Automatic song/setlist sync

## Usage

### In App.jsx

```jsx
import { useServiceWorker } from "./hooks";

function App() {
  const { isOnline, swReady, swWaiting, skipWaiting } = useServiceWorker();

  return (
    <div>
      {/* Show online status */}
      {!isOnline && (
        <div className="offline-banner">📡 Offline - using cached data</div>
      )}

      {/* Show update available */}
      {swWaiting && (
        <div className="update-banner">
          🔄 Update available
          <button onClick={skipWaiting}>Update Now</button>
        </div>
      )}

      {/* Rest of app */}
    </div>
  );
}
```

### Hook API

#### `useServiceWorker()`

**Returns:**

```typescript
{
  isOnline: boolean;        // Is device online
  swReady: boolean;         // Service Worker registered
  swWaiting: boolean;       // Update waiting to install
  skipWaiting: () => void;  // Apply update immediately
  clearCache: () => Promise<boolean>;  // Clear all cached data
  requestSync: (tag: string) => void;  // Request background sync
}
```

**Properties:**

- `isOnline` - Tracks online/offline status
- `swReady` - True when SW is registered
- `swWaiting` - True when update is available
- `skipWaiting()` - Install pending update
- `clearCache()` - Clear all cached data
- `requestSync(tag)` - Trigger background sync

## How It Works

### Installation

1. SW is registered in `main.jsx` on app load
2. Essential app resources are cached
3. User can work offline immediately

### Offline Usage

1. Network requests automatically use cached responses
2. User sees cached API data
3. Pending changes stored locally

### Going Online

1. App detects online status
2. Automatic sync of pending changes
3. Fetches latest data from server
4. Updates local cache

### Cache Updates

1. SW checks for updates periodically
2. New version installed in background
3. User notified if update is ready
4. Can skip waiting or refresh to apply

## Cache Storage

Cached data includes:

- App shell (HTML, CSS, JS)
- Recent API responses
- Song data (if previously loaded)
- Setlist data (if previously loaded)

**Note**: localStorage is always used for user data, SW caching is supplementary.

## Browser Support

- Chrome 40+
- Firefox 44+
- Safari 11.1+
- Edge 15+
- Opera 27+

Service Workers are not required for functionality - app will work fine without them.

## Configuration

To customize SW behavior, edit `/public/service-worker.js`:

```javascript
// Add URLs to cache
const URLS_TO_CACHE = [
  "/",
  "/index.html",
  // Add more URLs here
];

// Adjust cache name for versioning
const CACHE_NAME = "ronz-chord-pro-v1";

// Modify cache strategies in fetch handler
```

## Troubleshooting

### SW not registering

- Check browser console for errors
- Ensure `/public/service-worker.js` exists
- Check HTTPS requirement (localhost allowed)

### Cache issues

- Clear browser cache (DevTools > Application > Clear storage)
- Or use `clearCache()` method in app
- Check Cache size limits

### Sync not working

- Enable background sync in browser settings
- Check browser support for Background Sync API
- Verify `/api` endpoints are accessible

## Benefits

✅ **Offline Support** - App works without internet  
✅ **Faster Loads** - Cached assets load instantly  
✅ **Better UX** - Seamless online/offline transition  
✅ **Auto Sync** - Data syncs automatically when online  
✅ **Update Notifications** - Users know when updates are available

## Next Steps

1. Monitor cache hit rates
2. Optimize cache strategies
3. Implement cache size limits
4. Add cache versioning strategy
5. Consider IndexedDB for large datasets
