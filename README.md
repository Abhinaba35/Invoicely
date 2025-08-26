# Invoicely

A full-stack AI-powered invoice and expense management application.

## Features
- User authentication (signup, login)
- Create, edit, delete invoices and expenses
- Send payment emails with Razorpay payment links
- Export invoices to CSV
- AI-powered financial analysis (Gemini API)
- Dashboard with summary and charts
- Responsive, modern UI (React + Tailwind)

## Tech Stack
- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** Node.js, Express, MongoDB (Mongoose)
- **AI:** Google Gemini API
- **Payments:** Razorpay
- **Email:** Nodemailer, Gmail SMTP
- **Cloud Storage:** Cloudinary

## Folder Structure
```
client/         # React frontend
  src/
    components/   # Reusable UI components
    pages/        # App pages (Invoice, Expense, Dashboard, etc.)
    contexts/     # React context providers
    services/     # API service layer
    utils/        # Helper functions
    axios/        # Axios instance config
  public/         # Static assets
  index.html      # Main HTML file
  vite.config.js  # Vite config

server/         # Node.js backend
  api/v1/        # API routes and controllers
    auth/        # Auth routes/controllers
    invoices/    # Invoice routes/controllers
    expenses/    # Expense routes/controllers
    dashboard/   # Dashboard routes/controllers
    analysis/    # AI analysis (Gemini)
    middleware.js# Auth middleware
  models/        # Mongoose schemas
  utils/         # Helper functions (email, JWT, etc.)
  config/        # Config files (db, cloudinary)
  uploads/       # Uploaded files
  app.js         # Express app entry
  .env           # Environment variables
```

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB Atlas account
- Razorpay account (for payment links)
- Google Gemini API key
- Cloudinary account

### Setup
1. **Clone the repo:**
   ```bash
   git clone https://github.com/Abhinaba35/Invoicely.git
   cd Invoicely
   ```
2. **Install dependencies:**
   ```bash
   cd server && npm install
   cd ../client && npm install
   ```
3. **Configure environment variables:**
   - Copy `.env.example` to `.env` in `server/` and fill in your secrets (see sample below).

   ```env
   JWT_SECRET=your_jwt_secret
   MONGO_DB_URL=your_mongodb_url
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   GEMINI_API_KEY=your_gemini_api_key
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_SECRET=your_cloudinary_secret
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_email_password
   FRONTEND_URL=http://localhost:5173
   PORT=3000
   ```

4. **Start the backend:**
   ```bash
   cd server
   npm start
   ```
5. **Start the frontend:**
   ```bash
   cd client
   npm run dev
   ```
6. **Access the app:**
   - Frontend: [http://localhost:5173](http://localhost:5173)
   - Backend API: [http://localhost:3000/api/v1](http://localhost:3000/api/v1)

## Usage
- Sign up and log in
- Create invoices and expenses
- Send payment emails to clients
- Download invoices as CSV
- View dashboard and run AI financial analysis

## Environment Variables
See `.env.example` for all required variables.

## License
MIT

## Credits
- Built by Abhinaba Das
- AI powered by Google Gemini
- Payments via Razorpay
- UI inspired by Tailwind UI
