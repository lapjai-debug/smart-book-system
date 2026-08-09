# 🚀 Smart Book System — New Team Member Onboarding Guide

> **For team members starting from scratch.** This guide walks you through registering on GitHub, getting added to the project, creating your own project folder in VS Code, building the required database file, and pushing your work to the **development** branch — then submitting for code review before merging to **main**.

---

## 📋 Table of Contents

1. [Step 0 — What You Need Before Starting](#step-0--what-you-need-before-starting)
2. [Step 1 — Register for a GitHub Account](#step-1--register-for-a-github-account)
3. [Step 2 — Install Required Software](#step-2--install-required-software)
4. [Step 3 — Accept the Repository Invitation](#step-3--accept-the-repository-invitation)
5. [Step 4 — Set Up VS Code & Create Your Project Folder](#step-4--set-up-vs-code--create-your-project-folder)
6. [Step 5 — Create the Required Database (DB) File](#step-5--create-the-required-database-db-file)
7. [Step 6 — Build the Project Structure (Reference: Smart Book System)](#step-6--build-the-project-structure-reference-smart-book-system)
8. [Step 7 — Configure Git & Connect to GitHub](#step-7--configure-git--connect-to-github)
9. [Step 8 — Push to the Development Branch](#step-8--push-to-the-development-branch)
10. [Step 9 — Code Review & Merging to Main](#step-9--code-review--merging-to-main)
11. [Step 10 — Daily Workflow (After Setup)](#step-10--daily-workflow-after-setup)
12. [Common Troubleshooting](#common-troubleshooting)

---

## Step 0 — What You Need Before Starting

| Item | Description |
|------|-------------|
| 💻 A computer | Windows, macOS, or Linux |
| 🌐 Internet connection | Required for GitHub, npm, MongoDB |
| 📧 An email address | For GitHub registration |
| 🧠 Basic terminal knowledge | You'll run commands in Terminal (macOS) / Command Prompt (Windows) |

---

## Step 1 — Register for a GitHub Account

> ⚠️ **Do this FIRST.** The team leader needs your GitHub username to add you to the project.

### 1.1 Create Your Account

1. Open your browser and go to: **https://github.com/signup**
2. Enter:
   - **Email address** (use a real one you check often)
   - **Password** (use a strong password)
   - **Username** (e.g., `john-smith-dev` — this is what the team leader will use to add you)
3. Complete the **puzzle verification** (prove you're human)
4. Click **Create account**
5. Check your email for a **verification link** from GitHub and click it

### 1.2 Complete Your Profile (Optional but Recommended)

1. Go to **https://github.com/settings/profile**
2. Add your **full name** (so the team leader can identify you)
3. Add a **profile picture** (optional)
4. Add a short **bio** (e.g., "Student developer")

### 1.3 Tell Your Team Leader

Once your account is created, **send your GitHub username to the team leader** (via chat, email, or however your team communicates).

> 📌 **Example message to team leader:**
> "Hi! I've created my GitHub account. My username is `john-smith-dev`. Please add me to the Smart Book System repository."

---

## Step 2 — Install Required Software

### 2.1 Install Node.js (Required)

Node.js runs the Express.js server.

**macOS (Homebrew):**
```bash
brew install node
```

**Windows:**
1. Go to: **https://nodejs.org/**
2. Download the **LTS** version (e.g., v20.x)
3. Run the `.msi` installer — click "Next" all the way through
4. Restart your terminal/Command Prompt

**Verify installation:**
```bash
node --version    # Should show v18.x or higher
npm --version     # Should show v9.x or higher
```

### 2.2 Install MongoDB (Required for the DB file)

**macOS (Homebrew):**
```bash
brew tap mongodb/brew
brew install mongodb-community

# Create the data directory
mkdir -p ~/data/db

# Start MongoDB (keep this terminal window open)
mongod --dbpath ~/data/db
```

**Windows:**
1. Go to: **https://www.mongodb.com/try/download/community**
2. Choose **MongoDB Community Server** → Windows → **MSI**
3. During installation, check **"Install MongoDB as a Service"** (auto-starts)
4. Default data path: `C:\Program Files\MongoDB\Server\<version>\data`

**Verify MongoDB is running:**
```bash
mongosh --version   # Should show version info
```

> 💡 **Alternative:** Use **MongoDB Atlas** (free cloud database) instead of local. See [Step 5.3](#53-option-b-mongodb-atlas-cloud-free-tier) below.

### 2.3 Install Git (Required for GitHub)

**macOS:**
```bash
brew install git
```

**Windows:**
1. Go to: **https://git-scm.com/download/win**
2. Run the installer — accept defaults
3. When asked about the **default editor**, choose **VS Code** if you have it, or Notepad

**Verify:**
```bash
git --version
```

### 2.4 Install Visual Studio Code

1. Go to: **https://code.visualstudio.com/**
2. Download and install for your OS
3. Open VS Code once to complete setup

### 2.5 Recommended VS Code Extensions

Open VS Code → Click **Extensions** icon (left sidebar, looks like 4 squares) → Search and install:

| Extension | Purpose |
|-----------|---------|
| **Prettier - Code formatter** | Auto-format code consistently |
| **ESLint** | Catch code errors as you type |
| **MongoDB for VS Code** | Browse MongoDB directly in VS Code |
| **GitLens** | Visualize Git history and blame |
| **Thunder Client** | Test API endpoints without Postman |
| **npm Intellisense** | Autocomplete npm package names |

---

## Step 3 — Accept the Repository Invitation

Once the team leader has added you to the GitHub repository, you'll receive an **email invitation** from GitHub.

### 3.1 Accept the Invitation

1. Check your email for a message from **GitHub** with the subject like:
   > **"lapjai-debug invited you to collaborate on smart-book-system"**
2. Click **"View invitation"** or go directly to: **https://github.com/invitations**
3. Click **"Accept invitation"**

### 3.2 Verify You Have Access

1. Go to: **https://github.com/lapjai-debug/smart-book-system** (replace with your actual repo URL)
2. You should now see the repository contents
3. Look at the **branches** — you should see `main` and `development`

> ⚠️ **If you don't see the repo:** Contact the team leader and confirm your GitHub username was spelled correctly.

---

## Step 4 — Set Up VS Code & Create Your Project Folder

> 🎯 **Key difference from cloning:** You will **create your own project folder from scratch** in VS Code, then connect it to the GitHub repository.

### 4.1 Open VS Code

Launch Visual Studio Code.

### 4.2 Create a New Project Folder

1. In VS Code, click **File → Open Folder...** (macOS: **File → Open...**)
2. Navigate to where you want your project (e.g., `Documents` or `Desktop`)
3. Click **New Folder** and name it: **`smart-book-system`**
4. Select the folder and click **Open** (macOS: **Open**)

Your VS Code window should now show an empty folder named `smart-book-system` in the Explorer (left sidebar).

### 4.3 Open the Integrated Terminal

1. In VS Code, click **Terminal → New Terminal** (or press `` Ctrl+` `` on Windows / `` Cmd+` `` on macOS)
2. A terminal panel opens at the bottom — this is where you'll run all commands
3. Verify you're in the right folder:
   ```bash
   pwd        # macOS/Linux — should show .../smart-book-system
   cd         # Windows — shows current directory
   ```

---

## Step 5 — Create the Required Database (DB) File

The Smart Book System uses **MongoDB** as its database. You need to create the database configuration file and set up the database connection.

### 5.1 Create the `config` Folder and `db.js` File

In VS Code:

1. In the Explorer (left sidebar), click the **New Folder** icon
2. Name it: **`config`**
3. Inside `config`, click **New File** and name it: **`db.js`**
4. Paste this content into `db.js`:

```js
// config/db.js
// MongoDB connection setup
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
```

### 5.2 Create the `.env` File (Database Connection Settings)

The `.env` file stores your database connection string and secrets. **It is never committed to GitHub** (it's in `.gitignore`).

1. In the Explorer, click **New File**
2. Name it: **`.env`**
3. Paste this content:

```env
# Server configuration
PORT=5000
NODE_ENV=development

# MongoDB connection string
# Local MongoDB:
MONGO_URI=mongodb://127.0.0.1:27017/smart_book_system

# JWT configuration
JWT_SECRET=your_super_secret_key_change_me
JWT_EXPIRES_IN=30d
```

> ⚠️ **Important:** The `.env` file contains your local database connection. It will **not** be pushed to GitHub because `.gitignore` excludes it. Each team member has their own local `.env`.

### 5.3 Option B: MongoDB Atlas (Cloud — Free Tier)

If you prefer a cloud database instead of local MongoDB:

1. Go to: **https://www.mongodb.com/cloud/atlas/register**
2. Create a free account
3. Create a **Shared Cluster** (M0 — Free tier)
4. Set a **Database User** (username + password) — save these!
5. Add your **IP address** to network access (or use `0.0.0.0/0` for any IP)
6. Click **Connect → Connect your application** → copy the connection string
7. Update your `.env` file:
   ```env
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/smart_book_system
   ```

### 5.4 Create the `.env.example` File (Template for Others)

This is a **safe template** (no real secrets) that gets committed to GitHub so others know what variables are needed.

1. In the Explorer, click **New File**
2. Name it: **`.env.example`**
3. Paste:
```env
# Server configuration
PORT=5000
NODE_ENV=development

# MongoDB connection string
MONGO_URI=mongodb://127.0.0.1:27017/smart_book_system

# JWT configuration
JWT_SECRET=change_me_in_production
JWT_EXPIRES_IN=30d
```

### 5.5 Create the `.gitignore` File

This tells Git which files **not** to push to GitHub.

1. In the Explorer, click **New File**
2. Name it: **`.gitignore`**
3. Paste:
```
# Dependencies
node_modules/

# Environment variables (sensitive - never commit)
.env

# Logs
logs/
*.log
npm-debug.log*

# OS files
.DS_Store
Thumbs.db

# Editor files
.vscode/
.idea/

# Coverage
coverage/

# Build output
dist/
build/

# Database backups
backups/
```

---

## Step 6 — Build the Project Structure (Reference: Smart Book System)

Using the **Smart Book System** as your reference, create the following folder structure. This is the **standard structure** all team members should follow so code stays consistent.

### 6.1 Create the Folder Structure

In VS Code Explorer, create these folders:

```
smart-book-system/
├── config/          ✅ (already created in Step 5)
├── controllers/
├── middleware/
├── models/
├── routes/
├── public/
│   ├── css/
│   └── js/
└── docs/
```

### 6.2 Create the Core Files

Create these files in the appropriate folders:

| File | Location | Purpose |
|------|----------|---------|
| `app.js` | Root | Express entry point |
| `package.json` | Root | Dependencies and scripts |
| `seed.js` | Root | Database seeding (demo data) |
| `config/db.js` | `config/` | ✅ Already created in Step 5 |
| `models/User.js` | `models/` | User schema |
| `models/Book.js` | `models/` | Book schema |
| `models/BorrowRecord.js` | `models/` | Borrow record schema |
| `controllers/authController.js` | `controllers/` | Auth logic |
| `controllers/bookController.js` | `controllers/` | Book CRUD logic |
| `controllers/borrowController.js` | `controllers/` | Borrow logic |
| `controllers/userController.js` | `controllers/` | User management |
| `middleware/authMiddleware.js` | `middleware/` | JWT verification |
| `middleware/roleMiddleware.js` | `middleware/` | Admin role guard |
| `middleware/errorHandler.js` | `middleware/` | Error handling |
| `routes/authRoutes.js` | `routes/` | Auth API routes |
| `routes/bookRoutes.js` | `routes/` | Book API routes |
| `routes/borrowRoutes.js` | `routes/` | Borrow API routes |
| `routes/userRoutes.js` | `routes/` | User API routes |
| `public/index.html` | `public/` | Book gallery page |
| `public/login.html` | `public/` | Login/Register page |
| `public/member.html` | `public/` | Member center |
| `public/admin.html` | `public/` | Admin console |
| `public/reader.html` | `public/` | Book reader |
| `public/css/style.css` | `public/css/` | Styles |
| `public/js/api.js` | `public/js/` | API helper |
| `public/js/auth.js` | `public/js/` | Auth frontend logic |
| `public/js/books.js` | `public/js/` | Book frontend logic |
| `public/js/borrow.js` | `public/js/` | Borrow frontend logic |
| `public/js/admin.js` | `public/js/` | Admin frontend logic |
| `public/js/reader.js` | `public/js/` | Reader frontend logic |
| `public/js/main.js` | `public/js/` | Main frontend logic |

> 📖 **Reference:** Open the original **Smart Book System** repository (or the `docs/TEAM_GUIDE.md` file) to see the exact content of each file. Your team leader will assign you specific modules to build.

### 6.3 Create `package.json`

1. In the Explorer, click **New File**
2. Name it: **`package.json`**
3. Paste:
```json
{
  "name": "smart-book-system",
  "version": "1.0.0",
  "description": "A full-stack library management system with JWT authentication, role-based access control, and borrow/wishlist workflow",
  "main": "app.js",
  "scripts": {
    "start": "node app.js",
    "dev": "node --watch app.js",
    "seed": "node seed.js"
  },
  "keywords": ["library", "book", "borrow", "express", "mongoose", "jwt"],
  "author": "Smart Book System Team",
  "license": "MIT",
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.19.2",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^8.4.1"
  }
}
```

### 6.4 Install Dependencies

In the VS Code terminal, run:

```bash
npm install
```

This creates the `node_modules` folder (which is **not** pushed to GitHub — it's in `.gitignore`).

---

## Step 7 — Configure Git & Connect to GitHub

### 7.1 Configure Git (Do This Once)

In the VS Code terminal, run:

```bash
git config --global user.name "Your Full Name"
git config --global user.email "your.email@example.com"
```

> ⚠️ Use the **same email** you registered with on GitHub.

### 7.2 Initialize Git in Your Project Folder

```bash
git init
```

### 7.3 Connect to the GitHub Repository

```bash
# Add the remote repository (replace with your actual repo URL)
git remote add origin https://github.com/lapjai-debug/smart-book-system.git

# Verify the remote is set
git remote -v
```

### 7.4 Fetch the Existing Branches

```bash
git fetch origin
```

This downloads the `main` and `development` branches from GitHub.

### 7.5 Check Out the Development Branch

```bash
git checkout -b development origin/development
```

> 🎯 **This is the key step.** You will work on the **development** branch, not `main`.

---

## Step 8 — Push to the Development Branch

### 8.1 Stage Your Files

```bash
# See what files you have
git status

# Stage all your files
git add .
```

### 8.2 Commit Your Work

```bash
git commit -m "feat: initial project setup with database config and structure"
```

### 8.3 Push to the Development Branch

```bash
git push origin development
```

### 8.4 Verify on GitHub

1. Go to your repository on GitHub
2. Click the **branches** dropdown (top-left, shows "main")
3. Select **development**
4. You should see your files there

> ✅ **Congratulations!** Your code is now on the **development** branch.

---

## Step 9 — Code Review & Merging to Main

### 9.1 Create a Pull Request (PR)

1. Go to your repository on GitHub
2. Click **"Compare & pull request"** (GitHub shows this after you push a new branch)
3. Set:
   - **Base:** `main`
   - **Compare:** `development`
4. Write a **title** (e.g., "feat: add auth module with JWT")
5. Write a **description** of what you changed
6. Click **"Create pull request"**

### 9.2 Request Code Review

1. In the PR page, click **Reviewers** (right sidebar)
2. Add your **team leader** (and any other reviewers)
3. Add a comment: **"Please review my code"**

### 9.3 Address Review Feedback

1. The reviewer may leave comments on your code
2. Make the requested changes in VS Code
3. Commit and push again:
   ```bash
   git add .
   git commit -m "fix: address review feedback"
   git push origin development
   ```
4. The PR updates automatically

### 9.4 Merge to Main (After Approval)

Once the team leader **approves** the PR:

1. Click **"Merge pull request"** on GitHub
2. Click **"Confirm merge"**
3. Optionally click **"Delete branch"** (cleanup)

> 🎯 **Important:** Only the **team leader** (or approved reviewers) should merge to `main`. Team members push to `development` and submit PRs.

---

## Step 10 — Daily Workflow (After Setup)

### 10.1 Start of Each Work Session

```bash
# 1. Get the latest code from development
git checkout development
git pull origin development

# 2. Create a feature branch for your task
git checkout -b feature/your-task-name
```

### 10.2 While Working

```bash
# Check what you changed
git status

# Stage and commit your changes
git add .
git commit -m "feat: describe what you did"
```

### 10.3 Push Your Feature Branch

```bash
git push origin feature/your-task-name
```

### 10.4 Create a PR to Development

1. On GitHub, click **"Compare & pull request"**
2. Set **Base:** `development`, **Compare:** `feature/your-task-name`
3. Create the PR and request review

### 10.5 After Your PR is Merged

```bash
# Switch back to development and get the latest
git checkout development
git pull origin development
```

---

## Common Troubleshooting

| Problem | Solution |
|---------|----------|
| `Command not found: node` | Node.js not installed — install from nodejs.org or `brew install node` |
| `Command not found: git` | Git not installed — install from git-scm.com or `brew install git` |
| `MongoDB Connected` never appears | MongoDB is not running — start it: `mongod --dbpath ~/data/db` (macOS) or start the Windows service |
| `Operation users.findOne() buffering timed out` | Same as above — MongoDB is not running |
| `Error: listen EADDRINUSE :::5000` | Another server is running on port 5000 — kill it: `pkill -f "node app.js"` (macOS) or close the other terminal |
| `Permission denied (publickey)` | Your SSH key isn't set up — use HTTPS URL instead: `git remote set-url origin https://github.com/lapjai-debug/smart-book-system.git` |
| `fatal: not a git repository` | You haven't run `git init` yet — run it in the project folder |
| `error: failed to push some refs` | Your branch is behind — run `git pull origin development` first, then push again |
| `npm ERR!` during install | Delete `node_modules` + `package-lock.json`, run `npm install` again |
| Can't see the repository on GitHub | You haven't accepted the invitation — check your email or go to https://github.com/invitations |
| `Access denied: Admin only` | You're logged in as a regular user — use `admin@smartbook.com` / `admin123` |

### Useful Commands

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

# See your Git remote
git remote -v

# See all branches
git branch -a
```

---

## ✅ Quick Checklist

Before you start, make sure you've completed:

- [ ] **Step 1:** Created a GitHub account and sent your username to the team leader
- [ ] **Step 2:** Installed Node.js, MongoDB, Git, and VS Code
- [ ] **Step 3:** Accepted the GitHub repository invitation
- [ ] **Step 4:** Created your `smart-book-system` folder in VS Code
- [ ] **Step 5:** Created `config/db.js`, `.env`, `.env.example`, and `.gitignore`
- [ ] **Step 6:** Created the project structure and `package.json`, ran `npm install`
- [ ] **Step 7:** Configured Git and connected to the GitHub repository
- [ ] **Step 8:** Pushed your code to the **development** branch
- [ ] **Step 9:** Created a Pull Request and requested code review
- [ ] **Step 10:** Follow the daily workflow for all future work

---

## 📚 Reference Materials

- **Smart Book System README:** `README.md` in the repository
- **Team Member Guide (detailed):** `docs/TEAM_GUIDE.md`
- **Admin Guide:** `docs/ADMIN_GUIDE.md`
- **GitHub Docs:** https://docs.github.com/
- **MongoDB Docs:** https://www.mongodb.com/docs/
- **Node.js Docs:** https://nodejs.org/docs/

---

*Happy coding! 🚀*