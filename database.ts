import { Collection, MongoClient } from "mongodb";
import { User, GamesData, Game } from "./types";
import bcrypt from "bcrypt";
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

export async function login(email: string, password: string): Promise<User> {
    if (!email || !password) {
        throw new Error("E-mail en wachtwoord zijn verplicht");
    }
    const user = await usersCollection.findOne<User>({ email });
    if (!user) {
        throw new Error("Gebruiker niet gevonden");
    }
    const match = await bcrypt.compare(password, user.password!);
    if (!match) {
        throw new Error("Wachtwoord incorrect");
    }
    return user;
}

async function createInitialAdmin() {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;
    const username = process.env.ADMIN_USERNAME ?? "admin";

    if (!email || !password) {
        throw new Error("ADMIN_EMAIL en ADMIN_PASSWORD moeten ingesteld zijn in .env");
    }

    const existing = await usersCollection.findOne({ email });
    if (existing) return;

    await usersCollection.insertOne({
        username,
        email,
        password: await bcrypt.hash(password, 10),
        role: "ADMIN",
        createdAt: new Date(),
    });

    console.log(`Admin aangemaakt: ${email}`);
}

export async function connect() {
    try {
        await client.connect();
        await seedGames();
        await createInitialAdmin();
        console.log("Connected to database");
        process.on("SIGINT", exit);
    } catch (error) {
        console.error("Database connection error:", error);
        process.exit(1);
    }
}