import express from "express";
import bcrypt from "bcrypt";
import { usersCollection } from "../database";
import { User } from "../types";

const router = express.Router();

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

  const hashed = await bcrypt.hash(password, 10);
  await usersCollection.insertOne({ username, email, password: hashed, role: "USER", createdAt: new Date() });

  req.session.message = { type: "success", message: "Account aangemaakt! Je kan nu inloggen." };
  res.redirect("/login");
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    req.session.message = { type: "error", message: "Vul alle velden in" };
    return res.redirect("/login");
  }

  try {
    const user: User | null = await usersCollection.findOne({ email });

    if (!user || !user.password) {
      req.session.message = { type: "error", message: "Email of wachtwoord is onjuist" };
      return res.redirect("/login");
    }

    const isCorrect = await bcrypt.compare(password, user.password);

    if (!isCorrect) {
      req.session.message = { type: "error", message: "Email of wachtwoord is onjuist" };
      return res.redirect("/login");
    }

    // Wachtwoord mag NOOIT in de sessie
    const { password: _password, ...userForSession } = user;
    req.session.user = userForSession;

    res.redirect("/games");
  } catch (error) {
    console.error("Login fout:", error);
    req.session.message = { type: "error", message: "Er is een fout opgetreden. Probeer opnieuw." };
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
