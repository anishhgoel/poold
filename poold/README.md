# Poold - Split Subscriptions with Friends

Poold is a group wallet that lets friends automatically split and pay for shared subscriptions like Netflix or Spotify. Everyone links their own card, and the app pulls each person's share, then pays using a virtual group card.

## Features

- **User Authentication:** Sign up with email/password or social auth
- **Group Creation:** Create groups to split subscriptions with friends
- **Card Linking:** Securely link payment methods to cover shares
- **Shared Wallet:** Automatically pull funds and pay subscriptions
- **Social Aspect:** Share subscriptions and see what friends are using

## Tech Stack

- Next.js 15
- TypeScript
- Supabase (Auth, Database)
- TailwindCSS
- ShadCN UI
- Stripe (for payments)

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm
- Supabase account
- Stripe account

### Installation

1. Clone this repository
```bash
git clone https://github.com/yourusername/poold.git
cd poold
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env.local` file in the root directory with the following variables:
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

4. Set up your Supabase project
   - Create a new project in Supabase
   - Run the SQL from `supabase/schema.sql` in the Supabase SQL editor to set up the database schema
   - Configure authentication providers in the Supabase dashboard

5. Run the development server
```bash
npm run dev
```

## Project Structure

- `src/app` - Next.js app router pages
- `src/components` - React components
- `src/lib` - Utility functions and shared logic
- `supabase` - Supabase configuration and schema

## Authentication Flow

1. User signs up/signs in via the Auth UI
2. After successful authentication, they're redirected to `/auth/callback`
3. The callback exchanges the code for a session and redirects to the dashboard
4. Middleware protects routes requiring authentication

## Deployment

Deploy the project using Vercel or your preferred hosting provider.

```bash
npm run build
```

## License

This project is licensed under the MIT License.
