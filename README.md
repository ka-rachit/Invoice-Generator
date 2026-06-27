<h1 align="center">
  <br>
  🧾 Invoice Generator
  <br>
</h1>

<p align="center">
  A modern, AI-powered invoice management platform built for freelancers and small businesses.
</p>

<p align="center">
  <a href="#-live-demo">Live Demo</a> •
  <a href="#-features">Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-project-structure">Project Structure</a> •
</p>

---

## 🌐 Live Demo

> 🚀 **[Visit Here →](#)**  
> *https://invoice-generator-krachit.vercel.app/*

---

## ✨ Features

### 📄 Invoice Management
- **Create Invoices** — Generate professional invoices with line items, tax, due dates, payment terms, and notes
- **View All Invoices** — Filter, sort, and search through your invoice history at a glance
- **Invoice Detail View** — Inspect every field of an individual invoice in a clean, readable layout
- **Status Tracking** — Mark invoices as **Paid** or **Unpaid** with a single click
- **Print / Download** — Browser-native print support for PDF export

### 🤖 AI-Powered Features
- **Smart Invoice Parsing** — Paste raw text or a description and let AI extract client details and line items automatically
- **AI Reminder Emails** — Generate personalized, professional payment reminder emails for overdue clients with one click
- **WhatsApp Reminders** — Get concise, emoji-friendly reminder messages optimized for WhatsApp
- **Dashboard Insights** — Receive 2–3 actionable financial insights based on your invoice data (e.g., revenue trends, outstanding amounts, collection suggestions)

### 📊 Dashboard
- Overview of total invoices, paid vs unpaid counts
- Revenue and outstanding amount summaries
- Recent invoice activity
- AI-generated smart insights

### 🔐 Authentication & Security
- User registration & login with **JWT-based authentication**
- **Bcrypt** password hashing
- Protected routes — only authenticated users can access the app
- Per-user data isolation (each user sees only their own invoices)

### 👤 Profile Management
- View and update business details used in invoice "Bill From" fields
- Persistent across all created invoices

---

## 🛠 Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| [React](https://react.dev/) | 19 | UI framework |
| [Vite](https://vitejs.dev/) | 7 | Build tool & dev server |
| [React Router DOM](https://reactrouter.com/) | 7 | Client-side routing |
| [TailwindCSS](https://tailwindcss.com/) | 4 | Utility-first styling |
| [Lucide React](https://lucide.dev/) | Latest | Icon library |
| [Axios](https://axios-http.com/) | 1.x | HTTP client |
| [React Hot Toast](https://react-hot-toast.com/) | 2.x | Toast notifications |
| [Moment.js](https://momentjs.com/) | 2.x | Date formatting |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| [Node.js](https://nodejs.org/) | LTS | Runtime environment |
| [Express](https://expressjs.com/) | 5 | Web framework |
| [MongoDB](https://www.mongodb.com/) + [Mongoose](https://mongoosejs.com/) | 8 | Database & ODM |
| [JSON Web Token](https://jwt.io/) | 9 | Authentication tokens |
| [Bcryptjs](https://github.com/dcodeIO/bcrypt.js) | 3 | Password hashing |
| [Google Gemini AI](https://ai.google.dev/) | 2.5 Flash | AI features |
| [Multer](https://github.com/expressjs/multer) | 2 | File upload handling |
| [CORS](https://github.com/expressjs/cors) | 2 | Cross-origin support |
| [dotenv](https://github.com/motdotla/dotenv) | 17 | Environment variables |

---

## 📁 Project Structure

```
Invoice Generator/
├── backend/                    # Express REST API
│   ├── config/
│   │   └── db.js               # MongoDB connection
│   ├── controllers/
│   │   ├── aiController.js     # Google Gemini AI logic
│   │   ├── authController.js   # Register / Login
│   │   └── invoiceController.js# CRUD operations
│   ├── middlewares/
│   │   └── authMiddleware.js   # JWT verification
│   ├── models/
│   │   ├── Invoice.js          # Invoice schema
│   │   └── User.js             # User schema
│   ├── routes/
│   │   ├── aiRoutes.js
│   │   ├── authRoutes.js
│   │   └── invoiceRoutes.js
│   ├── .env                    # Environment variables (not committed)
│   └── server.js               # Entry point
│
└── frontend/                   # React + Vite SPA
    ├── public/
    └── src/
        ├── components/
        │   ├── AIInsightsCard.jsx
        │   ├── auth/            # ProtectedRoute guard
        │   ├── invoices/        # Invoice-related components
        │   ├── landing/         # Landing page components
        │   ├── layout/          # DashboardLayout, Navbar, Sidebar
        │   └── ui/              # Shared UI primitives
        ├── context/
        │   └── AuthContext.jsx  # Global auth state
        ├── pages/
        │   ├── Auth/            # Login & Signup pages
        │   ├── Dashboard/       # Dashboard overview
        │   ├── Invoices/        # All, Create, and Detail views
        │   ├── LandingPage/     # Public marketing page
        │   └── Profile/         # User profile
        ├── utils/               # Helper functions
        ├── App.jsx              # Route definitions
        └── main.jsx             # React entry point
```

---

<p align="center">
  If you found this project helpful, please consider giving it a ⭐ on GitHub!
</p>
