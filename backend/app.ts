import express from "express";

const app = express();

app.set("view engine", "ejs");
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("index");
});

app.use((req, res) => {
    res.status(404).send("Pagina niet gevonden");
})

app.listen(3000, () => {
    console.log("Server staat online op http://localhost:3000");
})