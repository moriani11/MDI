// Header navigation functionality
document.addEventListener('DOMContentLoaded', function() {
  setupMobileMenu();
});

function setupMobileMenu() {
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function() {
      navMenu.classList.toggle('active');
      navToggle.textContent = navMenu.classList.contains('active') ? '✕' : '☰';
    });
  }
}


