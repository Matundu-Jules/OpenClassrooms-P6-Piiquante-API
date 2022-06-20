const dotenv = require("dotenv").config();
const path = require("path");
const express = require("express");
const morgan = require("morgan");
require("./config/mongodb.config");

// Routes :
const authRoutes = require("./routes/auth.routes");
const saucesRoutes = require("./routes/sauces.routes");

const app = express();

// Récupérer la data des requêtes lorsque l'informatin est encodé avec le type application/json :
app.use(express.json()); // permet d'utiliser req.body et de parser le body (comme body-parser).
// Récupérer data pour information encode en application/x-www-form-urlencoded, c'est le format par defaut d'un formulaire :
app.use(express.urlencoded({extended: true})); // Permet de passer et recuperer des params URL.
app.use(morgan("tiny")); // Gestion erreur pour development.

// Déclaration Header de la réponse :
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-Width, Content, Accept, Content-Type, Authorization"
    );
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
    next();
});

// Définir le chemin absolu du répertoire au cas ou l'app express est lancée depuis un autre répertoire :
app.use("/uploads/images", express.static(path.join(__dirname, "uploads/images")));
// Sauces :
app.use("/api/auth", authRoutes);
app.use("/api/sauces", saucesRoutes);

app.listen(process.env.PORT || 3000, () => {
    console.log("Server running on port 3000");
});

module.exports = app;
