import express from "express";
import bcrypt from "bcrypt";
import { usersCollection, login } from "../database";

const router = express.Router();

const saltRounds: number = 10;

router.post("/register", async (req, res) => {
    const { username, email, password, "confirm-password": confirmPassword } = req.body;

    if (!username || !email || !password || !confirmPassword) {
        req.session.message = { type: "error", message: "Vul alle velden in" };
        return res.redirect("/registration");
    }

    if (password !== confirmPassword) {
        req.session.message = { type: "error", message: "Wachtwoorden komen niet overeen" };
        return res.redirect("/registration");
    }

    const existing = await usersCollection.findOne({ $or: [{ email }, { username }] });
    if (existing) {
        req.session.message = { type: "error", message: "Email of gebruikersnaam is al in gebruik" };
        return res.redirect("/registration");
    }

    await usersCollection.insertOne({
        username,
        email,
        password: await bcrypt.hash(password, saltRounds),
        role: "USER",
        createdAt: new Date(),
    });

    req.session.message = { type: "success", message: "Account aangemaakt! Je kan nu inloggen." };
    res.redirect("/login");
});

router.post("/login", async (req, res) => {
    const email: string = req.body.email;
    const password: string = req.body.password;

    try {
        let user = await login(email, password);
        delete user.password;
        req.session.user = user;
        res.redirect("/games");
    } catch (e: any) {
        req.session.message = { type: "error", message: e.message };
        res.redirect("/login");
    }
});

router.post("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) console.error("Logout fout:", err);
        res.redirect("/login");
    });
});

export default router;
