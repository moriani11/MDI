import session from "express-session";
import MongoStore from "connect-mongo";
import { User } from "./types";

// MONGODB_URI wordt geïmporteerd uit database.ts
import { MONGODB_URI } from "./database";

// Uitbreiden van de SessionData interface zodat TypeScript weet
// dat req.session.user een User object kan bevatten
declare module "express-session" {
    export interface SessionData {
        user?: Omit<User, "password">; // Wachtwoord mag NOOIT in de sessie
    }
}

// MongoDB store zodat sessies bewaard blijven na herstart van de server
const mongoStore = MongoStore.create({
    mongoUrl: MONGODB_URI,
    dbName: "gamehub",
    collectionName: "sessions",
});

mongoStore.on("error", (error) => {
    console.error("Session store error:", error);
});

export default session({
    secret: process.env.SESSION_SECRET ?? "gamehub-super-geheim-1234",
    store: mongoStore,
    resave: false,           // Sessie niet opslaan als niets gewijzigd
    saveUninitialized: false, // Geen lege sessies opslaan
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // Cookie geldig voor 1 week
        httpOnly: true,   // Cookie niet bereikbaar via client-side JS (beveiliging)
        sameSite: "strict", // CSRF bescherming
    },
});