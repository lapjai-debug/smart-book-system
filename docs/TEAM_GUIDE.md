# 📘 Smart Book System — Team Member Guide

This guide walks each team member through setting up their local development environment, working with Git/GitHub, and reviewing their assigned code modules.

---

## 📋 Table of Contents

1. [Local Development Environment Setup](#1-local-development-environment-setup)
2. [Visual Studio Code Setup](#2-visual-studio-code-setup)
3. [MongoDB Setup](#3-mongodb-setup)
4. [Getting the Project on Your Machine](#4-getting-the-project-on-your-machine)
5. [Running the Project Locally](#5-running-the-project-locally)
6. [Git & GitHub Workflow](#6-git--github-workflow)
7. [Team Member Assignments & Code Review](#7-team-member-assignments--code-review)
8. [Common Troubleshooting](#8-common-troubleshooting)

---

## 1. Local Development Environment Setup

### 1.1 Install Node.js (Required)

Node.js is the runtime that runs Express.js. You need **Node.js v18 or newer**.

**macOS (Homebrew):**
```bash
brew install node
node --version   # Should show v18.x or higher
npm --version    # Should show v9.x or higher
```

**Windows:**
- Download the LTS installer from: https://nodejs.org/
- Run the `.msi` file and follow the installer (click "Next" all the way)
- Open Command Prompt or PowerShell and verify:
```bash
node --version
npm --version
```

### 1.2 Install MongoDB (Required for local testing)

**macOS (Homebrew):**
```bash
brew tap mongodb/brew
brew trust mongodb/brew
brew install mongodb-community

# Create the data directory
mkdir -p ~/data/db

# Start MongoDB
mongod --dbpath ~/data/db
```

**Windows:**
- Download from: https://www.mongodb.com/try/download/community
- Choose **MongoDB Community Server** → Windows → MSI
- During installation, check **"Install MongoDB as a Service"** (this auto-starts MongoDB)
- The default data path is `C:\Program Files\MongoDB\Server\<version>\data`

**Verify MongoDB is running:**
```bash
mongosh --version  # should show version info
```

> 💡 **Optional but recommended:** Instead of local MongoDB, use **MongoDB Atlas** (free cloud database). See Section 3 below.

### 1.3 Install Git (Required for GitHub)

**macOS:**
```bash
brew install git
```

**Windows:**
- Download from: https://git-scm.com/download/win
- Run the installer and accept defaults

**Verify:**
```bash
git --version
```

---

## 2. Visual Studio Code Setup

### 2.1 Install VSCode

- Download from: https://code.visualstudio.com/
- Install as normal application

### 2.2 Recommended Extensions

Open VSCode → Click the **Extensions** icon (left sidebar) → Search and install:

| Extension | Purpose |
|-----------|---------|
| **ES7+ React/Redux/React-Native snippets** (optional) | Helpful JS snippets |
| **Prettier - Code formatter** | Auto-format code consistently |
| **ESLint** | Catch code errors as you type |
| **Thunder Client** (or **REST Client**) | Test API endpoints without Postman |
| **MongoDB for VS Code** | Browse MongoDB directly in VSCode |
| **GitLens** | Visualize Git history and blame |
| **npm Intellisense** | Autocomplete npm package names |

### 2.3 Workspace Settings

Create a `.vscode/settings.json` in the project root:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "files.eol": "\n",
  "editor.tabSize": 2
}
```

---

## 3. MongoDB Setup

### Option A: Local MongoDB (see Section 1.2)

### Option B: MongoDB Atlas (Cloud — Free Tier)

MongoDB Atlas gives you a **free 512MB cloud database** — great for team collaboration:

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create a free account (or sign in with Google/GitHub)
3. Create a new **Shared Cluster** (M0 — Free tier)
4. Set a **Database User** (username + password) and save the credentials
5. Add your **IP address** to the network access whitelist (or use `0.0.0.0/0` for any IP — simpler for team testing)
6. Click **Connect** → **Connect your application** → copy the connection string

The connection string looks like:
```
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

Update your `.env` file:

```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/smart_book_system
```

---

## 4. Getting the Project on Your Machine

### 4.1 Clone the Repository

Once the admin has created the GitHub repository:

```bash
# Clone the project (replace URL with your actual repo)
git clone https://github.com/<your-org>/smart-book-system.git

# Move into the project folder
cd smart-book-system\Desktop\smart-book-system

# Install dependencies
npm install
```

### 4.2 Create Your `.env` File

The `.env` file is **not committed** to GitHub (it's in `.gitignore`). Create it manually:

```bash
# macOS/Linux
cp .env.example .env

# Windows (Command Prompt)
copy .env.example .env
```

> ⚠️ **Note:** If `.env.example` doesn't exist yet, create `.env` with this content:
>
> ```env
> PORT=5000
> NODE_ENV=development
> MONGO_URI=mongodb://127.0.0.1:27017/smart_book_system
> JWT_SECRET=your_super_secret_key_change_me
> JWT_EXPIRES_IN=30d
> ```

---

## 5. Running the Project Locally

**Step 1: Make sure MongoDB is running**

```bash
# macOS (local):
mongod --dbpath ~/data/db

# Windows: MongoDB runs as a service (starts automatically)
```

**Step 2: Seed the database** (creates admin account + 12 demo books)

```bash
npm run seed
```

You should see:
```
✅ Seeded 12 demo books: ...
✅ Default admin account created:
   Email: admin@smartbook.com
   Password: admin123
```

**Step 3: Start the server**

```bash
npm run dev
```

You should see:
```
Server running in development mode on port 5000
MongoDB Connected: 127.0.0.1
```

**Step 4: Open the app**

```
http://localhost:5000
```

**Step 5: Test different pages**

| Page | URL | What it does |
|------|-----|--------------|
| Book Gallery | `http://localhost:5000/` | Browse books, see stock |
| Login/Register | `http://localhost:5000/login.html` | Create account / login |
| Member Center | `http://localhost:5000/member.html` | Wishlist + borrow records |
| Admin Console | `http://localhost:5000/admin.html` | Manage books/users/borrows |
| Reader | `http://localhost:5000/reader.html?id=<bookId>` | Read a borrowed book |

**Test the API directly in the browser:**
```
http://localhost:5000/api/health
http://localhost:5000/api/books
```

---

## 6. Git & GitHub Workflow

### 6.1 Configure Git Once

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### 6.2 Standard Workflow (Feature Branch → Commit → Push → Pull Request)

**Every time you work on a feature, follow this pattern:**

```bash
# 1. Make sure you have the latest code
git checkout main
git pull origin main

# 2. Create a new branch for your feature
git checkout -b feature/auth-login

# 3. Make your code changes...
#    (edit files in VSCode)

# 4. See what you changed
git status

# 5. Stage your changes
git add .
#    or add specific files:
#    git add controllers/authController.js routes/authRoutes.js

# 6. Commit with a descriptive message
git commit -m "feat: add login validation and error handling"

# 7. Push your branch to GitHub
git push origin feature/auth-login

# 8. Go to GitHub → Create a Pull Request (PR)
#    - Click "Compare & pull request"
#    - Write a description of what you changed
#    - Request review from the team leader

# 9. Switch back to main after merging
git checkout main
git pull origin main
```

### 6.3 Common Git Commands Cheat Sheet

| Command | What it does |
|---------|--------------|
| `git status` | Show current changes |
| `git add <file>` | Stage a file |
| `git add .` | Stage all changes |
| `git commit -m "message"` | Commit staged changes |
| `git push origin <branch>` | Push to GitHub |
| `git pull origin main` | Pull latest from main |
| `git checkout -b <branch>` | Create + switch to new branch |
| `git checkout <branch>` | Switch branches |
| `git log --oneline` | View commit history |
| `git stash` | Temporarily save uncommitted changes |
| `git stash pop` | Restore stashed changes |

### 6.4 Branch Naming Convention

| Type | Pattern | Example |
|------|---------|---------|
| Feature | `feature/<description>` | `feature/book-crud` |
| Bug fix | `fix/<description>` | `fix/stock-validation` |
| Enhancement | `enhance/<description>` | `enhance/reader-page` |

---

## 7. Team Member Assignments & Code Review

---

### 🧑‍💻 Member A — Auth & User Module

**Files you own:**

| File | Purpose |
|------|---------|
| `models/User.js` | User data schema (name, email, hashed password, role) |
| `controllers/authController.js` | Register, login, get-me logic; JWT generation |
| `routes/authRoutes.js` | API route definitions for auth |
| `public/login.html` | Login + Register page |
| `public/js/auth.js` | Frontend login/register logic, token storage |
| `controllers/userController.js` | **NEW:** Admin user management (create/delete users) |
| `routes/userRoutes.js` | **NEW:** Admin user management routes |

**Read these files and understand:**
- ✅ How bcrypt hashes passwords before saving (see `User.js` pre-save hook)
- ✅ How JWT is generated and verified
- ✅ How `localStorage` stores the token
- ✅ How the frontend redirects based on role

**What you could add/modify (examples):**
- Update your profile info (name/email) — add `PUT /api/auth/profile`
- Change password — add `PUT /api/auth/password`
- Logout endpoint (invalidate token) — though clearing localStorage already works
- Forgot password / reset password flow
- Email verification on registration
- **Review:** Ensure passwords are never returned in API responses (check `select: false` and `.select('-password')`)
- **Review:** Ensure duplicate emails return a clear `400` error

**Example — Add a "Change Password" feature:**

In `authController.js`:
```js
/**
 * @desc    Change password
 * @route   PUT /api/auth/password
 * @access  Private
 */
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Provide current and new password' });
    }

    // Fetch user WITH password
    const user = await User.findById(req.user._id).select('+password');

    // Verify current password
    if (!(await user.matchPassword(currentPassword))) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Set new password (auto-hashed by pre-save hook)
    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    next(error);
  }
};
```

In `authRoutes.js`, add:
```js
router.put('/password', protect, changePassword);
```

In `public/js/api.js`, add:
```js
changePassword(data) {
  return this.request('/auth/password', {
    method: 'PUT',
    body: data,
  });
},
```

---

### 🧑‍💻 Member B — Book & Inventory Module

**Files you own:**

| File | Purpose |
|------|---------|
| `models/Book.js` | Book schema (title, author, isbn, totalQty, stock, content) |
| `controllers/bookController.js` | CRUD for books, stock management, book content access |
| `routes/bookRoutes.js` | API routes for books |
| `public/index.html` | Book gallery page |
| `public/js/books.js` | Frontend book rendering + interest/checkout buttons |
| `public/admin.html` | Admin console (book management section) |
| `public/js/admin.js` | Admin CRUD logic for books |
| `public/reader.html` | **NEW:** Book reader page |
| `public/js/reader.js` | **NEW:** Reader logic to load book content |

**Read these files and understand:**
- ✅ How `stock` defaults to `totalQty` on creation
- ✅ How stock is validated `stock > 0` before checkout
- ✅ How the stock tag colors work (`stock-available`, `stock-low`, `stock-out`)
- ✅ How the reader endpoint checks if the user has borrowed the book

**What you could add/modify (examples):**
- ✅ Search/filter books by title or author — implemented via `GET /api/books/search?q=`
- Sort books by title, author, stock
- Book categories/genres
- Upload a book cover image
- Pagination for large book lists
- **Review:** Ensure ISBN uniqueness is checked on both create AND update
- **Review:** Ensure stock cannot go negative

**Implemented — Search by Title/Author:**

In `controllers/bookController.js`, `searchBooks` uses a case-insensitive regex on `title` and `author`:

```js
const searchBooks = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.json({ success: true, count: 0, books: [] });
    }

    const books = await Book.find({
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { author: { $regex: q, $options: 'i' } },
      ],
    }).sort({ createdAt: -1 });

    res.json({ success: true, count: books.length, books });
  } catch (error) {
    next(error);
  }
};
```

In `routes/bookRoutes.js`:

```js
router.get('/search', searchBooks);
```

In `public/js/books.js`, a debounced input listener calls `API.searchBooks()`:

```js
document.getElementById('searchInput').addEventListener('input', debounce(searchBooks, 300));
```

In `public/js/api.js`:

```js
searchBooks(query = '') {
  return this.request(`/books/search?q=${encodeURIComponent(query)}`);
},
```

---

### 🧑‍💻 Member C — Borrow & Wishlist Module

**Files you own:**

| File | Purpose |
|------|---------|
| `models/BorrowRecord.js` | Borrow record schema + state machine |
| `controllers/borrowController.js` | Interest, checkout, status transitions, records |
| `routes/borrowRoutes.js` | API routes for borrow module |
| `public/member.html` | Member center (profile, wishlist, records) |
| `public/js/borrow.js` | Frontend wishlist/borrow/return logic |

**Read these files and understand:**
- ✅ The state machine: `interested → pending → borrowed → returned`
- ✅ How stock is decremented on borrow and incremented on return
- ✅ How duplicate active records are prevented
- ✅ How the member page filters records by status

**What you could add/modify (examples):**
- Due date / overdue detection — add a `dueDate` field
- Renew/extend borrow period
- Cancel a pending request (status: pending → interested)
- Borrow limit (max 3 books at a time)
- Notifications when a book becomes available
- **Review:** Ensure stock cannot go below 0 during concurrent borrows
- **Review:** Ensure status transitions are strictly validated

**Example — Add a "Due Date" field:**

In `models/BorrowRecord.js`:
```js
dueDate: {
  type: Date,
},
// Set due date to 14 days after borrow
```

In `borrowController.js`, when status changes to `borrowed`:
```js
if (status === 'borrowed') {
  book.stock -= 1;
  record.borrowDate = new Date();
  // 14-day borrow period
  record.dueDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
}
```

In `public/js/borrow.js`, display the due date:
```js
<td>${formatDate(record.dueDate) || '-'}</td>
```

---

### 🧑‍💻 Team Leader / Architect — Core Config & Middleware

**Files you own:**

| File | Purpose |
|------|---------|
| `app.js` | Express entry point, all middleware/routes mounting |
| `config/db.js` | MongoDB connection |
| `middleware/authMiddleware.js` | JWT verification |
| `middleware/roleMiddleware.js` | Admin role guard |
| `middleware/errorHandler.js` | Unified error handling |
| `seed.js` | Database seeding (demo books + admin account) |
| `package.json` | Dependencies and scripts |
| `.env` / `.gitignore` | Environment configuration |

**Read these files and understand:**
- ✅ How the request pipeline flows: middleware → routes → controllers → models
- ✅ How the error handler catches Mongoose errors
- ✅ How `protect` and `adminOnly` chain together
- ✅ How static files are served from `public/`

**What you could add/modify (examples):**
- Rate limiting (prevent brute-force attacks) — add `express-rate-limit`
- Security headers — add `helmet`
- Request logging — add `morgan`
- Input validation middleware
- Swagger/OpenAPI documentation
- **Review:** Ensure `.env` is never committed
- **Review:** Ensure JWT secret is strong in production
- **Review:** Ensure CORS is configured correctly

**Example — Add Security Middleware:**

```bash
npm install helmet express-rate-limit morgan
```

In `app.js`:
```js
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');

// Security headers
app.use(helmet());

// Request logging (development)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Rate limiting: max 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: 'Too many requests, please try again later.' },
});
app.use('/api', limiter);
```

---

## 8. Common Troubleshooting

| Problem | Solution |
|---------|----------|
| `Command not found: node` | Node.js not installed — install from nodejs.org or `brew install node` |
| `Error: listen EADDRINUSE :::5000` | Another server is running on port 5000 — kill it: `pkill -f "node app.js"` (macOS) or close the other terminal window |
| `MongoDB Connected` never appears | MongoDB is not running — start it: `mongod --dbpath ~/data/db` (macOS) or start the Windows service |
| `Operation users.findOne() buffering timed out` | Same as above — MongoDB is not running |
| `Invalid email or password` | Check you registered first, and that the email/password are correct |
| `Access denied: Admin only` | You're logged in as a regular user — use `admin@smartbook.com` / `admin123` |
| `Duplicate value for field: email/isbn` | That email or ISBN already exists — use a unique value |
| Port 5000 in use by another app | Change `PORT` in `.env` to e.g. `5001` |
| `npm ERR!` during install | Delete `node_modules` + `package-lock.json`, run `npm install` again |

### Useful commands

```bash
# Check if MongoDB is running
pgrep -l mongod          # macOS — shows process if running
tasklist | findstr mongod  # Windows

# Check if port 5000 is in use
lsof -i :5000            # macOS
netstat -ano | findstr :5000  # Windows

# Kill a process on port 5000
kill $(lsof -t -i :5000)  # macOS
# Windows: use Task Manager or `taskkill /PID <pid> /F`