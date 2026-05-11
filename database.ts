import { Collection, MongoClient } from "mongodb";
import { User, GamesData, Game, CollectionEntry, CurrentGameEntry } from "./types";
const uri = process.env.MONGO_URI;
if (!uri) {
    throw new Error('MONGO_URI zit niet in de .env file');
}

export const client = new MongoClient(uri); // geen ! meer nodig

export const usersCollection: Collection<User> = client.db("gamehub").collection<User>("users");
export const gamesCollection: Collection<Game> = client.db("gamehub").collection<Game>("games");
export const collectionDb: Collection<CollectionEntry> = client.db("gamehub").collection<CollectionEntry>("collection");
export const currentGameDb: Collection<CurrentGameEntry> = client.db("gamehub").collection<CurrentGameEntry>("currentGame");

async function loadGamesFromApi(): Promise<Game[]> {
    try {
        const api = await fetch("https://raw.githubusercontent.com/CodeMaster123456789/MDI/refs/heads/main/public/json/games.json")
        const data: GamesData = await api.json();
        return data.results;
    } catch (error) {
        console.error('Error loading games from JSON:', error);
        return [];
    }
}

async function seedGames() {
    const games = await loadGamesFromApi();
    if ((await gamesCollection.countDocuments()) === 0) {
        await gamesCollection.insertMany(games);
        console.log(`${games.length} games seeded to database`);
    }
}

export async function loadGames() {
    return await gamesCollection.find().toArray();
}

async function exit() {
    try {
        await client.close();
        console.log('Disconnected from database');
    } catch (error) {
        console.error(error);
    }
    process.exit(0);
}

export async function connect() {
    try {
        await client.connect();
        await seedGames();
        console.log('Connected to database');
        process.on('SIGINT', exit);
    } catch (error) {
        console.error('Database connection error:', error);
    }
}
