import express from "express";
import bcrypt from "bcrypt";
import { User } from "../models/User";

const router = express.Router();

// Registratie
router.post("/register", async (req, res) => {
    const { username, email, password, "confirm-password": confirmPassword } = req.body;

    if (!username || !email || !password || !confirmPassword) {
        return res.status(400).json({ error: "Vul alle velden in" });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ error: "Wachtwoorden komen niet overeen" });
    }

    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) {
        return res.status(400).json({ error: "Email of gebruikersnaam is al in gebruik" });
    }

    const hashed = await bcrypt.hash(password, 10);
    await User.create({ username, email, password: hashed });

    res.json({ success: true });
});

// Login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Vul alle velden in" });
    }

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(401).json({ error: "Email of wachtwoord is fout" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        return res.status(401).json({ error: "Email of wachtwoord is fout" });
    }

    (req.session as any).userId = user._id;
    (req.session as any).username = user.username;

    res.json({ success: true });
});

// Logout
router.post("/logout", (req, res) => {
    req.session.destroy(() => {
        res.json({ success: true });
    });
});

export default router;
