# Smart Book System — Demo Guide
**Step-by-Step Demonstration for Team Presentation**

This guide covers the exact steps each presenter should follow during the 5-minute demo. Open the app at `http://localhost:5000` before starting.

---

## Part 1: Team Leader Demo (Slides 1–10)
**Duration:** 5 minutes

### Step 1: Open the Application and Show Overview
- **Action:** Open browser and go to `http://localhost:5000`
- **Expected:** Book Gallery page loads with the navbar, search bar, and book cards
- **Feature demonstrated:** System is running and accessible (`app.js`, `public/index.html`)

### Step 2: Show the Technology Stack
- **Action:** Return to the slides and show the architecture diagram.
- **Key points to mention:**
  - Frontend: HTML, CSS, and JavaScript in the `public/` folder
  - Backend: Node.js and Express in `app.js` and `routes/`
  - Database: MongoDB with Mongoose models in `models/`
  - Security: JWT tokens and bcrypt password hashing
- **Feature demonstrated:** Full-stack architecture (`app.js`, `config/db.js`, `middleware/`)

### Step 3: Show Database Connection and Seeding
- **Action:** Show the terminal running the server.
- **Expected:** You see `MongoDB Connected: 127.0.0.1` or `MongoDB Connected: localhost`
- **Action:** Mention that the database was initialized with `npm run seed`.
- **Expected:** 12 demo books and 1 admin account exist in MongoDB.
- **Feature demonstrated:** Database setup (`config/db.js`, `seed.js`)

### Step 4: Demonstrate Admin Login and Session Management
- **Action:** Click the **Login** button in the navbar (or go to `/login.html`).
- **Action:** Enter email: `admin@smartbook.com` and password: `admin123`.
- **Action:** Click **Login**.
- **Expected:** You are redirected to the Admin Console (`/admin.html`).
- **Action:** Refresh the page.
- **Expected:** You stay logged in (session persists).
- **Feature demonstrated:** JWT authentication and session handling (`public/login.html`, `controllers/authController.js`, `models/User.js`)

### Step 5: Show Admin Console Overview
- **Action:** On the Admin Console, show the three management sections without modifying data:
  - **Manage Books** — scroll through the books table
  - **Manage Users** — scroll through the users table
  - **All Borrow Records** — scroll through the borrow records table
- **Expected:** All tables show seeded data (12 books, 1 admin user, borrow records if any).
- **Feature demonstrated:** Admin dashboard (`public/admin.html`)

### Step 6: Demonstrate Error Handling and Protected Routes
- **Action:** Open an incognito window and go to `http://localhost:5000/admin.html`.
- **Expected:** You are redirected to the login page because you are not authenticated.
- **Action:** Try to access a protected API directly: `http://localhost:5000/api/users`
- **Expected:** You see a JSON error: `"Not authorized to access this route"`
- **Feature demonstrated:** Route protection (`middleware/authMiddleware.js`, `middleware/roleMiddleware.js`)

### Step 7: Show User Management
- **Action:** In the Admin Console, go to the **Manage Users** section.
- **Action:** Click **+ Add User**.
- **Action:** Fill in:
  - Name: `Demo User`
  - Email: `demo@test.com`
  - Password: `demo123`
  - Role: `user`
- **Action:** Click **Create User**.
- **Expected:** The new user appears in the users table.
- **Feature demonstrated:** Admin user creation (`controllers/userController.js`, `models/User.js`)

### Step 8: Show Borrow Records Oversight
- **Action:** Scroll down to the **All Borrow Records** section in the Admin Console.
- **Expected:** A table showing all borrowing activity across all users.
- **Action:** Point out the status column and explain the state machine: `interested` → `pending` → `borrowed` → `returned`.
- **Feature demonstrated:** Admin oversight of borrow activity (`controllers/borrowController.js`, `models/BorrowRecord.js`)

### Step 9: Logout and Protected Route Verification
- **Action:** Click the **Logout** button in the navbar.
- **Expected:** You are returned to the Book Gallery and the login button reappears.
- **Action:** Try to access `http://localhost:5000/admin.html` again.
- **Expected:** You are redirected to login because the session was destroyed.
- **Feature demonstrated:** Session termination and protected route access (`middleware/authMiddleware.js`)

