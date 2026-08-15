# Smart Book System — Team Presentation
**English Version | 20 Slides | Team ERB-Team-A**

---

## Slide 1: Title Slide

# Smart Book System
## A Full-Stack Library Management Platform

**Team ERB-Team-A**
**Technology:** Node.js · Express · MongoDB · JWT · Vanilla JS
**Duration:** 5 minutes per member

---

## Slide 2: Team Leader — System Overview

**Purpose:** Digital library management with borrowing, wishlists, and online reading.

**Core Features:**
- JWT authentication with role-based access
- Book gallery with live stock tracking
- Borrow state machine: interested → pending → borrowed → returned
- Online book reader for borrowed books
- Admin console for full management

**Architecture:** MVC pattern with Express routes, Mongoose models, and static HTML frontend.

---

## Slide 3: Team Leader — Technology Stack

| Layer | Technology |
|-------|-----------|
| **Runtime** | Node.js v18+ |
| **Backend** | Express.js |
| **Database** | MongoDB + Mongoose ODM |
| **Authentication** | JWT (jsonwebtoken) + bcrypt |
| **Frontend** | HTML5, CSS3, Vanilla JavaScript |
| **Deployment** | Vercel / Render / Railway |

**Key Files:**
- `app.js` — Express entry point
- `config/db.js` — MongoDB connection
- `middleware/` — Auth, role guards, error handling

---

## Slide 4: Team Leader + Member 1 — Auth & User Module

**HTML Page:** `public/login.html`
- Login and Register tabs
- Form validation with HTML5 attributes
- JWT token stored in `localStorage`
- Role-based redirect after login

**Controller:** `controllers/authController.js`
- `registerUser` — Creates user, hashes password, returns JWT
- `loginUser` — Verifies credentials, returns JWT
- `getMe` — Returns logged-in user profile

**Model:** `models/User.js`
- Fields: `name`, `email` (unique), `password` (`select: false`), `role`
- Pre-save hook auto-hashes password with bcrypt
- `matchPassword()` method for login verification

---

## Slide 5: Team Leader + Member 4 — Admin Console & User Management

**HTML Page:** `public/admin.html`
- Book management table with Add/Edit/Delete modals
- User management table with Create/Delete actions
- All borrow records table for admin oversight
- Responsive layout with CSS Grid

**Controller:** `controllers/userController.js` + `controllers/bookController.js`
- `getUsers` — Lists all users (password excluded)
- `createUser` — Admin creates new user accounts
- `deleteUser` — Removes user + cascades borrow records
- Book CRUD with ISBN uniqueness checks

**Model:** `models/User.js` + `models/Book.js`
- User schema with `role` enum (`user` / `admin`)
- Book schema with `isbn` unique constraint and `stock` validation

---

## Slide 6: Team Leader + Member 5 — Book Gallery & Frontend

**HTML Page:** `public/index.html`
- Search bar with real-time filtering
- Book grid with stock status badges (In Stock / Low Stock / Out of Stock)
- Edit and Delete action buttons per book
- Loading states and toast notifications

**Controller:** `controllers/bookController.js`
- `getBooks` — Returns all books sorted by newest
- `searchBooks` — Case-insensitive regex search on title/author
- `getBookById` — Single book detail
- `getBookContent` — Returns book content for the reader

**Model:** `models/Book.js`
- Fields: `title`, `author`, `isbn` (unique), `totalQty`, `stock`, `content`
- `stock` defaults to `totalQty` on creation
- Timestamps for audit trail

---

## Slide 7: Team Leader — Middleware & Security Pipeline

**Middleware Stack (app.js):**
1. `cors()` — Cross-origin resource sharing
2. `express.json()` / `express.urlencoded()` — Body parsing
3. `express.static()` — Serves frontend from `public/`
4. JWT verification via `protect` middleware
5. Admin-only access via `adminOnly` guard

**Security Features:**
- Passwords never returned in API responses (`select: false`)
- JWT expiration (30 days)
- Admin-only routes for destructive operations
- Input validation on all mutations

---

## Slide 8: Team Leader — Error Handling & API Design

