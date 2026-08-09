/**
 * Book gallery page logic.
 * Loads and renders all books with live stock tags.
 */

/**
 * Debounce helper to limit API calls while typing.
 */
function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

/**
 * Load all books and render them in the grid.
 */
async function loadBooks() {
  const grid = document.getElementById('bookGrid');
  const countEl = document.getElementById('bookCount');

  try {
    const data = await API.getBooks();
    const books = data.books || [];

    countEl.textContent = `${books.length} book${books.length !== 1 ? 's' : ''}`;

    if (books.length === 0) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <div>📖</div>
          <p>No books available yet. Check back soon!</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = books.map(renderBookCard).join('');
  } catch (error) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <div>⚠️</div>
        <p>${error.message}</p>
      </div>
    `;
  }
}

/**
 * Render a single book card.
 */
function renderBookCard(book) {
  const stockClass = getStockClass(book.stock);
  const stockLabel = getStockLabel(book.stock);
  const isLoggedIn = API.isAuthenticated();
  const user = API.getUser();

  let actionButtons = '';

  if (isLoggedIn && user && user.role !== 'admin') {
    actionButtons = `
      <div class="book-actions" style="display: flex; gap: 0.5rem; margin-top: 0.75rem;">
        <button class="btn btn-outline btn-sm" onclick="handleInterest('${book._id}')">
          ❤️ Interested
        </button>
        <button class="btn btn-primary btn-sm" onclick="handleCheckout('${book._id}')"
          ${book.stock <= 0 ? 'disabled' : ''}>
          📥 Checkout
        </button>
      </div>
    `;
  } else if (!isLoggedIn) {
    actionButtons = `
      <div class="book-actions" style="margin-top: 0.75rem;">
        <a href="/login.html" class="btn btn-outline btn-sm btn-block">Login to Borrow</a>
      </div>
    `;
  }

  return `
    <div class="book-card">
      <div class="book-title">${escapeHtml(book.title)}</div>
      <div class="book-author">by ${escapeHtml(book.author)}</div>
      <div class="book-isbn">ISBN: ${escapeHtml(book.isbn)}</div>
      <div class="book-meta">
        <span class="stock-tag ${stockClass}">${stockLabel}</span>
        <span class="text-muted" style="font-size: 0.8rem;">Total: ${book.totalQty}</span>
      </div>
      ${actionButtons}
    </div>
  `;
}

/**
 * Handle "Interested" button click.
 */
async function handleInterest(bookId) {
  try {
    await API.addInterest(bookId);
    showAlert('Added to your wishlist!', 'success');
  } catch (error) {
    showAlert(error.message, 'danger');
  }
}

/**
 * Handle "Checkout" button click.
 */
async function handleCheckout(bookId) {
  try {
    await API.checkout(bookId);
    showAlert('Checkout request submitted!', 'success');
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

// Load books on page load
document.addEventListener('DOMContentLoaded', loadBooks);

/**
 * Search books by query string.
 */
async function searchBooks() {
  const grid = document.getElementById('bookGrid');
  const countEl = document.getElementById('bookCount');
  const query = document.getElementById('searchInput').value.trim();

  try {
    const data = await API.searchBooks(query);
    const books = data.books || [];

    countEl.textContent = `${books.length} book${books.length !== 1 ? 's' : ''}`;

    if (books.length === 0) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <div>🔍</div>
          <p>No books found matching your search.</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = books.map(renderBookCard).join('');
  } catch (error) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <div>⚠️</div>
        <p>${error.message}</p>
      </div>
    `;
  }
}

// Search input listener
const searchInput = document.getElementById('searchInput');
if (searchInput) {
  searchInput.addEventListener('input', debounce(searchBooks, 300));
}