import { NextFunction, Request, Response } from "express";

// Middleware die controleert of de gebruiker ingelogd is.
// Zo niet → doorsturen naar /login.
// Zo ja  → gebruiker beschikbaar maken in alle views via res.locals.
export function secureMiddleware(req: Request, res: Response, next: NextFunction) {
    if (req.session.user) {
        res.locals.user = req.session.user; // Beschikbaar in alle EJS views
        next();
    } else {
        res.redirect("/login");
    }
}