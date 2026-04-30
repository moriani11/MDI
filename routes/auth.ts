import express from "express";
import bcrypt from "bcrypt";
import { usersCollection } from "../database";

const router = express.Router();

router.post("/register", async (req, res) => {
  const { username, email, password, "confirm-password": confirmPassword } = req.body;

  if (!username || !email || !password || !confirmPassword) {
    return res.status(400).json({ error: "Vul alle velden in" });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ error: "Wachtwoorden komen niet overeen" });
  }

  const existing = await usersCollection.findOne({ $or: [{ email }, { username }] });
  if (existing) {
    return res.status(400).json({ error: "Email of gebruikersnaam is al in gebruik" });
  }

  const hashed = await bcrypt.hash(password, 10);
  await usersCollection.insertOne({ username, email, password: hashed });

  res.json({ success: true });
});

export default router;