function displayGameModal(game) {
  const gameModal = document.querySelector(".game-details");
  const overview = document.querySelector(".games-overview");
  const filter = document.querySelector(".epic-filter-sidebar");
  const pageHeader = document.querySelector("header");

  // overzicht weg, details zichtbaar
  overview.classList.add("hidden");
  gameModal.classList.add("active");
  filter.classList.add("hidden");
  pageHeader.classList.add("hidden");
  document.body.classList.add("details-open");

  gameModal.innerHTML = `
    <div class="details-card">
      <h2>${game.name}</h2>
      <img src="${game.background_image}" alt="${game.name}">
      <p>Rating: ${game.rating}</p>
      <p>Released: ${game.released}</p>
       <p>Playtime: ${game.playtime} hours</p>
      <p>Metacritic: ${game.metacritic}</p>
      <p>Platform: ${game.platforms.map((platform) => platform.platform.name).join(", ")}</p>
      <button id="closeDetails">Terug</button>
    </div>
  `;

  document.getElementById("closeDetails").addEventListener("click", function () {
    // terug naar overzicht
    gameModal.classList.remove("active");
    overview.classList.remove("hidden");
    filter.classList.remove("hidden");
    pageHeader.classList.remove("hidden");
    document.body.classList.remove("details-open");
    gameModal.innerHTML = "";
  });
}
