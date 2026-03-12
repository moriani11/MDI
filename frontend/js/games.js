document.addEventListener("DOMContentLoaded", () => {

  const hamburger = document.querySelector(".hamburger");
  const filterContent = document.querySelector(".filter-content");

  if (hamburger && filterContent) {
    hamburger.addEventListener("click", () => {
      filterContent.classList.toggle("active");
      hamburger.textContent =
        filterContent.classList.contains("active")
          ? "✕ Filters"
          : "☰ Filters";
    });
  }

  fetchGames();

});

async function fetchGames() {
  try {
    const response = await fetch("../json/games.json");
    const data = await response.json();
    displayGames(data.results);
  } catch (error) {
    console.error("Error:", error);
  }
}

function displayGames(games) {
  const gamesContainer = document.querySelector(".games-overview");

  gamesContainer.innerHTML = games
    .map((game, index) => `
      <div class="game-card" data-index="${index}">
        <img src="${game.background_image}" alt="${game.name}" class="game-image">
        <div class="game-info">
          <h3>${game.name}</h3>
          <p>⭐ ${game.rating}/5</p>
          <p>📅 ${game.released}</p>
        </div>
      </div>
    `)
    .join("");

  const gameCards = document.querySelectorAll(".game-card");

  gameCards.forEach((card, index) => {
    card.addEventListener("click", () => {

      gameCards.forEach(card => card.classList.remove("current-game"));

      card.classList.add("current-game");

      displayGameModal(games[index]);
    });
  });
}