### Step 10: Show Deployment and GitHub Workflow
- **Action:** Return to the slides and show the GitHub repository and branch structure.
- **Key points to mention:**
  - Repository: `https://github.com/lapjai-debug/smart-book-system`
  - Branch strategy: `main` (protected) and `development` (integration)
  - Workflow: feature branch → commit → push → pull request → code review → merge
  - Free deployment: Render or Vercel auto-deploy from GitHub
- **Feature demonstrated:** Team collaboration and DevOps workflow

---

## Part 2: Member 2 Demo (Slides 11–15)
**Duration:** 5 minutes

### Step 1: Open the Book Gallery
- **Action:** Open browser to `http://localhost:5000` (or `/index.html`).
- **Expected:** Book Gallery loads with a search bar and book grid.
- **Feature demonstrated:** Main browsing interface (`public/index.html`)

### Step 2: Search for Books
- **Action:** Click inside the search bar and type "Alice".
- **Expected:** Results filter instantly to show books matching "Alice" in title or author.
- **Action:** Clear the search and type a non-existent term like "ZZZZZ".
- **Expected:** A "No books found" message appears.
- **Feature demonstrated:** Real-time search (`controllers/bookController.js` → `searchBooks`, `public/js/books.js`)

### Step 3: Show Stock Indicators
- **Action:** Look at the colored badges below each book card.
- **Expected:**
  - Green badge with "In Stock" for books with more than 10 copies
  - Yellow badge with "X copies left" for books with 1–10 copies
  - Red badge with "Out of Stock" for books with 0 copies
- **Feature demonstrated:** Stock status logic (`models/Book.js` → `stock` field, `public/js/books.js`)

### Step 4: Add a New Book as Admin
- **Action:** Log in as admin (`admin@smartbook.com` / `admin123`).
- **Action:** Go to **Admin Console** (`/admin.html`).
- **Action:** In the **Manage Books** section, click **+ Add Book**.
- **Action:** Fill in:
  - Title: `Presentation Demo Book`
  - Author: `Member 2`
  - ISBN: `DEMO-2026-001`
  - Total Quantity: `3`
- **Action:** Click **Save**.
- **Expected:** The new book appears in the books table with stock = 3.
- **Feature demonstrated:** Admin book creation (`public/admin.html`, `controllers/bookController.js`, `models/Book.js`)

### Step 5: Edit Book Stock
- **Action:** In the Admin Console books table, find the demo book you just created.
- **Action:** Click **Edit** in the Actions column.
- **Action:** Change the Total Quantity to `5`.
- **Action:** Click **Save**.
- **Expected:** The book updates to show Total Quantity = 5 and Stock adjusts accordingly.
- **Feature demonstrated:** Book update with stock validation (`controllers/bookController.js` → `updateBook`, `models/Book.js`)

### Step 6: Delete a Book
- **Action:** In the Admin Console books table, find the demo book you just created.
- **Action:** Click **Delete** in the Actions column.
- **Expected:** Confirmation dialog appears. After confirming, the book is removed from the table and the gallery.
- **Feature demonstrated:** Book deletion (`controllers/bookController.js` → `deleteBook`)

### Step 7: Show the Book Reader
- **Action:** Log in as a regular user (or use an incognito window to register a new user).
- **Action:** Go to the Book Gallery and borrow any available book (click Interested, then Checkout).
- **Action:** Go to **My Account** (`/member.html`).
- **Action:** Find the borrowed book in **My Borrow Records** and click **Read**.
- **Expected:** The Reader page opens showing the book title, author, and full text content.
- **Action:** Click **Back to My Account**.
- **Expected:** You return to the member dashboard.
- **Feature demonstrated:** Book reader access control (`public/reader.html`, `controllers/bookController.js` → `getBookContent`, `models/Book.js` → `content`)

---

## Part 3: Member 3 Demo (Slides 16–20)
**Duration:** 5 minutes

