// config/cache.js
const NodeCache = require('node-cache');

// Initialize cache with 1 hour TTL
const cache = new NodeCache({ 
  stdTTL: 3600, // Time to live in seconds
  checkperiod: 120 // Check for expired keys every 2 minutes
});

const cacheMiddleware = (req, res, next) => {
  // Only cache GET requests
  if (req.method !== 'GET') return next();

  const key = req.originalUrl;
  const cachedResponse = cache.get(key);

  if (cachedResponse) {
    console.log(`Cache hit for ${key}`);
    return res.json(cachedResponse);
  }

  // Store the original json function
  const originalJson = res.json;
  res.json = function(data) {
    // Save the response in cache before sending
    cache.set(key, data);
    console.log(`Cached data for ${key}`);
    
    // Restore original json function
    res.json = originalJson;
    return res.json(data);
  };

  next();
};

// Function to clear cache - use this after POST/PUT/DELETE operations
const clearCache = (key) => {
  if (key) {
    cache.del(key);
    console.log(`Cleared cache for ${key}`);
  } else {
    cache.flushAll();
    console.log('Cleared all cache');
  }
};

module.exports = { cacheMiddleware, clearCache };