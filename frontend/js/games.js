
const API_key = "59ccbb7e2eaf4b2181f3bd38ca8c770f";

async function fetchGames() {
    try {
        const response = await fetch(`https://api.rawg.io/api/games?key=${API_key}&page_size=39`);
        const data = await response.json();
        console.log(data);
        displayGames(data.results); 
    } catch (error) {
        console.error('Error:', error);
    }
}

function displayGames(games) {
  const gamesContainer = document.querySelector('.games-overview');

  gamesContainer.innerHTML = games
    .map(game => `
      <div class="game-card">
        <img src="${game.background_image}" alt="${game.name}" class="game-image">
        <div class="game-info">
          <h3>${game.name}</h3>
          <p>Rating: ${game.rating}/5</p>
          <p>Released: ${game.released}</p>
        </div>
      </div>
    `)
    .join('');
}


fetchGames();
