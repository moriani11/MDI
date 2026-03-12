// Auth functionality
let currentUser = null;

// Hardcoded users
const users = [
  { username: 'admin', password: 'admin123', email: 'admin@gamehub.com' },
  { username: 'user', password: 'user123', email: 'user@gamehub.com' },
  { username: 'test', password: 'test123', email: 'test@gamehub.com' }
];

function login(usernameOrEmail, password) {
  const user = users.find(u => 
    (u.username === usernameOrEmail || u.email === usernameOrEmail) && u.password === password
  );
  if (user) {
    currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(user));
    return { success: true, message: 'Login successful!' };
  }
  return { success: false, message: 'Invalid username/email or password' };
}

function register(username, password, email) {
  // Check if user already exists
  if (users.find(u => u.username === username)) {
    return { success: false, message: 'Username already exists' };
  }
  
  // Add new user
  const newUser = { username, password, email };
  users.push(newUser);
  currentUser = newUser;
  localStorage.setItem('currentUser', JSON.stringify(newUser));
  return { success: true, message: 'Registration successful!' };
}

function logout() {
  currentUser = null;
  localStorage.removeItem('currentUser');
  window.location.href = 'pages/login.html';
}

function isLoggedIn() {
  if (!currentUser) {
    const saved = localStorage.getItem('currentUser');
    if (saved) {
      currentUser = JSON.parse(saved);
    }
  }
  return currentUser !== null;
}

function getCurrentUser() {
  return currentUser;
}

// Check auth on page load
document.addEventListener('DOMContentLoaded', function() {
  if (!isLoggedIn() && !window.location.pathname.includes('login.html') && !window.location.pathname.includes('registration.html')) {
    // Redirect to login if not logged in (except on auth pages)
    // window.location.href = 'pages/login.html';
  }
});

// Project disabled message
function showProjectDisabledMessage() {
  const modal = document.createElement('div');
  modal.className = 'project-disabled-modal';
  modal.innerHTML = `
    <div class="modal-content">
      <h3>🚫 Project Disabled</h3>
      <p>This project is currently disabled and not available.</p>
      <p>Please contact the administrator for more information.</p>
      <button onclick="closeProjectModal()">Close</button>
    </div>
  `;
  document.body.appendChild(modal);
}

function closeProjectModal() {
  const modal = document.querySelector('.project-disabled-modal');
  if (modal) {
    modal.remove();
  }
}
