import express from "express";

import { gamesCollection, currentGameDb } from "../database";
const router = express.Router();

router.get("/", async (req, res) => {
  let games = await gamesCollection.find().toArray();

  const search = ((req.query.search as string) || "").toLowerCase();
  const genre = (req.query.genre as string) || "";

  games = games.filter(game => game.name.toLowerCase().includes(search));

  if (genre) {
    games = games.filter(game => game.genres?.some(g => g.slug === genre));
  }

  const currentEntry = await currentGameDb.findOne({ key: "current" });
  const currentSlug = currentEntry?.slug || null;
  res.render("games", { games, title: "Games", search, genre, currentSlug });
});

router.post("/current/set", async (req, res) => {
  const slug = (req.body.slug as string || "").trim();
  if (slug) {
    await currentGameDb.updateOne(
      { key: "current" },
      { $set: { slug } },
      { upsert: true }
    );
  }
  res.redirect(`/games/${slug}`);
});

router.post("/current/clear", async (req, res) => {
  await currentGameDb.deleteOne({ key: "current" });
  const slug = (req.body.slug as string).trim();
  res.redirect(`/games/${slug}`);
});

router.get("/:slug", async (req, res) => {

  const game = await gamesCollection.findOne({ slug: req.params.slug });

  if (!game) {
    return res.status(404).send("Game niet gevonden");
  }

  const currentEntry = await currentGameDb.findOne({ key: "current" });
  const isCurrent = currentEntry?.slug === req.params.slug;
  res.render("gamedetails", { game, title: game.name, isCurrent });

});

export default router;