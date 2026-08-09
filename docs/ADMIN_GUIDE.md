# 🛠️ Smart Book System — Admin Guide

This guide covers how to upload the project to GitHub, deploy it to a public server (including free options), and manage the live system.

---

## 📋 Table of Contents

1. [Uploading to GitHub](#1-uploading-to-github)
2. [Free Hosting Recommendations](#2-free-hosting-recommendations)
3. [Option A: Deploy with Render (Recommended — Free)](#3-option-a-deploy-with-render-recommended--free)
4. [Option B: Deploy with Railway (Free Tier)](#4-option-b-deploy-with-railway-free-tier)
5. [Option C: Deploy with Vercel (Free)](#5-option-c-deploy-with-vercel-free)
6. [Option D: Deploy on a VPS with Docker (Free via Oracle Cloud)](#6-option-d-deploy-on-a-vps-with-docker-free-via-oracle-cloud)
7. [Live System Administration](#7-live-system-administration)
8. [Backup & Restore](#8-backup--restore)
9. [Security Checklist](#9-security-checklist)

---

## 1. Uploading to GitHub

### Step 1: Create a GitHub Account & Repository

1. Go to https://github.com/
2. Click **Sign up** and create an account
3. After logging in, click the **+** icon (top-right) → **New repository**
4. Name it: `smart-book-system`
5. Set it to **Private** (for a school project) or **Public** (for portfolio)
6. Do **NOT** check "Add a README" or ".gitignore" (we already have these)
7. Click **Create repository**

### Step 2: Initialize Git (If Not Already Done)

```bash
cd /Users/agentadmin/Desktop/smart-book-system

# Check if git is already initialized
ls -a | grep .git
```

If there's no `.git` folder:
```bash
git init
```

### Step 3: Make Your First Commit

```bash
# Add all files to staging (except node_modules and .env — those are gitignored)
git add .

# Verify .env and node_modules are NOT staged
git status
# You should NOT see: .env, node_modules/

# Commit
git commit -m "feat: initial Smart Book System implementation
- JWT auth with bcrypt password hashing
- Book CRUD with stock management
- Borrow state machine (interested -> pending -> borrowed -> returned)
- Book reader for borrowed books
- Admin console with user/book/borrow management
- 12 seeded demo books with content
- Default admin account"
```

### Step 4: Push to GitHub

```bash
# Connect your local repo to GitHub
git remote add origin https://github.com/<YOUR_USERNAME>/smart-book-system.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 5: Add Team Members

1. Go to your GitHub repo → **Settings** → **Collaborators and teams**
2. Click **Add people**
3. Enter each team member's GitHub username or email
4. Choose permission: **Write** (allows pushing) or **Maintain**
5. They'll receive an invitation email — they must accept it

### Step 6: Important — The `.env` File

The `.env` file is **NOT** pushed to GitHub (it's in `.gitignore`). For teammates to run the project, create a template:

```bash
# Create a template without real secrets
cat .env | sed 's/JWT_SECRET=.*/JWT_SECRET=change_me_in_production/' > .env.example

# Commit the template
git add .env.example
git commit -m "chore: add .env.example template"
git push
```

---

## 2. Free Hosting Recommendations

| Platform | Cost | Best For | Notes |
|----------|------|----------|-------|
| **Render** | Free | Full Node.js + static hosting | Best overall free option for Express apps |
| **Railway** | Free trial → $5/mo | Quick deploys | ~$5 free credit, good for demos |
| **Vercel** | Free | Frontend only | Express works via serverless functions but has limitations |
| **Cyclic.sh** | Free | Node.js apps | Simple Express + MongoDB hosting (may have limited availability) |
| **Oracle Cloud Free Tier** | Free forever | Full VPS with Docker | Most powerful free option — a real Linux server |
| **PythonAnywhere** | Free | Simple apps | Limited for Node.js |
| **Glitch** | Free | Prototyping | Good for demos but not production |
| **OnRender / Fly.io** | Free tier | Full apps | Fly has a free allowance (~3 small VMs) |

**Recommended stack (all free):**
- **App hosting:** Render (free web service)
- **Database:** MongoDB Atlas (free M0 cluster)
- **Domain:** (optional) You can use the free subdomain `appname.onrender.com`

---

## 3. Option A: Deploy with Render (Recommended — Free)

### Why Render?

- ✅ **Free tier** — 750 hours/month (plenty for a school project)
- ✅ Auto-deploys from GitHub on every push
- ✅ Free HTTPS/SSL
- ✅ Free subdomain: `https://smart-book-system.onrender.com`

### Step 1: Prepare the Project

Make sure you've pushed all code to GitHub (Section 1).

### Step 2: Create a MongoDB Atlas Free Database

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Sign up → Create a **Shared Cluster** (M0 — Free)
3. Setup a **Database User**: (e.g. `admin` / a strong password)
4. **Network Access** → Add IP → `0.0.0.0/0` (allow anywhere — for a demo)
5. Click **Connect** → **Connect your application** → copy the connection string:
   ```
   mongodb+srv://admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

### Step 3: Create the Web Service on Render

1. Go to https://render.com/ → Sign up with GitHub
2. Click **New** → **Web Service**
3. Connect your GitHub repo `smart-book-system`
4. Fill in the settings:
   - **Name:** `smart-book-system`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** Free
5. Add the environment variables (click **Advanced** → **Environment Variables**):

   | Key | Value |
   |-----|-------|
   | `NODE_ENV` | `production` |
   | `PORT` | `10000` |
   | `MONGO_URI` | `mongodb+srv://admin:<password>@cluster0.xxxxx.mongodb.net/smart_book_system` |
   | `JWT_SECRET` | `<generate a long random secret>` |
   | `JWT_EXPIRES_IN` | `30d` |

   Generate a strong JWT secret:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

6. Click **Create Web Service**
7. Render will build and deploy automatically. Wait ~2-3 minutes.

### Step 4: Seed the Database on Production

Since `seed.js` needs to run once, use Render's shell:

1. Go to your Render service → **Shell** tab (only available on paid tiers) 

**Alternative — Seed locally against Atlas:**

Run the seed script from your local machine, pointing to the Atlas database:

```bash
# Temporarily change MONGO_URI in .env to your Atlas string
# Then run:
npm run seed
# This will seed the Atlas database from your local machine
# Then change MONGO_URI back to local
```

### Step 5: Verify

Visit: `https://smart-book-system.onrender.com`

- ✅ Book gallery loads with the 12 demo books
- ✅ Register/login works
- ✅ Admin login: `admin@smartbook.com` / `admin123`

### Step 6: Auto-Deploy on Every Push

Render watches your GitHub repo. Every time you push to `main`, Render automatically rebuilds and redeploys.

```bash
git add .
git commit -m "feat: add new feature"
git push origin main
# Render auto-deploys!
```

---

## 4. Option B: Deploy with Railway (Free Tier)

1. Go to https://railway.app/ → Sign in with GitHub
2. Click **New Project** → **Deploy from GitHub repo**
3. Select `smart-book-system`
4. Railway auto-detects Node.js
5. Click **Variables** → Add:
   - `MONGO_URI` = your Atlas connection string
   - `JWT_SECRET` = a long random string
   - `PORT` = `3000` (Railway sets this automatically)
6. Click **Deploy**
7. Railway provides a public URL after deployment

> ⚠️ Railway's free tier provides $5 of credit (~$0.03/hour). A small Node service (~$0.0002/hr) can run for months on the credit.

---

## 5. Option C: Deploy with Vercel (Free)

Vercel is great for frontend but Node.js Express apps need the **serverless** model. This project is already configured for Vercel:

- `api/index.js` — Serverless entry point that connects to MongoDB on each invocation
- `vercel.json` — Routes `/api/*` to the serverless function and serves `public/` as static files
- `config/db.js` — Caches the MongoDB connection globally (serverless-friendly)

### Deploy Steps

1. Go to https://vercel.com/ → Sign up with GitHub
2. Click **New Project** → Import `smart-book-system`
3. Vercel detects the `vercel.json` config
4. Set environment variables (same as Render):
   - `MONGO_URI` = your Atlas connection string
   - `JWT_SECRET` = a long random string
   - `JWT_EXPIRES_IN` = `30d`
5. Deploy

### ⚠️ CRITICAL: Why Vercel Cannot Connect to MongoDB Atlas

**Compass works but Vercel doesn't** because of the **Atlas IP whitelist**:

- **MongoDB Compass** connects from **your home/local IP** — which you whitelisted
- **Vercel** connects from **Vercel's cloud servers** — which have **different IPs** that are NOT whitelisted

**Fix — Allow access from anywhere:**

1. Log in to https://cloud.mongodb.com/
2. Click your cluster → **Network Access** tab
3. Click **+ Add IP Address**
4. Select **Allow access from anywhere** (`0.0.0.0/0`)
5. Click **Confirm**

This is required for ANY cloud host (Vercel, Render, Railway) because their server IPs change dynamically.

> ⚠️ **Security note:** `0.0.0.0/0` means anyone with the connection string can access the database. For a school project this is acceptable. For production, use Vercel's published IP ranges instead: https://vercel.com/docs/security/encryption#ip-restriction

### Vercel Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| `Could not connect to any servers in your MongoDB Atlas cluster` | Vercel IP not whitelisted | Add `0.0.0.0/0` in Atlas Network Access |
| `Database connection failed. Check Atlas IP whitelist.` (503) | Same as above | Same fix |
| API returns 504 timeout | Vercel serverless 10s limit + slow cold start | First request after idle is slow; subsequent requests are fast. Use Render instead if this is a problem |
| Static pages load but API fails | Environment variables not set | Add `MONGO_URI` and `JWT_SECRET` in Vercel Project Settings → Environment Variables |

> ⚠️ Vercel serverless functions have a **10-second timeout**, which might cause slow MongoDB operations to fail. Use with caution. For a more reliable free host, prefer **Render** (Option A).

---

## 6. Option D: Deploy on a VPS with Docker (Free via Oracle Cloud)

This is the **most powerful free option** — you get a real Linux server forever.

### Step 1: Create a Dockerfile

Create `Dockerfile` in the project root:

```dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy application code
COPY . .

# Remove .env (use environment variables instead)
RUN rm -f .env

# Expose port
EXPOSE 5000

# Start the app
CMD ["npm", "start"]
```

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - PORT=5000
      - MONGO_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/smart_book_system
      - JWT_SECRET=<your-secret>
      - JWT_EXPIRES_IN=30d
    restart: always
```

### Step 2: Get a Free Oracle Cloud VPS

1. Go to https://www.oracle.com/cloud/free/
2. Sign up (requires credit card for verification but is **free forever**)
3. Create an **Always Free** Compute instance:
   - Shape: `VM.Standard.A1.Flex` (ARM, 4 OCPUs + 24GB RAM free!) or a small AMD
   - OS: Ubuntu 22.04
4. SSH into the server:
   ```bash
   ssh -i ~/Downloads/your-key.pem ubuntu@<server-ip>
   ```

### Step 3: Install Docker & Deploy

```bash
# Install Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
# Log out and back in

# Clone your repo
git clone https://github.com/<YOUR_USERNAME>/smart-book-system.git
cd smart-book-system

# Deploy
docker compose up -d

# Check it's running
docker compose ps

# Open the firewall port
sudo ufw allow 5000
```

### Step 4: Access

Visit: `http://<server-ip>:5000`

### Optional: Free Domain with Cloudflare

1. Use Cloudflare's free DNS to point a domain to your server
2. Enable Cloudflare's "Flexible" SSL to get HTTPS for free

---

## 7. Live System Administration

### Default Admin Account

| Credential | Value |
|------------|-------|
| Email | `admin@smartbook.com` |
| Password | `admin123` |

> ⚠️ **IMPORTANT:** Change the admin password after first login. Currently there is no UI for this — use MongoDB Atlas or shell to update the password hash, or add Member A's "Change Password" feature.

### Testing the Live API

```bash
# Health check
curl https://smart-book-system.onrender.com/api/health

# Get books
curl https://smart-book-system.onrender.com/api/books

# Login as admin
curl -X POST https://smart-book-system.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@smartbook.com","password":"admin123"}'
```

### Managing the Production Database

Use **MongoDB Atlas** (if using Atlas):
1. Go to your Atlas cluster
2. Click **Browse Collections**
3. You'll see collections: `books`, `users`, `borrowrecords`
4. You can view/edit/delete documents directly

### Reset the Production Database

If you need to wipe and re-seed the production database:

```bash
# From your local machine, point .env to Atlas, then:
npm run seed
# This clears books, re-inserts 12 demo books, and ensures the admin account exists
```

---

## 8. Backup & Restore

### Backup Using `mongodump`

```bash
# Local backup
mongodump --db smart_book_system --out ./backups/backup-$(date +%Y%m%d)

# Atlas backup (from local machine)
mongodump --uri="mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net" \
  --db smart_book_system --out ./backups/atlas-$(date +%Y%m%d)
```

### Restore Using `mongorestore`

```bash
mongorestore --db smart_book_system ./backups/backup-20260707/smart_book_system
```

### Automate Backups with a Cron Job (macOS/Linux)

```bash
# Create a backup script
cat > backup.sh << 'EOF'
#!/bin/bash
mkdir -p /Users/agentadmin/data/backups
mongodump --db smart_book_system \
  --out /Users/agentadmin/data/backups/backup-$(date +%Y%m%d)
# Delete backups older than 30 days
find /Users/agentadmin/data/backups -type d -mtime +30 -exec rm -rf {} \;
EOF

chmod +x backup.sh

# Run every day at 2am
crontab -e
# Add this line:
0 2 * * * /Users/agentadmin/backup.sh
```

---

## 9. Security Checklist

Before going live, review these items:

### ✅ Must-Do

- [ ] **Change the default admin password** from `admin123`
- [ ] **Use a strong JWT_SECRET** — use the random generator above
- [ ] **Never commit `.env`** — it's already in `.gitignore`, double-check
- [ ] **Use HTTPS** — Render/Vercel/Railway give this free
- [ ] **Protect the Atlas database** — don't share credentials publicly
- [ ] **Set `NODE_ENV=production`** in production so error stacks are hidden

### ✅ Strongly Recommended

- [ ] Add **helmet** for security headers:
  ```bash
  npm install helmet
  ```
  ```js
  const helmet = require('helmet');
  app.use(helmet());
  ```
- [ ] Add **rate limiting** to prevent brute force:
  ```bash
  npm install express-rate-limit
  ```
  ```js
  const rateLimit = require('express-rate-limit');
  app.use('/api', rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  }));
  ```
- [ ] Require HTTPS for API — Render handles this automatically
- [ ] Set Atlas Network Access to specific IPs instead of `0.0.0.0/0` (after dev)

### ✅ For the School Project

- [ ] Include the **UML diagrams** (Use Case, ER, Sequence) in the repo
- [ ] Write the **API documentation** (a Markdown file listing all endpoints)
- [ ] Record a short **demo video** of the app running
- [ ] Add a `.gitignore` entry for `backups/`

---

## Quick Reference: All API Endpoints

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