import express from "express";
import { loadGames } from "../database";

const router = express.Router();

router.get("/", (req, res) => res.render("index", { title: "Home" }));

router.get("/collection", async (req, res) => {
  const games = await loadGames();
  res.render("collection", { games, title: "Collection" });
});

router.get("/guess", async (req, res) => {
  const games = await loadGames();
  res.render("guess", { games, title: "Guess the Game" });
});

router.get("/compare", async (req, res) => {
  const games = await loadGames();
  res.render("compare", { games, title: "Compare Games" });
});

router.get("/login", (req, res) => res.render("login", { title: "Login" }));
router.get("/registration", (req, res) => res.render("registration", { title: "Registration" }));
router.get("/forgot-password", (req, res) => res.render("forgot-password", { title: "Forgot Password" }));

export default router;