import express from "express";
import { client } from "../database";

const router = express.Router();
const col = () => client.db("gamehub").collection("collection");

router.get("/", async (req, res) => {
    const items = await col().find({ userId: "guest" }).toArray();
    const gameIds = items.map((item) => (item as unknown as { gameId: string }).gameId);
    res.json(gameIds);
});

router.post("/", async (req, res) => {
    const { gameId } = req.body;
    if (!gameId) return res.status(400).json({ error: "gameId is verplicht" });

    await col().updateOne(
        { userId: "guest", gameId: String(gameId) },
        { $set: { userId: "guest", gameId: String(gameId) } },
        { upsert: true }
    );
    res.json({ success: true });
});

router.delete("/:gameId", async (req, res) => {
    await col().deleteOne({ userId: "guest", gameId: req.params.gameId });
    res.json({ success: true });
});

export default router;
