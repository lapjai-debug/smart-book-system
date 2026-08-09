/**
 * Shared frontend helpers: navigation, auth state, and UI utilities.
 */

/**
 * Render the navigation bar based on authentication state.
 */
function renderNav() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const user = API.getUser();
  const isLoggedIn = API.isAuthenticated();

  let links = `
    <a href="/index.html">Books</a>
  `;

  if (isLoggedIn && user) {
    links += `
      <a href="/member.html">My Account</a>
    `;
    if (user.role === 'admin') {
      links += `
        <a href="/admin.html">Admin</a>
      `;
    }
    links += `
      <button class="btn-logout" onclick="handleLogout()">Logout</button>
    `;
  } else {
    links += `
      <a href="/login.html">Login / Register</a>
    `;
  }

  navbar.innerHTML = `
    <a href="/index.html" class="navbar-brand">Smart<span>Book</span> System</a>
    <nav class="nav-links">${links}</nav>
  `;
}

/**
 * Logout handler: clears auth data and redirects to home.
 */
function handleLogout() {
  API.clearAuth();
  window.location.href = '/index.html';
}

/**
 * Show an alert message in a container.
 * @param {string} message - The message to display
 * @param {string} type - 'success' | 'danger' | 'info'
 * @param {string} containerId - The id of the container element
 */
function showAlert(message, type = 'danger', containerId = 'alertContainer') {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <div class="alert alert-${type}">${message}</div>
  `;

  // Auto-hide after 5 seconds
  setTimeout(() => {
    container.innerHTML = '';
  }, 5000);
}

/**
 * Format a date string for display.
 */
function formatDate(dateString) {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Get the CSS class for a stock level.
 */
function getStockClass(stock) {
  if (stock <= 0) return 'stock-out';
  if (stock <= 3) return 'stock-low';
  return 'stock-available';
}

/**
 * Get the label for a stock level.
 */
function getStockLabel(stock) {
  if (stock <= 0) return 'Out of Stock';
  if (stock <= 3) return `Low (${stock} left)`;
  return `${stock} Available`;
}

/**
 * Get the badge class for a borrow status.
 */
function getStatusBadgeClass(status) {
  return `badge-${status}`;
}

/**
 * Initialize the page: render nav and set up common behaviors.
 */
function initPage() {
  renderNav();
}

// Run on DOM ready
document.addEventListener('DOMContentLoaded', initPage);