import dotenv from "dotenv";
dotenv.config();

import express from "express";
import pagesRoutes from "./routes/pages";
import gamesRoutes from "./routes/games";
import authRoutes from "./routes/auth";
import { connect } from "./database";

const app = express();

app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));


app.use("/", pagesRoutes);
app.use("/games", gamesRoutes);
app.use("/auth", authRoutes);

app.use((req, res) => {
    res.status(404).send("Pagina niet gevonden");
});

connect().then(() => {
    app.listen(3000, () => {
        console.log("Server draait op http://localhost:3000");
    });
});