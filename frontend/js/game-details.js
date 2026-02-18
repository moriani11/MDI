function displayGameModal(game) {
  const gameModal = document.querySelector(".game-details");
  const overview = document.querySelector(".games-overview");

  // overzicht weg, details zichtbaar
  overview.classList.add("hidden");
  gameModal.classList.add("active");

  gameModal.innerHTML = `
    <div class="details-card">
      <h2>${game.name}</h2>
      <img src="${game.background_image}" alt="${game.name}" style="width:100%; max-width:600px; height:auto;">
      <p>Rating: ${game.rating}</p>
      <p>Released: ${game.released}</p>
      <button id="closeDetails">Terug</button>
    </div>
  `;

  document.getElementById("closeDetails").addEventListener("click", function () {
    // terug naar overzicht
    gameModal.classList.remove("active");
    overview.classList.remove("hidden");
    gameModal.innerHTML = "";
  });
}
