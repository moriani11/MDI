import express from "express";
import { loadGames } from "../database";
// GEWIJZIGD: secureMiddleware importeren
import { secureMiddleware } from "../secureMiddleware";

const router = express.Router();

// GEWIJZIGD: secureMiddleware toegevoegd — niet ingelogd = redirect naar /login
router.get("/", secureMiddleware, async (req, res) => {
  const games = await loadGames();
  res.render("games", { games, title: "Games" });
});

router.get("/:slug", secureMiddleware, async (req, res) => {
  const games = await loadGames();
  const game = games.find((g) => g.slug === req.params.slug);

  if (!game) {
    return res.status(404).send("Game niet gevonden");
  }

  res.render("gamedetails", { game, title: game.name });
});

export default router;