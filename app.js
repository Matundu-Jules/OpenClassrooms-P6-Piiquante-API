const dotenv = require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
require("./config/mongodb.config");

// Routes :
const authRoutes = require("./routes/auth.routes");
const saucesRoutes = require("./routes/sauces.routes");

const app = express();

app.use(express.json());
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-Width, Content, Accept, Content-Type, Authorization"
    );
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
    next();
});
app.use(express.urlencoded({extended: true}));
app.use(morgan("tiny"));
app.use("/api/auth", authRoutes);
app.use("/api/sauces", saucesRoutes);

app.listen(process.env.PORT || 3000, () => {
    console.log("Server running on port 3000");
});

module.exports = app;