**Global Error Handler:** `middleware/errorHandler.js`
- Catches Mongoose validation errors → 400
- Catches duplicate key errors → 400 with field name
- Catches JWT errors → 401
- 404 handler for undefined routes

**REST API Design:**
- `/api/auth/*` — Register, login, profile
- `/api/books/*` — Book CRUD + search + reader
- `/api/borrow/*` — Wishlist, checkout, status updates
- `/api/users/*` — Admin user management
- `/api/health` — Health check endpoint

---

## Slide 9: Team Leader — Database Connection & Seeding

**Database Config:** `config/db.js`
- Lazy connection on server start
- Connection string from `MONGO_URI` env variable
- Graceful error logging and process exit on failure

**Database Seeding:** `seed.js`
- Creates 12 demo books with chapter content
- Creates default admin: `admin@smartbook.com` / `admin123`
- Idempotent — safe to run multiple times

**Models Used:**
- `User.js` — 1 admin + demo users
- `Book.js` — 12 books with `totalQty`, `stock`, `content`
- `BorrowRecord.js` — Sample borrow records

---

## Slide 10: Team Leader — Deployment & GitHub Workflow

**Branch Strategy:**
- `main` — Production-ready, protected
- `development` — Integration branch for features
- Feature branches → PR → Code Review → Merge

**GitHub Workflow:**
1. Clone repo and install dependencies
2. Create `.env` from `.env.example`
3. Run `npm run seed` to initialize database
4. `npm run dev` to start server on port 5000
5. Push feature branches and open PRs

**Free Deployment Options:**
- Render (recommended) — auto-deploy from GitHub
- Vercel — serverless functions
- Railway — quick deploys

---

## Slide 11: Member 2 — Book & Inventory Module Overview

**Member 2 Responsibility:** Book inventory, search, stock management, and admin book tools.

**Files Owned:**
- `models/Book.js`
- `controllers/bookController.js`
- `routes/bookRoutes.js`
- `public/index.html`
- `public/js/books.js`
- `public/admin.html`
- `public/js/admin.js`
- `public/reader.html`
- `public/js/reader.js`

**Key Contribution:** Complete book lifecycle from creation to reading.

---

## Slide 12: Member 2 — HTML Page: Book Gallery (`public/index.html`)

**Purpose:** Main book browsing interface for all users.

**Structure:**
- Search input with real-time debounce
- Book grid container (`#bookGrid`) for dynamic cards
- "Add New Book" button (admin only)
- Loading spinner and empty state messages

**User Flow:**
1. Page loads → `loadBooks()` fetches `/api/books`
2. User types in search → `searchBooks()` queries `/api/books/search`
3. Admin clicks "Add" → modal form → POST to `/api/books`
4. Toast notifications confirm success/error

---

## Slide 13: Member 2 — Controller: `controllers/bookController.js`

**REST Endpoints:**

| Method | Route | Access | Function |
|--------|-------|--------|----------|
| GET | `/api/books` | Public | `getBooks` — list all books |
| GET | `/api/books/search` | Public | `searchBooks` — regex search |
| GET | `/api/books/:id` | Public | `getBookById` — single book |
| POST | `/api/books` | Admin | `createBook` — add new book |
| PUT | `/api/books/:id` | Admin | `updateBook` — update details/stock |
| DELETE | `/api/books/:id` | Admin | `deleteBook` — remove book |
| GET | `/api/books/:id/read` | Private | `getBookContent` — reader access |

**Stock Logic:**
- `createBook` sets `stock = totalQty`
- `updateBook` adjusts stock proportionally when `totalQty` changes
- Explicit stock override validated against `totalQty`

---

## Slide 14: Member 2 — Model: `models/Book.js`

**Schema Definition:**
```javascript
{
  title: String (required, max 200),
  author: String (required, max 100),
  isbn: String (required, unique, max 20),
  totalQty: Number (required, min 1, default 1),
  stock: Number (min 0, defaults to totalQty),
  content: String (max 50000 chars)
}
```

**Validation:**
- Unique ISBN prevents duplicate entries
- Stock cannot exceed `totalQty`
- Stock cannot go negative
- Timestamps track creation and updates

**Relationships:**
- Referenced by `BorrowRecord` via `bookId`
- Used in `bookController` for all CRUD operations

