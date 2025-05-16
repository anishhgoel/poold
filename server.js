// Basic Express server without problematic route patterns
const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;

// Get environment variables with fallbacks
const supabaseUrl = process.env.SUPABASE_URL || 'http://localhost:54321';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'example-anon-key';

console.log('Environment variables loaded');

// Simple environment variables endpoint
app.get('/env-config.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.send(`
    window.__ENV = {
      SUPABASE_URL: "${supabaseUrl}",
      SUPABASE_ANON_KEY: "${supabaseAnonKey}"
    };
  `);
});

// Serve static files
app.use(express.static('./'));

// Handle all routes for SPA
app.get('*', (req, res) => {
  res.sendFile('index.html', { root: './' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}); 