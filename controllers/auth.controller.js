const bcrypt = require("bcrypt");
const User = require("../models/user.model");
const {createJwtToken} = require("../config/jwt.config");
const {userExistQuery} = require("../queries/auth.queries");

// Création nouvel utilisateur :
exports.userSignup = async (req, res, next) => {
    try {
        // Hashage du mot de passe :
        const hash = await bcrypt.hash(req.body.password, 10);

        // Création de l'user :
        const user = new User({
            email: req.body.email,
            password: hash,
        });

        // Enregistrement de l'user dans la BDD :
        await user.save();

        // Envoie de la réponse :
        res.status(201).json({message: "Utilisateur crée !"});
    } catch (err) {
        next(err);
    }
};

// Connexion utilisateur :
exports.userLogin = async (req, res, next) => {
    try {
        const body = req.body;

        // Récupération de l'user via l'email si existant :
        const user = await userExistQuery(body.email);

        // Si le user n'existe pas alors on retourne une erreur :
        if (!user) {
            res.status(404);
            throw new Error("Utilisateur non trouvé !");
        }

        // Si l'user existe on vérifie le mot de passe de la requete comparé à celui de la bdd :
        const passwordIsValid = await bcrypt.compare(body.password, user.password);

        // Si les password ne sont pas les mêmes alors on retourne une erreur :
        if (!passwordIsValid) {
            res.status(403);
            throw new Error("Mot de passe incorrect !");
        }

        // Sinon si tout est ok, on renvoie un statut 200 et json contenant l'userId et un token web JSON signé.
        res.status(200).json({
            userId: user._id,
            token: createJwtToken(user),
        });
    } catch (err) {
        next(err);
    }
};
