/**
 * Deze functie haalt alle waarden op van de gamesAPI
 */

const API_key = "59ccbb7e2eaf4b2181f3bd38ca8c770f";

async function fetchGames() {
  try {
    const response = await fetch(
      `https://api.rawg.io/api/games?key=${API_key}&page_size=39`
    );
    const data = await response.json();
    GetGamesImage(data.results);
    console.log(data);
  } catch (error) {
    console.error("Error:", error);
  } 
}


let xp = 0;
let currentGameName = "";
let blurLevel = 10;
/**
 * 
 *  Deze functie gaat een willekeurige game uitkiezen en daarvan de afbeelding pakken.
 */
function GetGamesImage(gameImage) {
  const index = Math.floor(Math.random() * gameImage.length);
  const guessContainer = document.querySelector(".guess-game");
  currentGameName = gameImage[index].name;

  // html structuur voor de afbeeldingen te tonene
  guessContainer.innerHTML = `
    <h2>Guess the Game</h2>
    <p class="xp">XP: ${xp}</p>
    <div class="image">
      <img class="afbeelding"
           src="${gameImage[index].background_image}"
           alt="${gameImage[index].name}"
           style="filter: blur(${blurLevel}px)">
    </div>
    <label for="game">Your Guess</label>
    <input type="text" name="game" id="game" />
    <p class="result">Result:</p>
    <div class="knoppen">
      <button class="raden">Guess</button>
      <button class="geraden">Next Game</button>
    </div>
  `;

  const afbeelding = document.querySelector(".image img");
  const raadAfbeelding = document.querySelector(".raden");
  const nextBtn = document.querySelector(".geraden");
  const input = document.querySelector("#game");
  const resultText = document.querySelector(".result");
  const xpText = document.querySelector(".xp");

  // druk op de knop Guess voor de controle en volgende afbeelding
  raadAfbeelding.addEventListener("click", () => {
    const userGuess = input.value.trim().toLowerCase();
    const correctName = currentGameName.toLowerCase();
    // kijkt of dat de naam van de game juist overeenkomt met de afbeelding
    if (userGuess === correctName) {
      xp += 10;
      xpText.textContent = `XP: ${xp}`; // zet +10 punten naast XP
      resultText.textContent = "✅ Correct!"; // zet dit bij Result

      blurLevel = 10; // reset de blur level weer op 10

      nextBtn.style.backgroundColor = "rgb(140, 0, 255)";
      // klik daarna op Next Game om de volgende gaam te tonen na 1 seconde
      nextBtn.addEventListener("click", () => {
        setTimeout(() => {
        GetGamesImage(gameImage);
      }, 1000);
      });
      // als de naam niet juist is doe de blur level telkens - 1
    } else {
      blurLevel = Math.max(0, blurLevel - 1);
      afbeelding.style.filter = `blur(${blurLevel}px)`;
      resultText.textContent = "❌ Fout! Probeer opnieuw.";
    }
  });
}

fetchGames();