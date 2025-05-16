// Wait for Supabase to be available
let supabaseClient = null;

function initializeSupabase() {
    if (window.supabase && window.__ENV) {
        supabaseClient = window.supabase.createClient(
            window.__ENV.SUPABASE_URL,
            window.__ENV.SUPABASE_ANON_KEY
        );
    }
}

// Check if Supabase is already loaded
if (window.supabase) {
    initializeSupabase();
} else {
    // Wait for Supabase to load
    window.addEventListener('load', initializeSupabase);
}

export { supabaseClient }; 