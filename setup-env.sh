#!/bin/bash

# This script sets up environment variables for production deployment
# Usage: ./setup-env.sh <supabase_url> <supabase_anon_key>

if [ "$#" -ne 2 ]; then
    echo "Usage: ./setup-env.sh <supabase_url> <supabase_anon_key>"
    exit 1
fi

echo "Setting up environment variables..."

# Create .env file
cat > .env << EOL
NODE_ENV=production
PORT=8080
SUPABASE_URL=$1
SUPABASE_ANON_KEY=$2
EOL

echo ".env file created with your credentials"
echo "To run the application in production mode:"
echo "npm start" 