function displayGameModal(game) {
  const gameModal = document.querySelector(".game-details");
  const overview = document.querySelector(".games-overview");
  const filter = document.querySelector(".epic-filter-sidebar");

  overview.classList.add("hidden");
  gameModal.classList.add("active");
  filter.classList.add("hidden");

  const platformIcons = {
    pc: "pc.jpg",
    playstation: "playstation.jpg",
    xbox: "xbox.png",
    nintendo: "nintendo.png",
    mac: "mac.jpg",
  };

  const platformLogos = game.parent_platforms
    .map((p) => {
      const slug = p.platform.slug.toLowerCase();

      for (const key in platformIcons) {
        if (slug.includes(key)) {
          return `<img src="../image/icons/${platformIcons[key]}" class="platform-icon" alt="${key}">`;
        }
        else {
          return "";
        }
      }
    })
    .join(" ");

  gameModal.innerHTML = `
    <div class="details-card">
      <div class="details-header">
        <h2>${game.name}</h2>
        <button id="closeDetails">🔙</button>
      </div>

      <div class="details-content">
        <div class="details-info">
          <div class="info-item">⭐ ${game.rating}</div>
          <div class="info-item">📅 ${game.released}</div>
          <div class="info-item">⏱️ ${game.playtime}h</div>
          <div class="info-item">📊 ${game.metacritic}</div>

          <div class="info-item platforms">
            🎮 ${platformLogos}
          </div>

          <div class="info-item">
            🎭 ${game.genres.map((g) => g.name).join(", ")}
          </div>

          <div class="collection-buttons">
            <button class="collection-btn add-btn" onclick="addToCollection('${game.id}')">
              ➕ Voeg toe aan collectie
            </button>
            <button class="collection-btn remove-btn" onclick="removeFromCollection('${game.id}')">
              ➖ Verwijder uit de collectie
            </button>
          </div>
        </div>

        <img src="${game.background_image}" alt="${game.name}" class="game-cover">
      </div>
    </div>
  `;

  document.getElementById("closeDetails").addEventListener("click", () => {
    gameModal.classList.remove("active");
    overview.classList.remove("hidden");
    filter.classList.remove("hidden");
    gameModal.innerHTML = "";
  });
}

function saveCollection(collection) {
  localStorage.setItem("gameCollection", JSON.stringify(collection));
}

function getCollection() {
  return JSON.parse(localStorage.getItem("gameCollection") || "[]");
}

function addToCollection(gameId) {
  const collection = getCollection();

  if (!collection.includes(gameId)) {
    collection.push(gameId);
    saveCollection(collection);
    alert("Game added to collection!");
  } else {
    alert("Game already in collection!");
  }
}

function removeFromCollection(gameId) {
  let collection = getCollection();

  collection = collection.filter((id) => id !== gameId);

  collectionGames = collection;
  displayCollection();
  updateStats();

  alert("Game removed from collection!");
}
