/**
 * Book reader page logic.
 * Loads and displays the content of a borrowed book.
 */

/**
 * Get the book ID from the URL query parameter.
 */
function getBookIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

/**
 * Load and display the book content.
 */
async function loadReader() {
  // Redirect to login if not authenticated
  if (!API.isAuthenticated()) {
    window.location.href = '/login.html';
    return;
  }

  const bookId = getBookIdFromUrl();
  if (!bookId) {
    showAlert('No book specified', 'danger');
    document.getElementById('readerContent').innerHTML = `
      <div class="empty-state">
        <div>📖</div>
        <p>No book was specified. Please go back and select a book.</p>
        <a href="/member.html" class="btn btn-primary btn-sm" style="margin-top: 0.5rem;">Back to My Account</a>
      </div>
    `;
    return;
  }

  const titleEl = document.getElementById('readerTitle');
  const authorEl = document.getElementById('readerAuthor');
  const contentEl = document.getElementById('readerContent');

  try {
    const data = await API.getBookContent(bookId);
    const book = data.book;

    // Set header
    titleEl.textContent = book.title;
    authorEl.textContent = `by ${book.author}`;
    document.title = `${book.title} - Smart Book System`;

    // Set content
    if (book.content && book.content.trim()) {
      contentEl.innerHTML = `
        <div style="max-width: 800px; margin: 0 auto; line-height: 1.8; font-size: 1.05rem;">
          ${formatContent(book.content)}
        </div>
      `;
    } else {
      contentEl.innerHTML = `
        <div class="empty-state">
          <div>📄</div>
          <p>No content available for this book yet.</p>
        </div>
      `;
    }
  } catch (error) {
    titleEl.textContent = 'Access Denied';
    authorEl.textContent = '';
    contentEl.innerHTML = `
      <div class="empty-state">
        <div>🔒</div>
        <p>${error.message}</p>
        <a href="/member.html" class="btn btn-primary btn-sm" style="margin-top: 0.5rem;">Back to My Account</a>
      </div>
    `;
  }
}

/**
 * Format book content: preserve paragraphs and escape HTML.
 */
function formatContent(content) {
  // Escape HTML to prevent XSS
  const escaped = escapeHtml(content);

  // Split into paragraphs and wrap in <p> tags
  return escaped
    .split(/\n\s*\n/)
    .map((para) => para.trim())
    .filter((para) => para.length > 0)
    .map((para) => `<p style="margin-bottom: 1.25rem;">${para.replace(/\n/g, '<br>')}</p>`)
    .join('');
}

/**
 * Escape HTML to prevent XSS.
 */
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// Load reader on DOM ready
document.addEventListener('DOMContentLoaded', loadReader);