### Step 1: Open Member Center
- **Action:** Open browser to `http://localhost:5000/member.html`.
- **If not logged in:** You will be redirected to `/login.html`. Log in with a regular user account (or register a new one).
- **Expected:** Member Center loads with three sections: My Profile, My Wishlist, and My Borrow Records.
- **Feature demonstrated:** Member dashboard (`public/member.html`)

### Step 2: View Profile
- **Action:** Look at the **My Profile** section at the top.
- **Expected:** Your name, email, and role are displayed.
- **Feature demonstrated:** Profile display via `/api/auth/me` (`controllers/authController.js`, `public/js/main.js`)

### Step 3: Add Book to Wishlist
- **Action:** Go to the Book Gallery (`/index.html`) while logged in.
- **Action:** Find any available book and click **Interested** (heart icon or button).
- **Expected:** Toast notification confirms the book was added to your wishlist.
- **Action:** Navigate back to **My Account** (`/member.html`).
- **Expected:** The book appears in the **My Wishlist** section with status "interested".
- **Feature demonstrated:** Wishlist creation (`controllers/borrowController.js` → `addInterest`, `models/BorrowRecord.js` → status: `interested`)

### Step 4: Submit Checkout Request
- **Action:** In the **My Wishlist** section, find the book you just added.
- **Action:** Click **Checkout**.
- **Expected:** Toast notification confirms the checkout request was submitted.
- **Expected:** The book moves from Wishlist to **My Borrow Records** with status "pending".
- **Feature demonstrated:** Checkout request (`controllers/borrowController.js` → `checkout`, status: `pending`)

### Step 5: Show Borrow History and State Machine
- **Action:** In **My Borrow Records**, look at the status badges.
- **Expected:** The borrowed book shows "pending" status.
- **Action:** Explain the four states: interested → pending → borrowed → returned.
- **Action:** Attempt to checkout the same book again.
- **Expected:** Error toast prevents duplicate active records.
- **Feature demonstrated:** State machine and duplicate prevention (`controllers/borrowController.js` → `validTransitions`, `models/BorrowRecord.js` compound index)

### Step 6: Return the Book
- **Action:** As the regular user, go back to **My Account** (`/member.html`).
- **Action:** In **My Borrow Records**, find the borrowed book.
- **Expected:** The book shows status "borrowed" with a **Return** button (after admin approval).
- **Action:** Click **Return**.
- **Expected:** Toast notification confirms the return. The status changes to "returned".
- **Feature demonstrated:** Return workflow (`controllers/borrowController.js` → `updateStatus`, `models/BorrowRecord.js` → status: `returned`)

### Step 7: Summary
- **Action:** Return to slides and summarize.
- **Key points to mention:**
  - Wishlist saves books for later (`interested` state)
  - Checkout creates a request (`pending` state)
  - Admin approval starts the loan (`borrowed` state)
  - Return ends the loan (`returned` state)
  - Stock updates automatically at each step
  - The member center gives users full visibility into their activity
- **Feature demonstrated:** Complete borrow lifecycle (`public/member.html`, `controllers/borrowController.js`, `models/BorrowRecord.js`)

---

## Quick Reference: Test Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@smartbook.com` | `admin123` |
| Member | Register new via `/login.html` | Any password (min 6 chars) |

## Quick Reference: Key URLs

| Page | URL |
|------|-----|
| Book Gallery | `http://localhost:5000` |
| Login / Register | `http://localhost:5000/login.html` |
| Member Center | `http://localhost:5000/member.html` |
| Admin Console | `http://localhost:5000/admin.html` |
| Book Reader | `http://localhost:5000/reader.html?id=<bookId>` |

## Troubleshooting During Demo

| Problem | Solution |
|---------|----------|
| Page shows "Loading..." forever | Check MongoDB is running (`mongod --dbpath ~/data/db`) |
| "Invalid email or password" | Use `admin@smartbook.com` / `admin123` for admin, or register a new user |
| "Access denied: Admin only" | Make sure you are logged in as admin |
| Books not showing | Run `npm run seed` to populate the database |
| Port 5000 in use | Run `pkill -f "node app.js"` and restart |

---

*Demo guide prepared for Team ERB-Team-A | Smart Book System Project*
