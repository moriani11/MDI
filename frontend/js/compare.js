const API_key = "59ccbb7e2eaf4b2181f3bd38ca8c770f";

let gamesData = [];

async function fetchGames() {
  try {
    const response = await fetch("../json/games.json");

    const data = await response.json();

    console.log(data);

    gamesData = data.results;

    GetGamesName(gamesData);

    document.querySelector(".gameInput1")
      .addEventListener("change", () => GetInfoOfGame(gamesData));

    document.querySelector(".gameInput2")
      .addEventListener("change", () => GetInfoOfGame(gamesData));

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

function GetInfoOfGame(games) {

  const valueOfInput = document.querySelector(".gameInput1").value;
  const valueOfInput2 = document.querySelector(".gameInput2").value;

  const gameImage = document.querySelector(".image1");
  const gameImage2 = document.querySelector(".image2");

  const gameInfo = document.querySelector(".compare_specifications1 ul");
  const gameInfo2 = document.querySelector(".compare_specifications2 ul");

  games.forEach(game => {

    if (valueOfInput === game.name) {

      gameImage.src = game.background_image;

      gameInfo.innerHTML = `
        <li>ratings: ${game.rating}</li>
        <li>releasedate: ${game.released}</li>
        <li>playtime: ${game.playtime} hours</li>
        <li>metacritic: ${game.metacritic}</li>
        <li>platform: ${game.platforms[0].platform.name}</li>
      `;
    }

    if (valueOfInput2 === game.name) {

      gameImage2.src = game.background_image;

      gameInfo2.innerHTML = `
        <li>ratings: ${game.rating}</li>
        <li>releasedate: ${game.released}</li>
        <li>playtime: ${game.playtime}</li>
        <li>metacritic: ${game.metacritic}</li>
        <li>platform: ${game.platforms[0].platform.name}</li>
      `;
    }

  });

}

fetchGames();