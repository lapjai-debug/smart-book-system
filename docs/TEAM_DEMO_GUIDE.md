# Smart Book System — Demo Guide
**Step-by-Step Demonstration for Team Presentation**

This guide covers the exact steps each presenter should follow during the 5-minute demo. Open the app at `http://localhost:5000` before starting.

---

## Part 1: Team Leader Demo (Slides 1–10)
**Duration:** 5 minutes

### Step 1: Open the Application
- **Action:** Open browser and go to `http://localhost:5000`
- **Expected:** Book Gallery page loads with the navbar and book cards
- **Feature demonstrated:** System is running and accessible

### Step 2: Show the Book Gallery (Member 5’s Feature)
- **Action:** Scroll through the book grid. Point out the search bar at the top.
- **Action:** Type "Harry" in the search box.
- **Expected:** The list filters to show only books matching "Harry" in the title or author.
- **Action:** Clear the search box.
- **Expected:** All books reappear.
- **Feature demonstrated:** Real-time book search (`public/index.html`, `controllers/bookController.js`, `models/Book.js`)

### Step 3: Show Stock Status
- **Action:** Look at the colored badges under each book.
- **Expected:** Green = In Stock, Yellow = Low Stock, Red = Out of Stock.
- **Feature demonstrated:** Live stock tracking in `Book.js` and `bookController.js`

### Step 4: Demonstrate Admin Login (Member 1’s Feature)
- **Action:** Click the **Login** button in the navbar (or go to `/login.html`).
- **Action:** Enter email: `admin@smartbook.com` and password: `admin123`.
- **Action:** Click **Login**.
- **Expected:** You are redirected to the Admin Console (`/admin.html`).
- **Feature demonstrated:** JWT authentication (`public/login.html`, `controllers/authController.js`, `models/User.js`)

### Step 5: Show Admin Console (Member 4’s Feature)
- **Action:** On the Admin Console, scroll down to the **Manage Books** section.
- **Action:** Click **+ Add Book**.
- **Action:** Fill in the form:
  - Title: `Demo Book`
  - Author: `Team Demo`
  - ISBN: `DEMO-001`
  - Total Quantity: `5`
- **Action:** Click **Save**.
- **Expected:** The new book appears in the books table.
- **Feature demonstrated:** Admin book creation (`public/admin.html`, `controllers/bookController.js`, `models/Book.js`)

### Step 6: Show User Management
- **Action:** Scroll down to the **Manage Users** section in the Admin Console.
- **Action:** Click **+ Add User**.
- **Action:** Fill in the form:
  - Name: `Demo User`
  - Email: `demo@test.com`
  - Password: `demo123`
  - Role: `user`
- **Action:** Click **Create User**.
- **Expected:** The new user appears in the users table.
- **Feature demonstrated:** Admin user management (`controllers/userController.js`, `models/User.js`)

### Step 7: Show Borrow Records
- **Action:** Scroll down to the **All Borrow Records** section.
- **Expected:** A table showing all borrowing activity in the system (may be empty if no borrows yet).
- **Feature demonstrated:** Admin oversight of borrow records (`controllers/borrowController.js`, `models/BorrowRecord.js`)

### Step 8: Log Out and Show Error Handling
- **Action:** Click the **Logout** button in the navbar.
- **Expected:** You are returned to the Book Gallery and the login button reappears.
- **Feature demonstrated:** Session termination and protected route access

### Step 9: Show the Reader Page (Member 5’s Feature)
- **Action:** As a regular user, borrow any book first (see Member 3’s demo for steps), then click **Read** on the borrowed book.
- **Action:** If you cannot borrow as admin, open an incognito window, register a new user, borrow a book, and click **Read**.
- **Expected:** The Reader page opens showing the book content.
- **Action:** Click **Back to My Account**.
- **Expected:** You return to the member dashboard.
- **Feature demonstrated:** Online book reader (`public/reader.html`, `controllers/bookController.js`, `models/Book.js`)

### Step 10: Show System Architecture Summary
- **Action:** Return to the slides and summarize.
- **Key points to mention:**
  - Frontend: HTML/CSS/JS pages in `public/`
  - Backend: Express routes in `routes/`, controllers in `controllers/`
  - Database: Mongoose models in `models/`
  - Security: JWT + bcrypt in `middleware/` and `models/User.js`
  - Deployment: GitHub + Render/Vercel
