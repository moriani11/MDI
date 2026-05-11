import express from "express";
import { gamesCollection, collectionDb } from "../database";

const router = express.Router();

router.get("/", (req, res) => res.render("index", { title: "Home" }));

router.get("/collection", async (req, res) => {
  const entries = await collectionDb.find().toArray();
  const collectedIds = entries.map(e => e.gameId);
  const games = await gamesCollection.find({ id: { $in: collectedIds } }).toArray();
  res.render("collection", { games, title: "Mijn Collectie" });
});

router.post("/collection/add", async (req, res) => {
  const gameId = parseInt(req.body.gameId);
  if (!isNaN(gameId)) {
    await collectionDb.updateOne({ gameId }, { $setOnInsert: { gameId } }, { upsert: true });
  }
  res.redirect("/games");
});

router.post("/collection/remove/:id", async (req, res) => {
  const gameId = parseInt(req.params.id);
  await collectionDb.deleteOne({ gameId });
  res.redirect("/collection");
});

router.get("/guess", async (req, res) => {
  const games = await gamesCollection.find().toArray();
  const gameId = parseInt(req.query.id as string);
  let game = !isNaN(gameId) ? games.find(g => g.id === gameId) : null;
  if (!game) {
    game = games[Math.floor(Math.random() * games.length)];
  }
  const xp = parseInt(req.query.xp as string) || 0;
  const result = (req.query.result as string) || "";
  res.render("guess", { game, xp, result, title: "Guess the Game" });
});

router.post("/guess", async (req, res) => {
  const gameId = parseInt(req.body.gameId);
  const guess = (req.body.guess as string || "").trim().toLowerCase();
  const currentXp = parseInt(req.body.xp) || 0;
  const game = await gamesCollection.findOne({ id: gameId });

  if (!game) {
    return res.redirect("/guess");
  }

  const correct = guess === game.name.toLowerCase();
  if (correct) {
    const newXp = currentXp + 10;
    const games = await gamesCollection.find().toArray();
    const nextGame = games[Math.floor(Math.random() * games.length)];
    return res.redirect(`/guess?id=${nextGame.id}&xp=${newXp}&result=correct`);
  }
  res.redirect(`/guess?id=${game.id}&xp=${currentXp}&result=wrong`);
});

router.get("/compare", async (req, res) => {
  const games = await gamesCollection.find().toArray();
  const slug1 = (req.query.game1 as string) || "";
  const slug2 = (req.query.game2 as string) || "";
  const game1 = slug1 ? await gamesCollection.findOne({ slug: slug1 }) : null;
  const game2 = slug2 ? await gamesCollection.findOne({ slug: slug2 }) : null;
  res.render("compare", { games, game1, game2, slug1, slug2, title: "Compare Games" });
});

router.get("/login", (req, res) => res.render("login", { title: "Login" }));
router.get("/registration", (req, res) => res.render("registration", { title: "Registration" }));
router.get("/forgot-password", (req, res) => res.render("forgot-password", { title: "Forgot Password" }));

export default router;