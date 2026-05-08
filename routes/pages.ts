import express from "express";
import { loadGames } from "../database";
// GEWIJZIGD: secureMiddleware importeren
import { secureMiddleware } from "../secureMiddleware";

const router = express.Router();

// Publieke routes — geen login vereist
router.get("/", (req, res) => res.render("index", { title: "Home" }));
router.get("/login", (req, res) => res.render("login", { title: "Login" }));
router.get("/registration", (req, res) => res.render("registration", { title: "Registration" }));
router.get("/forgot-password", (req, res) => res.render("forgot-password", { title: "Forgot Password" }));

// GEWIJZIGD: Beveiligde routes — secureMiddleware controleert of je ingelogd bent.
// Niet ingelogd? → automatisch doorgestuurd naar /login
router.get("/collection", secureMiddleware, async (req, res) => {
  const games = await loadGames();
  res.render("collection", { games, title: "Collection" });
});

router.get("/guess", secureMiddleware, async (req, res) => {
  const games = await loadGames();
  res.render("guess", { games, title: "Guess the Game" });
});

router.get("/compare", secureMiddleware, async (req, res) => {
  const games = await loadGames();
  res.render("compare", { games, title: "Compare Games" });
});

export default router;