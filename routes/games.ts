import express from "express";
import { loadGames } from "../data";

const router = express.Router();

router.get("/", async (req, res) => {
  const games = await loadGames();
  res.render("games", { games, title: "Games" });
});

router.get("/:slug", async (req, res) => {
  const games = await loadGames();
  const game = games.find(g => g.slug === req.params.slug);

  if (!game) {
    return res.status(404).send("Game niet gevonden");
  }

  res.render("gamedetails", { game, title: game.name });
});

export default router;