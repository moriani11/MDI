let xp = 0;
let currentGameName = "";
let blurLevel = 10;
let hasGuessedCorrectly = false;
let allGames = []; // We slaan de games hier op zodat alle functies erbij kunnen

async function fetchGames() {
  try {
    const response = await fetch(`../json/games.json`);
    const data = await response.json();
    allGames = data.results;

    // We vullen de datalist één keer in het begin
    GetGamesName(allGames);
    // Start de eerste game
    GetGamesImage(allGames);
  } catch (error) {
    console.error("Error:", error);
  }
}

function GetGamesName(games) {
  const datalist = document.querySelector("#gameList");
  if (!datalist) return; // Veiligheidcheck

  datalist.innerHTML = ""; // Maak leeg voor de zekerheid
  games.forEach(element => {
    const option = document.createElement("option");
    option.value = element.name;
    datalist.appendChild(option);
  });
}

function GetGamesImage(gameImage) {
  // RESET de status voor de nieuwe ronde
  hasGuessedCorrectly = false;
  blurLevel = 10;

  const index = Math.floor(Math.random() * gameImage.length);
  const guessContainer = document.querySelector(".guess-game");
  currentGameName = gameImage[index].name;

  guessContainer.innerHTML = `
    <h2>Raad het Spel</h2>
    <p class="xp">⭐ <span id="xp-display">${xp}</span></p>
    <div class="image">
      <img class="game-image"
           src="${gameImage[index].background_image}"
           alt="Raad de game"
           style="filter: blur(${blurLevel}px)">
    </div>
    <label for="game">Jouw Gok</label>
    <input type="text" name="game" id="game" placeholder="🎯 raad de game 🤔" list="gameList" />
    <p class="result">Resultaat: <span id="result-status">Probeer het!</span></p>
    <div class="buttons">
      <button class="guess">Raad</button>
      <button class="next-game" disabled style="background-color: grey; cursor: not-allowed;">⏭️ Volgende Spel</button>
    </div>
  `;

  // Selecteer de nieuwe elementen in de DOM
  const image = document.querySelector(".game-image");
  const guessBtn = document.querySelector(".guess");
  const nextBtn = document.querySelector(".next-game");
  const input = document.querySelector("#game");
  const resultText = document.querySelector("#result-status");
  const xpText = document.querySelector("#xp-display");

  guessBtn.addEventListener("click", () => {
    if (hasGuessedCorrectly) return;

    const userGuess = input.value.trim().toLowerCase();
    const correctName = currentGameName.toLowerCase();

    if (userGuess === correctName) {
      hasGuessedCorrectly = true;
      xp += 10;
      xpText.textContent = xp;
      resultText.textContent = "✅ Correct!";
      resultText.style.color = "green";

      // Maak de afbeelding scherp
      image.style.filter = `blur(0px)`;

      // Activeer de volgende knop en deactiveer de raad knop
      nextBtn.disabled = false;
      nextBtn.style.backgroundColor = "rgb(140, 0, 255)";
      nextBtn.style.cursor = "pointer";
      guessBtn.disabled = true;
      guessBtn.style.opacity = "0.5";
    } else {
      // Verminder blur bij fout antwoord
      blurLevel = Math.max(0, blurLevel - 2);
      image.style.filter = `blur(${blurLevel}px)`;
      resultText.textContent = "❌ Fout! De afbeelding wordt duidelijker.";
      resultText.style.color = "red";
      input.value = ""; // Maak input leeg voor nieuwe poging
    }
  });

  nextBtn.addEventListener("click", () => {
    // Alleen laden als er geraden is (extra veiligheid)
    if (hasGuessedCorrectly) {
      GetGamesImage(gameImage);
    }
  });
}

fetchGames();