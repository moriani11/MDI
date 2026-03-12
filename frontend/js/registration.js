// Registration page functionality
document.addEventListener('DOMContentLoaded', function() {
  const registrationForm = document.querySelector('.registration');
  
  if (registrationForm) {
    registrationForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const username = document.getElementById('username').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirm-password').value;
      
      // Validate passwords match
      if (password !== confirmPassword) {
        alert('Wachtwoorden komen niet overeen!');
        return;
      }
      
      // Validate password length
      if (password.length < 8) {
        alert('Wachtwoord moet minimaal 8 karakters lang zijn!');
        return;
      }
      
      // Attempt registration
      const result = register(username, password, email);
      
      if (result.success) {
        alert(result.message);
        window.location.href = '../index.html';
      } else {
        alert(result.message);
      }
    });
  }
});
