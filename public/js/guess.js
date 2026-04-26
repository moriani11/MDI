

async function fetchGames() {
  try {
    const response = await fetch(
      `../json/games.json`
    );
    const data = await response.json();
    GetGamesImage(data.results);
    GetGamesName(data.results);
    console.log(data);
  } catch (error) {
    console.error("Error:", error);
  } 
}

function GetGamesName(games) {

  const datalist = document.querySelector("#gameList");

  games.forEach(element => {

    const option = document.createElement("option");

    option.value = element.name;

    datalist.appendChild(option);

  });
}

let xp = 0;
let currentGameName = "";
let blurLevel = 10;
function GetGamesImage(gameImage) {
  const index = Math.floor(Math.random() * gameImage.length);
  const guessContainer = document.querySelector(".guess-game");
  currentGameName = gameImage[index].name;

  guessContainer.innerHTML = `
    <h2>Raad het Spel</h2>
    <p class="xp">⭐ ${xp}</p>
    <div class="image">
      <img class="game-image"
           src="${gameImage[index].background_image}"
           alt="${gameImage[index].name}"
           style="filter: blur(${blurLevel}px)">
    </div>
    <label for="game">Jouw Gok</label>
    <input type="text" name="game" id="game" placeholder="🎯 raad de game 🤔" list="gameList" />
    <datalist id="gameList"></datalist>
    <p class="result">Resultaat:</p>
    <div class="buttons">
      <button class="guess">Raad</button>
      <button class="next-game">⏭️ Volgende Spel</button>
    </div>
  `;

  const image = document.querySelector(".image img");
  const guessImage = document.querySelector(".guess");
  const nextBtn = document.querySelector(".next-game");
  const input = document.querySelector("#game");
  const resultText = document.querySelector(".result");
  const xpText = document.querySelector(".xp");

  guessImage.addEventListener("click", () => {
    const userGuess = input.value.trim().toLowerCase();
    const correctName = currentGameName.toLowerCase();
    if (userGuess === correctName) {
      xp += 10;
      xpText.textContent = `⭐${xp}`;
      resultText.textContent = "✅ Correct!";
      blurLevel = 10;
      nextBtn.style.backgroundColor = "rgb(140, 0, 255)";
    } else {
      blurLevel = Math.max(0, blurLevel - 1);
      image.style.filter = `blur(${blurLevel}px)`;
      resultText.textContent = "❌ Fout! Probeer opnieuw.";
    }
  });

  nextBtn.addEventListener("click", () => {
    setTimeout(() => {
      GetGamesImage(gameImage);
    }, 100);
  });
}

fetchGames();