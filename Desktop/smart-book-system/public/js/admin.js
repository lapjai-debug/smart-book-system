/**
 * Admin console logic.
 * Handles book CRUD operations and borrow record management.
 */

/**
 * Initialize the admin page.
 */
async function loadAdminPage() {
  // Redirect to login if not authenticated
  if (!API.isAuthenticated()) {
    window.location.href = '/login.html';
    return;
  }

  // Verify admin role
  const user = API.getUser();
  if (!user || user.role !== 'admin') {
    showAlert('Access denied: Admin only', 'danger');
    setTimeout(() => {
      window.location.href = '/index.html';
    }, 1500);
    return;
  }

  try {
    await Promise.all([loadBooks(), loadUsers(), loadAllRecords()]);
  } catch (error) {
    showAlert(error.message, 'danger');
  }
}

/**
 * Load all books into the admin table.
 */
async function loadBooks() {
  const tbody = document.getElementById('booksTableBody');

  try {
    const data = await API.getBooks();
    const books = data.books || [];

    if (books.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" class="empty-state">No books found. Click "+ Add Book" to create one.</td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = books.map(renderAdminBookRow).join('');
  } catch (error) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="empty-state">${error.message}</td>
      </tr>
    `;
  }
}

/**
 * Render a book row in the admin table.
 */
function renderAdminBookRow(book) {
  const stockClass = getStockClass(book.stock);
  const stockLabel = getStockLabel(book.stock);

  return `
    <tr>
      <td><strong>${escapeHtml(book.title)}</strong></td>
      <td>${escapeHtml(book.author)}</td>
      <td>${escapeHtml(book.isbn)}</td>
      <td>${book.totalQty}</td>
      <td><span class="stock-tag ${stockClass}">${stockLabel}</span></td>
      <td>
        <div style="display: flex; gap: 0.5rem;">
          <button class="btn btn-warning btn-sm" onclick="openEditBookModal('${book._id}')">Edit</button>
          <button class="btn btn-danger btn-sm" onclick="handleDeleteBook('${book._id}')">Delete</button>
        </div>
      </td>
    </tr>
  `;
}

/**
 * Load all users into the admin table.
 */
async function loadUsers() {
  const tbody = document.getElementById('usersTableBody');

  try {
    const data = await API.getUsers();
    const users = data.users || [];

    if (users.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="5" class="empty-state">No users found.</td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = users.map(renderAdminUserRow).join('');
  } catch (error) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" class="empty-state">${error.message}</td>
      </tr>
    `;
  }
}

/**
 * Render a user row in the admin table.
 */
function renderAdminUserRow(user) {
  const currentUserId = API.getUser() ? API.getUser()._id : null;
  const isSelf = user._id === currentUserId;

  return `
    <tr>
      <td><strong>${escapeHtml(user.name)}</strong></td>
      <td>${escapeHtml(user.email)}</td>
      <td>
        <span class="badge ${user.role === 'admin' ? 'badge-borrowed' : 'badge-interested'}">
          ${user.role}
        </span>
      </td>
      <td>${formatDate(user.createdAt)}</td>
      <td>
        ${isSelf
          ? '<span style="color: var(--text-light); font-size: 0.85rem;">Current Admin</span>'
          : `<button class="btn btn-danger btn-sm" onclick="handleDeleteUser('${user._id}')">Delete</button>`
        }
      </td>
    </tr>
  `;
}

/**
 * Open the modal to add a new user.
 */
function openAddUserModal() {
  document.getElementById('userModal').classList.add('active');
  document.getElementById('userName').value = '';
  document.getElementById('userEmail').value = '';
  document.getElementById('userPassword').value = '';
  document.getElementById('userRole').value = 'user';
}

/**
 * Close the add user modal.
 */
function closeUserModal() {
  document.getElementById('userModal').classList.remove('active');
}

/**
 * Handle user form submission (create user).
 */
async function handleUserSubmit(event) {
  event.preventDefault();

  const name = document.getElementById('userName').value.trim();
  const email = document.getElementById('userEmail').value.trim();
  const password = document.getElementById('userPassword').value;
  const role = document.getElementById('userRole').value;

  try {
    await API.createUser({ name, email, password, role });
    showAlert('User created successfully!', 'success');
    closeUserModal();
    await loadUsers();
  } catch (error) {
    showAlert(error.message, 'danger');
  }
}

/**
 * Handle user deletion.
 */
async function handleDeleteUser(userId) {
  if (!confirm('Are you sure you want to delete this user? This will also delete their borrow records.')) {
    return;
  }

  try {
    await API.deleteUser(userId);
    showAlert('User deleted successfully!', 'success');
    await loadUsers();
  } catch (error) {
    showAlert(error.message, 'danger');
  }
}

/**
 * Load all borrow records into the admin table.
 */
