const dotenv = require("dotenv").config();
const path = require("path");
const express = require("express");
const morgan = require("morgan");
require("./config/mongodb.config");

const app = express();

// Déclaration du répertoire racine à partir duquel servir les fichiers statiques :
app.use("/uploads/images", express.static(path.join(__dirname, "uploads/images")));

// Parser les requêtes entrantes avec le type application/json et application/x-www-form-urlencoded :
app.use(morgan("tiny")); // Logs requêtes HTTP.
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Déclaration des headers de la réponse :
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-Width, Content, Accept, Content-Type, Authorization"
    );
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
    next();
});

// Routes de l'API :
const authRoutes = require("./routes/auth.routes");
const saucesRoutes = require("./routes/sauces.routes");
app.use("/api/auth", authRoutes);
app.use("/api/sauces", saucesRoutes);

// Initialisation du Port de l'aplication :
const port = process.env.PORT || 3000;

app.listen(port, err => {
    if (err) throw new Error(err);
    console.log("Server listening on PORT", port);
});

module.exports = app;
