document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.querySelector(".hamburger");
  const filterContent = document.querySelector(".filter-content");

  if (hamburger && filterContent) {
    hamburger.addEventListener("click", () => {
      filterContent.classList.toggle("active");
      hamburger.textContent = filterContent.classList.contains("active")
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
    setupGenreFilters(data.results);
    GetGamesName(data.results);
    getGame(data.results);
    Reset(data.results);
  } catch (error) {
    console.error("Error:", error);
  }
}

function GetGamesName(games) {
  const datalist = document.querySelector("#gameList");

  games.forEach((element) => {
    const option = document.createElement("option");

    option.value = element.name;

    datalist.appendChild(option);
  });
}

function displayGames(games) {
  const gamesContainer = document.querySelector(".games-overview");

  gamesContainer.innerHTML = games
    .map(
      (game, index) => `
      <div class="game-card" data-index="${index}">
        <img src="${game.background_image}" alt="${game.name}" class="game-image">
        <div class="game-info">
          <h3>${game.name}</h3>
          <p>⭐ ${game.rating}/5</p>
          <p>📅 ${game.released}</p>
        </div>
      </div>
    `,
    )
    .join("");

  const gameCards = document.querySelectorAll(".game-card");

  gameCards.forEach((card, index) => {
    card.addEventListener("click", () => {
      gameCards.forEach((card) => card.classList.remove("current-game"));

      card.classList.add("current-game");

      displayGameModal(games[index]);
    });
  });
}

function setupGenreFilters(games) {
  const genreCheckboxes = document.querySelectorAll('input[name="genre"]');

  genreCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      if (checkbox.checked) {
        const filteredGames = games.filter((game) =>
          game.genres.map((g) => g.slug).includes(checkbox.value),
        );

        displayGames(filteredGames);
      } else {
        displayGames(games);
      }
    });
  });
}

function getGame(games) {
  const getGameFromInput = document.querySelector(".getGame");

  getGameFromInput.addEventListener("input", () => {
    let nameOfGame = getGameFromInput.value;

    const filterGameBySearch = games.filter((el) => el.name === nameOfGame);

    displayGames(filterGameBySearch);
  });
}

function Reset(games) {
  const emptyInput = document.querySelector(".getGame");
  const resetButton = document.querySelector(".reset-filters");

  resetButton.addEventListener("click", () => {
    emptyInput.value = "";
    displayGames(games);
  });
}
