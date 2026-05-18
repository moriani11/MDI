import dotenv from "dotenv";
dotenv.config();

import { Collection, MongoClient } from "mongodb";
import { User, GamesData, Game } from "./types";
import bcrypt from "bcrypt";

const saltRounds: number = 10;

export const MONGODB_URI = process.env.MONGO_URI ?? "mongodb://localhost:27017";

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

export async function login(email: string, password: string): Promise<User> {
    if (email === "" || password === "") {
        throw new Error("Email and password required");
    }
    let user: User | null = await usersCollection.findOne<User>({ email: email });
    if (user) {
        if (await bcrypt.compare(password, user.password!)) {
            return user;
        } else {
            throw new Error("Password incorrect");
        }
    } else {
        throw new Error("User not found");
    }
}

async function createInitialUser() {
    if (await usersCollection.countDocuments() > 0) {
        return;
    }
    let email: string | undefined = process.env.ADMIN_EMAIL;
    let password: string | undefined = process.env.ADMIN_PASSWORD;
    let username: string = process.env.ADMIN_USERNAME ?? "admin";
    if (email === undefined || password === undefined) {
        throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in environment");
    }
    await usersCollection.insertOne({
        username,
        email,
        password: await bcrypt.hash(password, saltRounds),
        role: "ADMIN",
        createdAt: new Date(),
    });
    console.log(`Admin aangemaakt: ${email}`);
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
        await createInitialUser();
        console.log("Connected to database");
        process.on("SIGINT", exit);
    } catch (error) {
        console.error("Database connection error:", error);
        process.exit(1);
    }
}