async function loadAllRecords() {
  const tbody = document.getElementById('recordsTableBody');
  const countEl = document.getElementById('allRecordsCount');

  try {
    const data = await API.getAllRecords();
    const records = data.records || [];

    countEl.textContent = `${records.length} record${records.length !== 1 ? 's' : ''}`;

    if (records.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" class="empty-state">No borrow records yet.</td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = records.map(renderAdminRecordRow).join('');
  } catch (error) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="empty-state">${error.message}</td>
      </tr>
    `;
  }
}

/**
 * Render a borrow record row in the admin table.
 */
function renderAdminRecordRow(record) {
  const user = record.userId || {};
  const book = record.bookId || {};
  let actionButtons = '';

  if (record.status === 'pending') {
    actionButtons = `
      <button class="btn btn-success btn-sm" onclick="handleAdminBorrow('${record._id}')">
        Approve Borrow
      </button>
    `;
  } else if (record.status === 'borrowed') {
    actionButtons = `
      <button class="btn btn-warning btn-sm" onclick="handleAdminReturn('${record._id}')">
        Mark Returned
      </button>
    `;
  } else if (record.status === 'interested') {
    actionButtons = `
      <button class="btn btn-primary btn-sm" onclick="handleAdminCheckout('${record._id}')">
        Approve Checkout
      </button>
    `;
  } else {
    actionButtons = '<span style="color: var(--text-light); font-size: 0.85rem;">Completed</span>';
  }

  return `
    <tr>
      <td>
        <strong>${escapeHtml(user.name || 'Unknown')}</strong><br>
        <small style="color: var(--text-light);">${escapeHtml(user.email || '')}</small>
      </td>
      <td>
        <strong>${escapeHtml(book.title || 'Unknown')}</strong><br>
        <small style="color: var(--text-light);">${escapeHtml(book.author || '')}</small>
      </td>
      <td><span class="badge ${getStatusBadgeClass(record.status)}">${record.status}</span></td>
      <td>${formatDate(record.borrowDate)}</td>
      <td>${formatDate(record.returnDate)}</td>
      <td>${actionButtons}</td>
    </tr>
  `;
}

/**
 * Open the modal to add a new book.
 */
function openAddBookModal() {
  document.getElementById('bookModalTitle').textContent = 'Add Book';
  document.getElementById('bookSubmitBtn').textContent = 'Create Book';
  document.getElementById('bookFormId').value = '';
  document.getElementById('bookTitle').value = '';
  document.getElementById('bookAuthor').value = '';
  document.getElementById('bookIsbn').value = '';
  document.getElementById('bookTotalQty').value = '1';
  document.getElementById('bookStock').value = '';
  document.getElementById('stockOverrideGroup').style.display = 'none';
  document.getElementById('bookModal').classList.add('active');
}

/**
 * Open the modal to edit an existing book.
 */
async function openEditBookModal(bookId) {
  try {
    const data = await API.getBook(bookId);
    const book = data.book;

    document.getElementById('bookModalTitle').textContent = 'Edit Book';
    document.getElementById('bookSubmitBtn').textContent = 'Update Book';
    document.getElementById('bookFormId').value = book._id;
    document.getElementById('bookTitle').value = book.title;
    document.getElementById('bookAuthor').value = book.author;
    document.getElementById('bookIsbn').value = book.isbn;
    document.getElementById('bookTotalQty').value = book.totalQty;
    document.getElementById('bookStock').value = book.stock;
    document.getElementById('stockOverrideGroup').style.display = 'block';
    document.getElementById('bookModal').classList.add('active');
  } catch (error) {
    showAlert(error.message, 'danger');
  }
}

/**
 * Close the book modal.
 */
function closeBookModal() {
  document.getElementById('bookModal').classList.remove('active');
}

/**
 * Handle book form submission (create or update).
 */
async function handleBookSubmit(event) {
  event.preventDefault();

  const bookId = document.getElementById('bookFormId').value;
  const title = document.getElementById('bookTitle').value.trim();
  const author = document.getElementById('bookAuthor').value.trim();
  const isbn = document.getElementById('bookIsbn').value.trim();
  const totalQty = parseInt(document.getElementById('bookTotalQty').value, 10);
  const stockInput = document.getElementById('bookStock').value;
  const stock = stockInput !== '' ? parseInt(stockInput, 10) : undefined;

  try {
    if (bookId) {
      // Update existing book
      const payload = { title, author, isbn, totalQty };
      if (stock !== undefined) {
        payload.stock = stock;
      }
      await API.updateBook(bookId, payload);
      showAlert('Book updated successfully!', 'success');
    } else {
      // Create new book
      await API.createBook({ title, author, isbn, totalQty });
      showAlert('Book created successfully!', 'success');
    }

    closeBookModal();
    await loadBooks();
  } catch (error) {
    showAlert(error.message, 'danger');
  }
}

/**
 * Handle book deletion.
 */
async function handleDeleteBook(bookId) {
  if (!confirm('Are you sure you want to delete this book?')) {
    return;
  }

  try {
    await API.deleteBook(bookId);
    showAlert('Book deleted successfully!', 'success');
    await loadBooks();
  } catch (error) {
    showAlert(error.message, 'danger');
  }
}

/**
 * Admin: approve checkout request (interested -> pending).
 */
async function handleAdminCheckout(recordId) {
  try {
    await API.updateBorrowStatus(recordId, 'pending');
    showAlert('Checkout request approved!', 'success');
    await loadAllRecords();
  } catch (error) {
    showAlert(error.message, 'danger');
  }
}

/**
 * Admin: approve borrow (pending -> borrowed).
 */
async function handleAdminBorrow(recordId) {
  try {
    await API.updateBorrowStatus(recordId, 'borrowed');
    showAlert('Borrow approved! Stock decremented.', 'success');
    await Promise.all([loadBooks(), loadAllRecords()]);
  } catch (error) {
    showAlert(error.message, 'danger');
  }
}

/**
 * Admin: mark a book as returned (borrowed -> returned).
 */
async function handleAdminReturn(recordId) {
  try {
    await API.updateBorrowStatus(recordId, 'returned');
    showAlert('Book marked as returned! Stock incremented.', 'success');
    await Promise.all([loadBooks(), loadAllRecords()]);
  } catch (error) {
    showAlert(error.message, 'danger');
  }
}

/**
 * Escape HTML to prevent XSS.
 */
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// Load admin page on DOM ready
document.addEventListener('DOMContentLoaded', loadAdminPage);
