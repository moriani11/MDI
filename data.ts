import type { GamesData, Game } from './types';

export async function loadGames(): Promise<Game[]> {
  try {
    const response = await fetch('../public/json/games.json');
    const data: GamesData = await response.json(); 
    return data.results; 
  } catch (error) {
    console.error(error);
    return [];
  }
}