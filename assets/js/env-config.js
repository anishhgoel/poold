// Environment variables configuration
// In production, these will be injected by the Express server

// This configuration uses window.__ENV which will be populated by server.js
// if running in production, or will fallback to these values in development
const ENV = {
  SUPABASE_URL: typeof window !== 'undefined' && window.__ENV && window.__ENV.SUPABASE_URL 
    ? window.__ENV.SUPABASE_URL 
    : 'YOUR_SUPABASE_URL',  // development fallback
  SUPABASE_ANON_KEY: typeof window !== 'undefined' && window.__ENV && window.__ENV.SUPABASE_ANON_KEY 
    ? window.__ENV.SUPABASE_ANON_KEY 
    : 'YOUR_SUPABASE_ANON_KEY'  // development fallback
};

export default ENV; 