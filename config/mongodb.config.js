const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

// Connexion à la base de données :
mongoose
    .connect(
        `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}/${process.env.DB_NAME}?retryWrites=true&w=majority`,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
    )
    .then(() => console.log("Connexion database : OK !"))
    .catch(err => new Error(err));
