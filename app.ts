import express from "express";
import pagesRoutes from "./routes/pages";
import gamesRoutes from "./routes/games";

const app = express();

app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));


app.use("/", pagesRoutes);
app.use("/games", gamesRoutes);

app.use((req, res) => {
    res.status(404).send("Pagina niet gevonden");
});

app.listen(3000, () => {
    console.log("Server draait op http://localhost:3000");
});