# Stack - Split Subscriptions with Friends

Stack is a group wallet application that lets friends automatically split and pay for shared subscriptions like Netflix or Spotify. Everyone links their own card, and the app pulls each person's share, then pays using a virtual group card.

## Features (Planned)

### 🧱 Authentication & Registration
- Sign up with email/password or Google
- Username, profile picture, minimal KYC (name, DOB)

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

## Setup & Installation

Currently, this project is in the development phase and includes only the login and registration UI.

1. Clone this repository
2. Open `index.html` in your browser

## Project Structure

```
stack/
│
├── assets/
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   └── main.js
│   └── img/
│       ├── logo.svg
│       ├── logo.png
│       └── login-img.jpg
│
├── index.html
└── login.html
```

## Technologies

- HTML5
- CSS3
- Vanilla JavaScript

## Future Implementation

Future implementations will include:
- Backend API with Node.js/Express
- Database integration with MongoDB
- Payment processing with Stripe
- Mobile app with React Native

## License

MIT 