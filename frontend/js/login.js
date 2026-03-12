// Login page functionality
document.addEventListener('DOMContentLoaded', function() {
  const loginForm = document.querySelector('.login');
  
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      
      // Try login with full email first, then with username
      let result = login(email, password);
      
      // If that fails, try with username part (for hardcoded accounts)
      if (!result.success) {
        const username = email.split('@')[0];
        result = login(username, password);
      }
      
      if (result.success) {
        alert(result.message);
        window.location.href = '../index.html';
      } else {
        alert(result.message);
      }
    });
  }
});
