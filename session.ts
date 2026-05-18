import session from "express-session";
import type { User, FlashMessage } from "./types";

declare module "express-session" {
    export interface SessionData {
        user?: Omit<User, "password">;
        message?: FlashMessage;
    }
}

export default session({
    secret: process.env.SESSION_SECRET ?? "gamehub-super-geheim-1234",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
        sameSite: "strict",
    },
});