---

## Slide 15: Member 2 — Search, Stock & Reader Feature

**Search Feature:**
- Case-insensitive regex on `title` and `author`
- Debounced input (300ms) in `public/js/books.js`
- Returns sorted results (`createdAt` descending)

**Stock Status Badges:**
- `stock > 10` → Green "In Stock"
- `stock === 0` → Red "Out of Stock"
- `0 < stock ≤ 10` → Yellow "X copies left"

**Book Reader:**
- `public/reader.html` — Clean reading interface
- `getBookContent` checks if user borrowed the book (or is admin)
- Book content rendered from `Book.content` field
- Back button returns to `member.html`

---

## Slide 16: Member 3 — Borrow & Wishlist Module Overview

**Member 3 Responsibility:** Borrow state machine, wishlist, checkout workflow, and member account page.

**Files Owned:**
- `models/BorrowRecord.js`
- `controllers/borrowController.js`
- `routes/borrowRoutes.js`
- `public/member.html`
- `public/js/borrow.js`

**Key Contribution:** Complete borrow lifecycle with stock validation and state machine enforcement.

---

## Slide 17: Member 3 — HTML Page: Member Center (`public/member.html`)

**Purpose:** Personal dashboard for logged-in members.

**Structure:**
- **Profile Card** — Displays user name, email, role
- **Wishlist Card** — Lists interested/pending books with checkout button
- **Borrow Records Card** — Shows borrow history with status badges and return button

**User Flow:**
1. Page loads → `loadProfile()` fetches `/api/auth/me`
2. `loadWishlist()` fetches `/api/borrow/my-records` filtered by status
3. User clicks "Checkout" → POST `/api/borrow/checkout`
4. User clicks "Return" → PUT `/api/borrow/status/:id` to `returned`

---

## Slide 18: Member 3 — Controller: `controllers/borrowController.js`

**State Machine:**
```
interested → pending → borrowed → returned
```

**Endpoints:**

| Method | Route | Access | Function |
|--------|-------|--------|----------|
| POST | `/api/borrow/interest` | Private | `addInterest` — add to wishlist |
| POST | `/api/borrow/checkout` | Private | `checkout` — submit request |
| PUT | `/api/borrow/status/:id` | Private | `updateStatus` — transition state |
| GET | `/api/borrow/my-records` | Private | `getMyRecords` — user history |
| GET | `/api/borrow/all` | Admin | `getAllRecords` — all records |

**Stock Management:**
- `borrowed` → `book.stock -= 1`, `record.borrowDate = new Date()`
- `returned` → `book.stock += 1`, `record.returnDate = new Date()`

---

## Slide 19: Member 3 — Model: `models/BorrowRecord.js`

**Schema Definition:**
```javascript
{
  userId: ObjectId (ref: User, required),
  bookId: ObjectId (ref: Book, required),
  status: String (enum: interested/pending/borrowed/returned, default: interested),
  borrowDate: Date,
  returnDate: Date
}
```

**State Machine Validation:**
- `interested` → can only go to `pending`
- `pending` → can go to `borrowed` or `returned`
- `borrowed` → can only go to `returned`
- `returned` → terminal state (no transitions)

**Data Integrity:**
- Compound index on `{ userId, bookId, status }` prevents duplicate active records
- `populate()` in controllers fetches user and book details

---

## Slide 20: Member 3 — Integration, Testing & Demo

**Integration Points:**
- `borrowController` references both `User` and `Book` models
- Stock updates in `updateStatus` trigger immediately
- Frontend `borrow.js` handles all CRUD via `API` helper

**Testing Checklist:**
- Register new user → login → view profile
- Browse books → add to wishlist → checkout → return
- Verify stock decrements on borrow and increments on return
- Admin approves borrow request → stock decreases
- Reader page accessible only after borrowing

**Demo Flow:**
1. Open `http://localhost:5000` → Book Gallery
2. Login as `admin@smartbook.com` / `admin123`
3. Navigate to Admin Console → manage books/users
4. Logout → register as new user → test borrow flow
5. Read a borrowed book in the Reader

---

*Presentation prepared for Team ERB-Team-A | Smart Book System Project*
