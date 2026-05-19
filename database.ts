import { Collection, MongoClient } from "mongodb";
import { User, GamesData, Game, CollectionEntry, CurrentGameEntry } from "./types";
import bcrypt from "bcrypt";

const saltRounds: number = 10;

export const MONGODB_URI = process.env.MONGO_URI ?? "mongodb://localhost:27017";
if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI zit niet in de .env file');
}

export const client = new MongoClient(MONGODB_URI);

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

async function createInitialUser() {
    if (await usersCollection.countDocuments() > 0) {
        return;
    }
    const email: string | undefined = process.env.ADMIN_EMAIL;
    const password: string | undefined = process.env.ADMIN_PASSWORD;
    if (email === undefined || password === undefined) {
        throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in environment");
    }
    await usersCollection.insertOne({
        username: "admin",
        email: email,
        password: await bcrypt.hash(password, saltRounds),
        role: "ADMIN",
        createdAt: new Date()
    });
}

export async function login(email: string, password: string) {
    if (email === "" || password === "") {
        throw new Error("Email en wachtwoord zijn verplicht");
    }
    const user: User | null = await usersCollection.findOne<User>({ email });
    if (user) {
        if (await bcrypt.compare(password, user.password!)) {
            return user;
        } else {
            throw new Error("Wachtwoord is onjuist");
        }
    } else {
        throw new Error("Gebruiker niet gevonden");
    }
}

export async function connect() {
    try {
        await client.connect();
        await createInitialUser();
        await seedGames();
        console.log('Connected to database');
        process.on('SIGINT', exit);
    } catch (error) {
        console.error('Database connection error:', error);
    }
}
