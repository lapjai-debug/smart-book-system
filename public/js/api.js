/**
 * Centralized API wrapper.
 * Automatically attaches the JWT Authorization header to every request.
 */
const API = {
  baseURL: '/api',

  /**
   * Get the stored token from localStorage.
   */
  getToken() {
    return localStorage.getItem('token');
  },

  /**
   * Store the token in localStorage.
   */
  setToken(token) {
    localStorage.setItem('token', token);
  },

  /**
   * Remove the token from localStorage (logout).
   */
  clearToken() {
    localStorage.removeItem('token');
  },

  /**
   * Get the logged-in user object from localStorage.
   */
  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  /**
   * Store the user object in localStorage.
   */
  setUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
  },

  /**
   * Clear all auth data.
   */
  clearAuth() {
    this.clearToken();
    localStorage.removeItem('user');
  },

  /**
   * Check if the user is logged in.
   */
  isAuthenticated() {
    return !!this.getToken();
  },

  /**
   * Core request method.
   * @param {string} endpoint - API endpoint (e.g. '/auth/login')
   * @param {object} options - fetch options (method, body, etc.)
   */
  async request(endpoint, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    };

    // Attach Authorization header if a token exists
    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
      method: options.method || 'GET',
      headers,
      ...options,
    };

    // Stringify body if it's an object
    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, config);

    // Parse JSON response
    let data = null;
    try {
      data = await response.json();
    } catch (e) {
      data = { message: 'Invalid response from server' };
    }

    // Handle 401 - token expired or invalid
    if (response.status === 401 && this.isAuthenticated()) {
      this.clearAuth();
      window.location.href = '/login.html';
      throw new Error('Session expired. Please login again.');
    }

    if (!response.ok) {
      const error = new Error(data.message || 'Request failed');
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  },

  // ===== Auth endpoints =====
  register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: userData,
    });
  },

  login(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      body: credentials,
    });
  },

  getMe() {
    return this.request('/auth/me');
  },

  // ===== Book endpoints =====
  getBooks() {
    return this.request('/books');
  },

  searchBooks(query = '') {
    return this.request(`/books/search?q=${encodeURIComponent(query)}`);
  },

  getBook(id) {
    return this.request(`/books/${id}`);
  },

  getBookContent(id) {
    return this.request(`/books/${id}/read`);
  },

  createBook(bookData) {
    return this.request('/books', {
      method: 'POST',
      body: bookData,
    });
  },

  updateBook(id, bookData) {
    return this.request(`/books/${id}`, {
      method: 'PUT',
      body: bookData,
    });
  },

  deleteBook(id) {
    return this.request(`/books/${id}`, {
      method: 'DELETE',
    });
  },

  // ===== Borrow endpoints =====
  addInterest(bookId) {
    return this.request('/borrow/interest', {
      method: 'POST',
      body: { bookId },
    });
  },

  checkout(bookId) {
    return this.request('/borrow/checkout', {
      method: 'POST',
      body: { bookId },
    });
  },

  updateBorrowStatus(id, status) {
    return this.request(`/borrow/status/${id}`, {
      method: 'PUT',
      body: { status },
    });
  },

  getMyRecords() {
    return this.request('/borrow/my-records');
  },

  getAllRecords() {
    return this.request('/borrow/all');
  },

  // ===== User management endpoints (admin only) =====
  getUsers() {
    return this.request('/users');
  },

  createUser(userData) {
    return this.request('/users', {
      method: 'POST',
      body: userData,
    });
  },

  deleteUser(id) {
    return this.request(`/users/${id}`, {
      method: 'DELETE',
    });
  },
};
