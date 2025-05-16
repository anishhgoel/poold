# Stack - Split Subscriptions with Friends

Stack is a group wallet application that lets friends automatically split and pay for shared subscriptions like Netflix or Spotify. Everyone links their own card, and the app pulls each person's share, then pays using a virtual group card.

## Features (Implemented)

### 🧱 Authentication & Registration
- Sign up with email/password or Google
- Username, profile picture, minimal KYC (name, DOB)
- Supabase Authentication integration
- User data stored in Supabase PostgreSQL database

## Supabase Setup Instructions

To get the authentication system working, you need to set up Supabase (completely free for most projects):

1. Go to [Supabase](https://supabase.com/) and create a free account
2. Create a new project
3. Get your Supabase URL and anon key from the project settings
4. Enable Google authentication (if needed):
   - Go to Authentication > Providers > Google
   - Enable Google auth
   - Set up Google OAuth credentials in Google Cloud Console
   - Add the credentials to Supabase
5. Create a `profiles` table in Supabase:
   - Go to Database > Tables > Create new table
   - Set the table name to `profiles`
   - Add the following columns:
     - `id` (UUID, primary key, references auth.users.id)
     - `username` (varchar)
     - `date_of_birth` (timestamp)
     - `created_at` (timestamp)
     - `updated_at` (timestamp)
6. Configure your environment variables:
   - Open `assets/js/env-config.js`
   - Replace the placeholder values with your actual Supabase credentials:

```javascript
const ENV = {
  SUPABASE_URL: 'your_supabase_url',
  SUPABASE_ANON_KEY: 'your_supabase_anon_key'
};
```

> **Security Note**: For production, you should use a proper `.env` file or environment variables to store sensitive credentials instead of in JavaScript files. The Express server (`server.js`) is configured to work with a `.env` file for deployment.

## Running the App

You can run the app in two ways:

### Simple Development Server

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

Then open your browser to `http://localhost:8080`

### Production-Ready Server (with Env Support)

```bash
# Install dependencies
npm install

# Create a .env file with your credentials
echo "SUPABASE_URL=your_supabase_url" > .env
echo "SUPABASE_ANON_KEY=your_supabase_anon_key" >> .env

# Run the Express server
npm start
```

Then open your browser to `http://localhost:8080`

## Project Structure

```
stack/
│
├── assets/
│   ├── css/
│   │   ├── styles.css
│   │   └── dashboard.css
│   ├── js/
│   │   ├── auth.js
│   │   ├── supabase-config.js
│   │   └── env-config.js
│   └── img/
│       ├── logo.svg
│       └── logo.png
│
├── index.html
├── login.html
├── register.html
├── dashboard.html
├── server.js
└── .gitignore
```

## Technologies

- HTML5, CSS3, JavaScript
- Supabase (Auth & Database)
- Express (Server)
- ES Modules

## Why Supabase?

- **Free Tier**: Generous free tier suitable for production apps
- **Open Source**: Fully open-source and can be self-hosted
- **PostgreSQL**: Built on PostgreSQL, a powerful relational database
- **Auth**: Complete authentication system with social logins
- **Real-time**: Real-time capabilities for live updates
- **Storage**: File storage built-in
- **Edge Functions**: Serverless functions for backend logic

## Planned Features

### 💳 Card Management
- Link debit/credit cards
- Create virtual cards for subscriptions
- Set spending limits and controls

### 👥 Group Creation & Management
- Create groups for different subscriptions
- Invite friends via email, phone, or username
- Manage members and permissions

### 📊 Expense Tracking & Splitting
- Automatic expense tracking
- Fair splitting between group members
- Payment history and analytics

### 🔄 Subscription Management
- Add subscription details (cost, billing date)
- Reminders for renewals
- Cancel/pause subscription options

## License

MIT 