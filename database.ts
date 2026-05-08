import { Collection, MongoClient } from "mongodb";
import { User, GamesData, Game } from "./types";
import dotenv from "dotenv";
dotenv.config();

// GEWIJZIGD: MONGODB_URI wordt nu geëxporteerd zodat session.ts het kan gebruiken
export const MONGODB_URI = process.env.MONGO_URI ?? "mongodb://localhost:27017";

if (!MONGODB_URI) {
    throw new Error("MONGO_URI zit niet in de .env file");
}

export const client = new MongoClient(MONGODB_URI);

export const usersCollection: Collection<User> = client.db("gamehub").collection<User>("users");
export const gamesCollection: Collection<Game> = client.db("gamehub").collection<Game>("games");

async function loadGamesFromApi(): Promise<Game[]> {
    try {
        const api = await fetch("https://raw.githubusercontent.com/CodeMaster123456789/MDI/refs/heads/main/public/json/games.json");
        const data: GamesData = await api.json();
        return data.results;
    } catch (error) {
        console.error("Error loading games from JSON:", error);
        return [];
    }
}

async function seedGames() {
    const games = await loadGamesFromApi();
    if (games.length > 0 && (await gamesCollection.countDocuments()) === 0) {
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
        console.log("Disconnected from database");
    } catch (error) {
        console.error(error);
    }
    process.exit(0);
}

export async function connect() {
    try {
        await client.connect();
        await seedGames();
        console.log("Connected to database");
        process.on("SIGINT", exit);
    } catch (error) {
        console.error("Database connection error:", error);
        process.exit(1); // GEWIJZIGD: stop de server als de DB niet bereikbaar is
    }
}