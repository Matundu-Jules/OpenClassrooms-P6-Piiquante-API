const mongoose = require("mongoose");

// Import variables environnement :
const dotenv = require("dotenv").config();
console.log(dotenv);

// Connexion à la base de données :
mongoose
    .connect(
        `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}/${process.env.DB_NAME}?retryWrites=true&w=majority`,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
    )
    .then(() => console.log("Connexion Database : OK !"))
    .catch(err => console.log(err));
