const dotenv = require("dotenv").config();
const jwt = require("jsonwebtoken");
const secret = process.env.ACCESS_TOKEN_SECRET;

// Création du token JWT :
exports.createJwtToken = user => {
    return jwt.sign(
        {
            userId: user._id.toString(),
        },
        secret,
        {expiresIn: "1800s"}
    );
};

// Vérification du token :
exports.verifyJwtToken = (req, res, next) => {
    try {
        // Récupération du token :
        const token = req.headers.authorization.split(" ")[1];

        // Vérification du token :
        const decodedToken = jwt.verify(token, secret);
        const userId = decodedToken.userId;
        req.user = {userId};

        if (req.body.userId && req.user.userId !== userId) {
            throw new Error("Token d'authentification invalide !");
        }
        next();
    } catch (err) {
        next(err);
    }
};
