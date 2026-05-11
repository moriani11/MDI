document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.querySelector(".hamburger");
  const filterContent = document.querySelector(".filter-content");
  if (hamburger && filterContent) {
    hamburger.addEventListener("click", () => {
      filterContent.classList.toggle("active");
      hamburger.textContent = filterContent.classList.contains("active") ? "✕ Filters" : "☰ Filters";
    });
  }
  
});
