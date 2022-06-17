const dotenv = require("dotenv").config();
const jwt = require("jsonwebtoken");
const secret = process.env.ACCESS_TOKEN_SECRET;

exports.createJwtToken = user => {
    return jwt.sign(
        {
            userId: user._id.toString(),
        },
        secret,
        {expiresIn: "1800s"}
    );
};

// Vérification du token pour les url /sauces :
exports.verifyJwtToken = (req, res, next) => {
    try {
        // Récupération du token :
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, secret);
        const userId = decodedToken.userId;
        req.user = {userId};

        if (req.body.userId && req.user.userId !== userId) {
            res.status(401, "Token d'authentification invalide !");
        } else {
            next();
        }
        // console.log("vérification token ok");

        // res.json(req.user);
    } catch (err) {
        res.status(401).json({message: "Veuillez vous identifier."});
    }
};
