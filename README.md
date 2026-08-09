# 📚 Smart Book System

A full-stack library management system with JWT authentication, role-based access control, borrow/wishlist workflow, and an online book reader.

---

## ✨ Features

- 🔐 **JWT Authentication** — Secure registration and login with bcrypt password hashing
- 👑 **Role-Based Access Control** — Regular users vs. admin-only management routes
- 📖 **Book Gallery** — Browse books with live stock availability tags
- 🔍 **Book Search** — Filter books by title or author directly from the homepage
- 📋 **Borrow State Machine** — `interested → pending → borrowed → returned` with stock validation
- ❤️ **Wishlist** — Mark books as interested, then submit checkout requests
- 📖 **Online Reader** — Read borrowed book content directly in the browser
- 👥 **Admin Console** — Manage books, users, and borrow records
- 📦 **12 Demo Books** — Pre-seeded with content for immediate testing

---

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/try/download/community) (local) or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) (free cloud)

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and set your MongoDB connection string:

```env
MONGO_URI=mongodb://127.0.0.1:27017/smart_book_system
JWT_SECRET=your_super_secret_key_change_me
```

### 3. Seed the Database

```bash
npm run seed
```

This creates:
- ✅ 12 demo books with chapter content
- ✅ Default admin account: `admin@smartbook.com` / `admin123`

### 4. Start the Server

```bash
npm start          # production mode
npm run dev        # development mode with auto-reload
```

### 5. Open the App

```
http://localhost:5000
```

---

## 🔑 Default Admin Account

| Email | Password |
|-------|----------|
| `admin@smartbook.com` | `admin123` |

> ⚠️ **Change the admin password before going live!**

---

## 🗂️ Project Structure

```
smart-book-system/
├── config/
│   └── db.js               # MongoDB connection
├── controllers/
│   ├── authController.js    # Register, login, profile
│   ├── bookController.js    # Book CRUD + stock + reader access
│   ├── borrowController.js  # Borrow state machine
│   └── userController.js    # Admin user management
├── middleware/
│   ├── authMiddleware.js    # JWT verification
│   ├── roleMiddleware.js    # Admin role guard
│   └── errorHandler.js      # Unified error handling
├── models/
│   ├── User.js              # User schema (hashed passwords)
│   ├── Book.js              # Book schema (stock + content)
│   └── BorrowRecord.js      # Borrow state machine schema
├── routes/
│   ├── authRoutes.js        # /api/auth/*
│   ├── bookRoutes.js        # /api/books/*
│   ├── borrowRoutes.js      # /api/borrow/*
│   └── userRoutes.js        # /api/users/*
├── public/
│   ├── css/style.css        # Styles
│   ├── js/                  # Frontend logic
│   ├── index.html           # Book gallery
│   ├── login.html           # Login/Register
│   ├── member.html          # Member center
│   ├── admin.html           # Admin console
│   └── reader.html          # Book reader
├── docs/
│   ├── TEAM_GUIDE.md        # Team member setup guide
│   └── ADMIN_GUIDE.md       # Admin/deployment guide
├── seed.js                  # Database seeding
├── Dockerfile               # Docker deployment
├── docker-compose.yml       # Docker Compose config
├── app.js                   # Entry point
├── .env.example             # Environment template
└── package.json
```

---

## 🔌 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | Public | Register a new user |
| POST | `/api/auth/login` | Public | Login, returns JWT |
| GET | `/api/auth/me` | JWT | Get logged-in user's profile |
| GET | `/api/books` | Public | List all books |
| GET | `/api/books/search` | Public | Search books by title or author |
| GET | `/api/books/:id` | Public | Get a single book |
| GET | `/api/books/:id/read` | JWT + borrowed | Get book content to read |
| POST | `/api/books` | Admin | Create a book |
| PUT | `/api/books/:id` | Admin | Update book/stock |
| DELETE | `/api/books/:id` | Admin | Delete a book |
| POST | `/api/borrow/interest` | JWT | Add to wishlist |
| POST | `/api/borrow/checkout` | JWT | Submit checkout request |
| PUT | `/api/borrow/status/:id` | JWT (owner/admin) | Update borrow status |
| GET | `/api/borrow/my-records` | JWT | Get user's borrow history |
| GET | `/api/borrow/all` | Admin | Get all borrow records |
| GET | `/api/users` | Admin | List all users |
| POST | `/api/users` | Admin | Create a user |
| DELETE | `/api/users/:id` | Admin | Delete a user |
| GET | `/api/health` | Public | Health check |

---

## 📖 Reading a Book (How It Works)

1. User clicks **Interested** on a book → added to wishlist (`interested`)
2. User clicks **Checkout** → request submitted (`pending`)
3. User or admin confirms the borrow → status becomes (`borrowed`), stock decrements
4. On the **My Account** page, a **📖 Read** button appears
5. Clicking it opens the reader page with the book's content
6. After reading, clicking **Return Book** → status becomes (`returned`), stock increments

---

## 🧑‍💻 Team Guides

- **[New Team Member Onboarding Guide](docs/NEW_TEAM_MEMBER_GUIDE.md)** — Start from scratch: register on GitHub, create your project folder in VS Code, build the DB file, and push to the development branch
- **[Team Member Guide](docs/TEAM_GUIDE.md)** — Setup VSCode, Node.js, MongoDB, Git workflow, and individual module code review assignments
- **[Admin Guide](docs/ADMIN_GUIDE.md)** — Upload to GitHub, deploy for free (Render/Railway/Vercel/Oracle Cloud), backups, and security

---

## ☁️ Free Deployment (Summary)

| Component | Recommended Free Option |
|-----------|----------------------|
| **App hosting** | [Render](https://render.com/) — free web service, auto-deploy from GitHub |
| **Database** | [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) — free M0 cluster |
| **Alternative** | [Railway](https://railway.app/), [Vercel](https://vercel.com/), [Oracle Cloud Free Tier](https://www.oracle.com/cloud/free/) |

Full deployment steps → **[Admin Guide](docs/ADMIN_GUIDE.md)**

---

## 🛠️ Troubleshooting

**"MongoDB Connected" never appears**
→ MongoDB is not running. Start it locally: `mongod --dbpath ~/data/db`

**"failed to fetch" when registering**
→ Likely MongoDB is not running. See above.

**Port 5000 already in use**
→ `pkill -f "node app.js"` (macOS) or change `PORT` in `.env`

See [Team Guide → Troubleshooting](docs/TEAM_GUIDE.md#8-common-troubleshooting) for more.

---

## 📄 License

MIT — Free to use for educational projects.