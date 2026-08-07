/**
 * Member page logic.
 * Displays user profile, wishlist, and borrow records.
 */

/**
 * Load the user's profile and borrow records.
 */
async function loadMemberPage() {
  // Redirect to login if not authenticated
  if (!API.isAuthenticated()) {
    window.location.href = '/login.html';
    return;
  }

  try {
    // Load profile
    const meData = await API.getMe();
    renderProfile(meData.user);

    // Load borrow records
    const recordsData = await API.getMyRecords();
    renderRecords(recordsData.records);
  } catch (error) {
    showAlert(error.message, 'danger');
  }
}

/**
 * Render the user profile section.
 */
function renderProfile(user) {
  const container = document.getElementById('profileInfo');

  container.innerHTML = `
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
      <div>
        <div style="font-size: 0.8rem; color: var(--text-light);">Name</div>
        <div style="font-weight: 600;">${escapeHtml(user.name)}</div>
      </div>
      <div>
        <div style="font-size: 0.8rem; color: var(--text-light);">Email</div>
        <div style="font-weight: 600;">${escapeHtml(user.email)}</div>
      </div>
      <div>
        <div style="font-size: 0.8rem; color: var(--text-light);">Role</div>
        <div>
          <span class="badge ${user.role === 'admin' ? 'badge-borrowed' : 'badge-interested'}">
            ${user.role}
          </span>
        </div>
      </div>
      <div>
        <div style="font-size: 0.8rem; color: var(--text-light);">Member Since</div>
        <div style="font-weight: 600;">${formatDate(user.createdAt)}</div>
      </div>
    </div>
  `;
}

/**
 * Render wishlist and borrow records.
 */
function renderRecords(records) {
  const wishlistContainer = document.getElementById('wishlistRecords');
  const recordsContainer = document.getElementById('borrowRecords');
  const wishlistCount = document.getElementById('wishlistCount');
  const recordsCount = document.getElementById('recordsCount');

  // Filter records by status
  const wishlist = records.filter((r) => r.status === 'interested');
  const active = records.filter((r) => r.status === 'pending' || r.status === 'borrowed');
  const history = records.filter((r) => r.status === 'returned');

  wishlistCount.textContent = `${wishlist.length} item${wishlist.length !== 1 ? 's' : ''}`;
  recordsCount.textContent = `${active.length} active, ${history.length} returned`;

  // Render wishlist
  if (wishlist.length === 0) {
    wishlistContainer.innerHTML = `
      <div class="empty-state">
        <div>💭</div>
        <p>No books in your wishlist yet.</p>
        <a href="/index.html" class="btn btn-primary btn-sm" style="margin-top: 0.5rem;">Browse Books</a>
      </div>
    `;
  } else {
    wishlistContainer.innerHTML = `
      <div style="overflow-x: auto;">
        <table class="table">
          <thead>
            <tr>
              <th>Book</th>
              <th>Author</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${wishlist.map(renderWishlistRow).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  // Render active + history records
  const allDisplayRecords = [...active, ...history];
  if (allDisplayRecords.length === 0) {
    recordsContainer.innerHTML = `
      <div class="empty-state">
        <div>📚</div>
        <p>No borrow records yet.</p>
        <a href="/index.html" class="btn btn-primary btn-sm" style="margin-top: 0.5rem;">Browse Books</a>
      </div>
    `;
  } else {
    recordsContainer.innerHTML = `
      <div style="overflow-x: auto;">
        <table class="table">
          <thead>
            <tr>
              <th>Book</th>
              <th>Author</th>
              <th>Status</th>
              <th>Borrow Date</th>
              <th>Return Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${allDisplayRecords.map(renderRecordRow).join('')}
          </tbody>
        </table>
      </div>
    `;
  }
}

/**
 * Render a wishlist row.
 */
function renderWishlistRow(record) {
  const book = record.bookId || {};
  return `
    <tr>
      <td><strong>${escapeHtml(book.title || 'Unknown')}</strong></td>
      <td>${escapeHtml(book.author || '-')}</td>
      <td><span class="badge ${getStatusBadgeClass(record.status)}">${record.status}</span></td>
      <td>
        <button class="btn btn-primary btn-sm" onclick="handleCheckoutRequest('${record._id}')">
          Request Checkout
        </button>
      </td>
    </tr>
  `;
}

/**
 * Render a borrow record row.
 */
function renderRecordRow(record) {
  const book = record.bookId || {};
  let actionButtons = '';

  if (record.status === 'pending') {
    actionButtons = `
      <button class="btn btn-success btn-sm" onclick="handleBorrow('${record._id}')">
        Confirm Borrow
      </button>
    `;
  } else if (record.status === 'borrowed') {
    actionButtons = `
      <div style="display: flex; gap: 0.5rem;">
        <button class="btn btn-primary btn-sm" onclick="handleReadBook('${book._id}')">
          📖 Read
        </button>
        <button class="btn btn-warning btn-sm" onclick="handleReturn('${record._id}')">
          Return Book
        </button>
      </div>
    `;
  } else {
    actionButtons = '<span style="color: var(--text-light); font-size: 0.85rem;">Completed</span>';
  }

  return `
    <tr>
      <td><strong>${escapeHtml(book.title || 'Unknown')}</strong></td>
      <td>${escapeHtml(book.author || '-')}</td>
      <td><span class="badge ${getStatusBadgeClass(record.status)}">${record.status}</span></td>
      <td>${formatDate(record.borrowDate)}</td>
      <td>${formatDate(record.returnDate)}</td>
      <td>${actionButtons}</td>
    </tr>
  `;
}

/**
 * Handle checkout request from wishlist.
 */
async function handleCheckoutRequest(recordId) {
  try {
    // Get the bookId from the record - we need to find it in the DOM context
    // Instead, we'll use the record's bookId from the stored records
    const recordsData = await API.getMyRecords();
    const record = recordsData.records.find((r) => r._id === recordId);
    if (!record) {
      throw new Error('Record not found');
    }

    await API.checkout(record.bookId._id);
    showAlert('Checkout request submitted!', 'success');
    setTimeout(() => loadMemberPage(), 1000);
  } catch (error) {
    showAlert(error.message, 'danger');
  }
}

/**
 * Confirm borrow (pending -> borrowed).
 */
async function handleBorrow(recordId) {
  try {
    await API.updateBorrowStatus(recordId, 'borrowed');
    showAlert('Book borrowed successfully!', 'success');
    setTimeout(() => loadMemberPage(), 1000);
  } catch (error) {
    showAlert(error.message, 'danger');
  }
}

/**
 * Open the book reader page.
 */
function handleReadBook(bookId) {
  window.location.href = `/reader.html?id=${bookId}`;
}

/**
 * Return a book (borrowed -> returned).
 */
async function handleReturn(recordId) {
  try {
    await API.updateBorrowStatus(recordId, 'returned');
    showAlert('Book returned successfully!', 'success');
    setTimeout(() => loadMemberPage(), 1000);
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

// Load member page on DOM ready
document.addEventListener('DOMContentLoaded', loadMemberPage);