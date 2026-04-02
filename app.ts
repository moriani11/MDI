import express from "express";

const app = express();

app.set("view engine", "ejs");
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Routes
app.get("/", (req, res) => {
    res.render("index");
});

app.get("/games", (req, res) => {
    res.render("games");
});

app.get("/collection", (req, res) => {
    res.render("collection");
});

app.get("/guess", (req, res) => {
    res.render("guess");
});

app.get("/compare", (req, res) => {
    res.render("compare");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/registration", (req, res) => {
    res.render("registration");
});

app.get("/forgot-password", (req, res) => {
    res.render("forgot-password");
});

app.use((req, res) => {
    res.status(404).send("Pagina niet gevonden");
})

app.listen(3000, () => {
    console.log("Server staat online op http://localhost:3000");
})
