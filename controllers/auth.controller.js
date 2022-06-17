const bcrypt = require("bcrypt");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const {createJwtToken} = require("../config/jwt.config");
const {userExist} = require("../queries/auth.queries");

// Création nouvel user :
exports.userSignup = async (req, res, next) => {
    try {
        // Hashage du mot de passe :
        const hash = await bcrypt.hash(req.body.password, 10);

        // Création de l'user :
        const user = new User({
            email: req.body.email,
            password: hash,
        });

        const userBdd = await userExist(user.email);

        if (userBdd.email === req.body.email) {
            return res.status(500).json({message: "Email déja utilisé, veuillez choisir un autre email !"});
        }

        // Enregistrement de l'user dans la BDD :
        await user.save();

        // Envoie de la réponse :
        res.status(201).json({message: "Utilisateur crée !"});
    } catch (err) {
        next(err);
    }
};

// Connexion user :
exports.userLogin = async (req, res, next) => {
    try {
        const body = req.body;

        // Récupération de l'user via l'email si existant :
        const user = await userExist(body.email);

        // Si l'user existe on vérifie le mot de passe de la requete comparé à celui de la bdd :
        const passwordIsValid = await bcrypt.compare(body.password, user.password);

        // Si le user n'existe pas alors on envoie un status 401 (Non autorisé) avec un message :
        if (!user) {
            return res.status(401).json({message: "Utilisateur non trouvé !"});
        }

        // Si les password ne sont pas les mêmes alors on return un statut 401 et un message 'mdp incorrect' :
        if (!passwordIsValid) {
            res.status(401).json({message: "Mot de passe incorrect !"});
        }

        // Sinon je renvoie un statut 200 et je renvoie un json contenant l'id de l'user et un token web JSON signé.
        res.status(200).json({
            userId: user._id,
            token: createJwtToken(user),
        });
    } catch (err) {
        next(err);
    }
};
