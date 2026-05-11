document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("collectionSearch");
  if (searchInput) {
    searchInput.addEventListener("input", function () {
      const term = searchInput.value.toLowerCase();
      document.querySelectorAll(".collection-card").forEach((card) => {
        const name = card.dataset.name || "";
        card.style.display = name.includes(term) ? "" : "none";
      });
    });
  }
});
