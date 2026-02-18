const API_key = "59ccbb7e2eaf4b2181f3bd38ca8c770f";

async function fetchGames() {
  try {
    const response = await fetch(
      `https://api.rawg.io/api/games?key=${API_key}&page_size=39`,
    );
    const data = await response.json();
    console.log(data);
    displayGames(data.results);
  } catch (error) {
    console.error("Error:", error);
  }
}

function displayGames(games) {
  const gamesContainer = document.querySelector(".games-overview");

  gamesContainer.innerHTML = games
    .map(
      (game) => `
      <div class="game-card">
        <img src="${game.background_image}" alt="${game.name}" class="game-image">
        <div class="game-info">
          <h3>${game.name}</h3>
          <p>Rating: ${game.rating}/5</p>
          <p>Released: ${game.released}</p>
        </div>
      </div>
    `,
    )
    .join("");
  const gameKaart = document.querySelectorAll(".game-card");
  for (let i = 0; i < gameKaart.length; i++) {
    gameKaart[i].addEventListener("click", function () {
      displayGameModal(games[i]);
    });
  }
}

function displayGameModal(game) {
  const gameModal = document.querySelector(".game-details");

  gameModal.innerHTML = `
    <div class="details-card">
      <h2>${game.name}</h2>
      <img src="${game.background_image}" alt="${game.name} style"width:100px; height:100px;">
      <div id="modalInfo">
        <p>Rating: ${game.rating}</p>
        <p>Released: ${game.released}</p>
        <p>Metacritic: ${game.metacritic}</p>
      </div>
      <p>Genres:\n ${game.genres[0].name}</p>
      <div id="modalButtons">
        <div id="mainButtons">
          <button id="addToCollection">Add to collection</button>
          <button id="setCurrentGame">Set as current game</button>
        </div>
        <button id="closeModal">Close</button>
      </div>
    </div>
  `;

  document.getElementById("closeModal").addEventListener("click", function () {
    gameModal.innerHTML = "";
  });
}

fetchGames();
