let allGames = [];

let collectionGames = [];

document.addEventListener("DOMContentLoaded", function () {
  loadCollection();

  loadGames();

  setupEventListeners();
});

async function loadGames() {
  try {
    const response = await fetch("../json/games.json");

    const data = await response.json();

    allGames = data.results;

    displayCollection();
  } catch (error) {
    console.error("Error loading games:", error);
  }
}

function loadCollection() {
  collectionGames = getCollection();

  updateStats();
}

function setupEventListeners() {
  const searchInput = document.getElementById("collectionSearch");

  if (searchInput) {
    searchInput.addEventListener("input", function () {
      displayCollection(searchInput.value);
    });
  }

  const clearBtn = document.querySelector(".clear-collection");

  if (clearBtn) {
    clearBtn.addEventListener("click", function () {
      if (confirm("Are you sure you want to clear your entire collection?")) {
        localStorage.removeItem("gameCollection");

        collectionGames = [];

        displayCollection();

        updateStats();
      }
    });
  }
}

let filteredGames = [];

function displayCollection(searchTerm = "") {
  const container = document.getElementById("collectionGames");

  filteredGames = allGames.filter(
    (game) =>
      collectionGames.includes(game.id.toString()) &&
      (searchTerm === "" ||
        game.name.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  if (filteredGames.length === 0) {
    container.innerHTML = `

      <div class="empty-collection">

        <h2>🎮 Jouw collectie is leeg!</h2>

        <p>Begin games toe te voegen vanaf de <a href="games.html">games pagina</a> om jou collectie te bouwen.</p>

      </div>

    `;
  } else {
    container.innerHTML = filteredGames

      .map(
        (game, index) => `

      <div class="game-card collection-card" data-index="${index}">

        <img src="${game.background_image}" alt="${game.name}" class="game-image">

        <div class="game-info">

          <h3>${game.name}</h3>

          <p>⭐ ${game.rating}/5</p>

          <p>📅 ${game.released}</p>

          <button class="remove-from-collection" onclick="removeFromCollection('${game.id}')">

            🗑️

          </button>

        </div>

      </div>

    `,
      )

      .join("");
  }
}

document.getElementById("collectionGames").addEventListener("click", function (event) {
  const card = event.target.closest(".collection-card");
  const deleteBtn = event.target.closest(".remove-from-collection");

  if (card && !deleteBtn) {
    const index = Number(card.dataset.index);

    if (!Number.isNaN(index) && filteredGames[index]) {
      displayGameModal(filteredGames[index]);
    }
  }
});

function updateStats() {
  const totalGamesEl = document.getElementById("totalGames");
  if (totalGamesEl) {
    totalGamesEl.textContent = collectionGames.length;
  }
}
