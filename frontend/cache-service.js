const cacheService = {
    CACHE_VERSION: '1.0',
    
    CACHE_DURATIONS: {
        SHORT: 5 * 60 * 1000,
        LONG: 30 * 24 * 60 * 60 * 1000,
    },
    
    LONG_CACHE_KEYS: ['doctors', 'hospitals', 'pharmacies', 'blood_donors'],

    get(key) {
        try {
            const isLongCache = this.LONG_CACHE_KEYS.includes(key);
            const storage = isLongCache ? localStorage : sessionStorage;
            const cached = storage.getItem(`cache_${key}`);
            
            if (!cached) return null;
            
            const { data, timestamp, version } = JSON.parse(cached);
            
            if (version !== this.CACHE_VERSION) {
                storage.removeItem(`cache_${key}`);
                console.log(`🔄 Cache version mismatch for ${key}, cleared`);
                return null;
            }
            
            const now = Date.now();
            const maxAge = isLongCache ? this.CACHE_DURATIONS.LONG : this.CACHE_DURATIONS.SHORT;
            
            if (now - timestamp > maxAge) {
                storage.removeItem(`cache_${key}`);
                console.log(`⏰ Cache expired for ${key}`);
                return null;
            }
            
            const age = Math.floor((now - timestamp) / 1000);
            const ageDisplay = age > 86400 
                ? `${Math.floor(age / 86400)}d ${Math.floor((age % 86400) / 3600)}h`
                : age > 3600 
                    ? `${Math.floor(age / 3600)}h ${Math.floor((age % 3600) / 60)}m`
                    : `${Math.floor(age / 60)}m ${age % 60}s`;
            
            console.log(`✅ Cache hit: ${key} (age: ${ageDisplay}, storage: ${isLongCache ? 'localStorage' : 'sessionStorage'})`);
            return data;
        } catch (error) {
            console.error(`Error reading cache for ${key}:`, error);
            return null;
        }
    },

    set(key, data) {
        const isLongCache = this.LONG_CACHE_KEYS.includes(key);
        const storage = isLongCache ? localStorage : sessionStorage;
        
        const cacheData = {
            data,
            timestamp: Date.now(),
            version: this.CACHE_VERSION
        };
        
        try {
            storage.setItem(`cache_${key}`, JSON.stringify(cacheData));
            console.log(`💾 Cached: ${key} (storage: ${isLongCache ? 'localStorage (30 days)' : 'sessionStorage (5 min)'})`);
        } catch (error) {
            console.error(`Error setting cache for ${key}:`, error);
            if (error.name === 'QuotaExceededError') {
                console.warn('⚠️ Storage quota exceeded, clearing old caches...');
                this.clearOldestCaches();
                try {
                    storage.setItem(`cache_${key}`, JSON.stringify(cacheData));
                    console.log(`💾 Cached after cleanup: ${key}`);
                } catch (retryError) {
                    console.error('Failed to cache after cleanup:', retryError);
                }
            }
        }
    },

    invalidate(key) {
        try {
            const isLongCache = this.LONG_CACHE_KEYS.includes(key);
            const storage = isLongCache ? localStorage : sessionStorage;
            storage.removeItem(`cache_${key}`);
            console.log(`🗑️ Cache invalidated: ${key}`);
        } catch (error) {
            console.error(`Error invalidating cache for ${key}:`, error);
        }
    },

    invalidateAll() {
        try {
            [sessionStorage, localStorage].forEach(storage => {
                const keys = Object.keys(storage);
                keys.forEach(key => {
                    if (key.startsWith('cache_')) {
                        storage.removeItem(key);
                    }
                });
            });
            console.log('🗑️ All cache cleared');
        } catch (error) {
            console.error('Error clearing all cache:', error);
        }
    },

    getCacheAge(key) {
        try {
            const isLongCache = this.LONG_CACHE_KEYS.includes(key);
            const storage = isLongCache ? localStorage : sessionStorage;
            const cached = storage.getItem(`cache_${key}`);
            
            if (!cached) return null;
            
            const { timestamp } = JSON.parse(cached);
            return Math.floor((Date.now() - timestamp) / 1000);
        } catch (error) {
            return null;
        }
    },

    getCacheInfo(key) {
        try {
            const isLongCache = this.LONG_CACHE_KEYS.includes(key);
            const storage = isLongCache ? localStorage : sessionStorage;
            const cached = storage.getItem(`cache_${key}`);
            
            if (!cached) return null;
            
            const { timestamp, version } = JSON.parse(cached);
            const age = Math.floor((Date.now() - timestamp) / 1000);
            const maxAge = isLongCache ? this.CACHE_DURATIONS.LONG / 1000 : this.CACHE_DURATIONS.SHORT / 1000;
            
            return {
                key,
                age,
                maxAge,
                version,
                storage: isLongCache ? 'localStorage' : 'sessionStorage',
                expiresIn: maxAge - age,
                lastUpdated: new Date(timestamp).toLocaleString()
            };
        } catch (error) {
            return null;
        }
    },

    clearOldestCaches() {
        try {
            const caches = [];
            [localStorage, sessionStorage].forEach(storage => {
                Object.keys(storage).forEach(key => {
                    if (key.startsWith('cache_')) {
                        try {
                            const { timestamp } = JSON.parse(storage.getItem(key));
                            caches.push({ key, timestamp, storage });
                        } catch (e) {}
                    }
                });
            });
            
            caches.sort((a, b) => a.timestamp - b.timestamp);
            
            const toRemove = Math.ceil(caches.length * 0.3);
            for (let i = 0; i < toRemove; i++) {
                caches[i].storage.removeItem(caches[i].key);
            }
            
            console.log(`🧹 Cleared ${toRemove} oldest caches`);
        } catch (error) {
            console.error('Error clearing oldest caches:', error);
        }
    },

    forceRefresh(key) {
        this.invalidate(key);
        console.log(`🔄 Force refresh triggered for: ${key}`);
    },

    getAllCacheInfo() {
        const info = {};
        this.LONG_CACHE_KEYS.forEach(key => {
            const cacheInfo = this.getCacheInfo(key);
            if (cacheInfo) {
                info[key] = cacheInfo;
            }
        });
        return info;
    }
};

const debounceTimers = {};

function debounce(func, delay, key) {
    return function(...args) {
        if (debounceTimers[key]) {
            clearTimeout(debounceTimers[key]);
        }
        
        debounceTimers[key] = setTimeout(() => {
            func.apply(this, args);
            delete debounceTimers[key];
        }, delay);
    };
}

window.cacheService = cacheService;
window.debounce = debounce;