- **Feature demonstrated:** Full-stack MVC architecture (`app.js`, `config/db.js`, `middleware/`)

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

### Step 4: Borrow a Book (requires login)
- **Action:** Log in as a regular user (or register a new account via `/login.html`).
- **Action:** Go back to the Book Gallery.
- **Action:** Click **Interested** on any available book.
- **Expected:** Toast message "Added to wishlist!" appears.
- **Action:** Click **Checkout** on the same book.
- **Expected:** Toast message "Checkout request submitted!" appears, and stock decreases by 1.
- **Feature demonstrated:** Borrow workflow integration (`controllers/borrowController.js`, `models/BorrowRecord.js`, `public/js/borrow.js`)

### Step 5: Read the Borrowed Book
- **Action:** Navigate to **My Account** (`/member.html`).
- **Action:** Find the borrowed book in **My Borrow Records** and click **Read**.
- **Expected:** The Reader page opens with the book title, author, and full text content.
- **Action:** Click **Back to My Account**.
- **Expected:** You return to the member dashboard.
- **Feature demonstrated:** Book reader access control (`public/reader.html`, `controllers/bookController.js` → `getBookContent`, `models/Book.js` → `content`)

### Step 6: Show Admin Book Management
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
- **Feature demonstrated:** Admin book CRUD (`public/admin.html`, `controllers/bookController.js`, `models/Book.js`)

### Step 7: Show Book Deletion
- **Action:** In the Admin Console books table, find the demo book you just created.
- **Action:** Click **Delete** in the Actions column.
- **Expected:** Confirmation dialog appears. After confirming, the book is removed from the table and the gallery.
- **Feature demonstrated:** Book deletion (`controllers/bookController.js` → `deleteBook`)

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

### Step 5: Approve Borrow (Admin Action)
- **Action:** Log in as admin in another tab or incognito window.
- **Action:** Go to **Admin Console** (`/admin.html`).
- **Action:** Scroll to **All Borrow Records**.
- **Expected:** You see the pending request from the regular user.
- **Action:** Find the action button for that record and approve it (change status to "borrowed").
- **Expected:** The record status changes to "borrowed", and the book stock decreases by 1.
- **Feature demonstrated:** Borrow approval and stock decrement (`controllers/borrowController.js` → `updateStatus`, `models/Book.js` → `stock`)

### Step 6: Return the Book
- **Action:** As the regular user, go back to **My Account** (`/member.html`).
- **Action:** In **My Borrow Records**, find the borrowed book.
- **Expected:** The book shows status "borrowed" with a **Return** button.
- **Action:** Click **Return**.
- **Expected:** Toast notification confirms the return. The status changes to "returned".
- **Expected:** The book stock increases by 1 back in the Admin Console.
- **Feature demonstrated:** Return workflow and stock increment (`controllers/borrowController.js` → `updateStatus`, `models/BorrowRecord.js` → status: `returned`)

### Step 7: Show State Machine
- **Action:** In the Admin Console borrow records table, point out the status column.
- **Expected:** Show the progression: `interested` → `pending` → `borrowed` → `returned`.
- **Action:** Attempt an invalid transition if possible (e.g., try to return a book that is still "interested").
- **Expected:** The system rejects the invalid transition with a clear error message.
- **Feature demonstrated:** Borrow state machine validation (`controllers/borrowController.js` → `validTransitions`, `models/BorrowRecord.js` → `status` enum)

### Step 8: Prevent Duplicate Requests
- **Action:** As a regular user, try to click **Interested** on the same book again.
- **Expected:** Error toast: "You already have this book in status: returned" (or current status).
- **Action:** Try clicking **Checkout** on the same book again.
- **Expected:** Error toast prevents duplicate active records.
- **Feature demonstrated:** Duplicate record prevention (`controllers/borrowController.js` → existing record check, `models/BorrowRecord.js` compound index)

### Step 9: Show Borrow History
- **Action:** In **My Borrow Records**, scroll through the list.
- **Expected:** All past and current borrows are listed with book details, status badges, and dates.
- **Feature demonstrated:** Borrow history retrieval (`controllers/borrowController.js` → `getMyRecords`, `models/BorrowRecord.js` → `borrowDate`, `returnDate`)

### Step 10: Summary
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
