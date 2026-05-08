import express from "express";
import bcrypt from "bcrypt";
import { usersCollection } from "../database";
import { User } from "../types";

const router = express.Router();

// ──────────────────────────────────────────────
// REGISTRATIE
// ──────────────────────────────────────────────
router.post("/register", async (req, res) => {
  const { username, email, password, "confirm-password": confirmPassword } = req.body;

  if (!username || !email || !password || !confirmPassword) {
    return res.redirect("/registration?error=Vul alle velden in");
  }

  if (password !== confirmPassword) {
    return res.redirect("/registration?error=Wachtwoorden komen niet overeen");
  }

  const existing = await usersCollection.findOne({ $or: [{ email }, { username }] });
  if (existing) {
    return res.redirect("/registration?error=Email of gebruikersnaam is al in gebruik");
  }

  // Wachtwoord hashen met bcrypt voor opslag in de database
  const hashed = await bcrypt.hash(password, 10);

  await usersCollection.insertOne({
    username,
    email,
    password: hashed,
    createdAt: new Date(),
  });

  res.redirect("/login?success=Account aangemaakt! Je kan nu inloggen.");
});

// ──────────────────────────────────────────────
// LOGIN
// ──────────────────────────────────────────────
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.redirect("/login?error=Vul alle velden in");
  }

  try {
    const user: User | null = await usersCollection.findOne({ email });

    // Gebruiker niet gevonden of heeft geen wachtwoord
    if (!user || !user.password) {
      return res.redirect("/login?error=Email of wachtwoord is onjuist");
    }

    // Gehashed wachtwoord vergelijken met ingegeven wachtwoord
    const isCorrect = await bcrypt.compare(password, user.password);

    if (!isCorrect) {
      return res.redirect("/login?error=Email of wachtwoord is onjuist");
    }

    // Wachtwoord uit het object halen via destructuring — mag NOOIT in de sessie
    const { password: _password, ...userForSession } = user;
    req.session.user = userForSession;

    res.redirect("/games");

  } catch (error) {
    console.error("Login fout:", error);
    res.redirect("/login?error=Er is een fout opgetreden. Probeer opnieuw.");
  }
});

// ──────────────────────────────────────────────
// LOGOUT
// ──────────────────────────────────────────────
router.post("/logout", (req, res) => {
  // Sessie volledig vernietigen zodat de cookie ongeldig wordt
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout fout:", err);
    }
    res.redirect("/login");
  });
});

export default router;