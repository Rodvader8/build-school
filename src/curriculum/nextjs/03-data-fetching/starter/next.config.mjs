/** @type {import('next').NextConfig} */
const nextConfig = {
  // Next 16's caching model: pages are static by default, and "use cache" opts data into the cache.
  cacheComponents: true,
  partialPrefetching: true,
  // Stops next dev writing instruction files for AI tools into your project folder.
  agentRules: false,
};

export default nextConfig;
