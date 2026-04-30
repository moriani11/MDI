import { MongoClient, Db } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = `mongodb+srv://${process.env.USER_DB}:${process.env.PASSWORD}@${process.env.HOST}/?appName=sofianePro`;

let db: Db;

export async function connectDB() {
    const client = new MongoClient(MONGO_URI);
    await client.connect();
    db = client.db("wplproject");
    console.log("Verbonden met MongoDB");
}

export function getDB(): Db {
    return db;
}
