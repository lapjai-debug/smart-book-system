/**
 * Login/Register page logic.
 * Handles form submission, token storage, and tab switching.
 */

/**
 * Switch between login and register tabs.
 */
function switchTab(tab) {
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const tabLogin = document.getElementById('tabLogin');
  const tabRegister = document.getElementById('tabRegister');

  if (tab === 'login') {
    loginForm.style.display = 'block';
    registerForm.style.display = 'none';
    tabLogin.classList.add('active');
    tabRegister.classList.remove('active');
  } else {
    loginForm.style.display = 'none';
    registerForm.style.display = 'block';
    tabLogin.classList.remove('active');
    tabRegister.classList.add('active');
  }

  // Clear any previous alerts
  document.getElementById('alertContainer').innerHTML = '';
}

/**
 * Handle login form submission.
 */
async function handleLogin(event) {
  event.preventDefault();

  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;

  try {
    const data = await API.login({ email, password });

    // Store token and user data
    API.setToken(data.token);
    API.setUser(data.user);

    showAlert('Login successful! Redirecting...', 'success');

    // Redirect based on role
    setTimeout(() => {
      if (data.user.role === 'admin') {
        window.location.href = '/admin.html';
      } else {
        window.location.href = '/index.html';
      }
    }, 1000);
  } catch (error) {
    showAlert(error.message, 'danger');
  }
}

/**
 * Handle register form submission.
 */
async function handleRegister(event) {
  event.preventDefault();

  const name = document.getElementById('regName').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const password = document.getElementById('regPassword').value;

  try {
    const data = await API.register({ name, email, password });

    // Store token and user data
    API.setToken(data.token);
    API.setUser(data.user);

    showAlert('Account created! Redirecting...', 'success');

    setTimeout(() => {
      window.location.href = '/index.html';
    }, 1000);
  } catch (error) {
    showAlert(error.message, 'danger');
  }
}

// If already logged in, redirect to home
document.addEventListener('DOMContentLoaded', () => {
  if (API.isAuthenticated()) {
    window.location.href = '/index.html';
  }
});