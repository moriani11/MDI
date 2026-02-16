
const API_key= "59ccbb7e2eaf4b2181f3bd38ca8c770f";

async function fetchGames() {
    try {
        const response = await fetch(`https://api.rawg.io/api/games?key=${API_key}`);
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error('Error:', error);
    }
}

fetchGames();
