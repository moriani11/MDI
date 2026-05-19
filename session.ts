import session from "express-session";
import MongoStore from "connect-mongo";
import type { User, FlashMessage } from "./types";

import { MONGODB_URI } from "./database";

declare module "express-session" {
    export interface SessionData {
        user?: Omit<User, "password">;
        message?: FlashMessage;
    }
}

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
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
        sameSite: "strict",
    },
});