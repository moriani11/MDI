import express from "express";
import { loadGames } from "../database";

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

// router.post("/collection/add", async (req, res) => {
//     const { gameId, userId } = req.body; 
//     try {
//         // We updaten de gebruiker door het gameId in een array 'myCollection' te pushen ($addToSet voorkomt dubbelen)
//         await usersCollection.updateOne(
//             { _id: new ObjectId(userId) },
//             { $addToSet: { myCollection: gameId } }
//         );
//         res.status(200).json({ message: "Toegevoegd aan DB" });
//     } catch (err) {
//         res.status(500).json({ error: "Fout bij opslaan" });
//     }
// });

// router.delete("/collection/remove", async (req, res) => {
//     const { gameId, userId } = req.body;
//     try {
//         // We gebruiken $pull om het specifieke ID uit de array te verwijderen
//         await usersCollection.updateOne(
//             { _id: new ObjectId(userId) },
//             { $pull: { myCollection: gameId } }
//         );
//         res.status(200).json({ message: "Verwijderd uit DB" });
//     } catch (err) {
//         res.status(500).json({ error: "Fout bij verwijderen" });
//     }
// });

export default router;