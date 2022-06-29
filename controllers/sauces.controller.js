const Sauce = require("../models/sauce.model");
const {getSauceQuery, getAllSaucesQuery, modifySauceQuery, deleteSauceQuery} = require("../queries/sauces.queries");
const path = require("path");
const fs = require("fs");

// Création de sauce :
exports.createSauce = async (req, res, next) => {
    try {
        const sauceObject = JSON.parse(req.body.sauce);

        // Création de la sauce à partir des données formulaire :
        const sauce = new Sauce({
            ...sauceObject,
            imageUrl: `${req.protocol}://${req.get("host")}/uploads/images/${req.file.filename}`,
            likes: 0,
            dislikes: 0,
            usersLiked: [],
            usersDisliked: [],
        });
        await sauce.save();

        res.status(201).json({message: "L'ajout de votre nouvelle sauce a été prise en compte."});
    } catch (err) {
        next(err);
    }
};

// Récupération de toutes les sauces :
exports.getAllSauces = async (req, res, next) => {
    try {
        const sauces = await getAllSaucesQuery();
        res.status(200).json(sauces);
    } catch (err) {
        next(err);
    }
};

// Récupération d'une sauce :
exports.getSauce = async (req, res, next) => {
    try {
        // Récupération id passé dans l'url :
        const sauceId = req.params.id;

        // Récupération de la sauce via son Id :
        const sauce = await getSauceQuery(sauceId);
        res.status(200).json(sauce);
    } catch (err) {
        next(err);
    }
};

// Modifier une sauce :
exports.modifySauce = async (req, res, next) => {
    try {
        const sauceId = req.params.id;
        const sauce = await getSauceQuery(sauceId);

        if (sauce.userId !== req.user.userId) {
            res.status(403);
            throw new Error("403: Unauthorized request.");
        }

        let modifiedSauce;

        // Si une nouvelle img est ajouté alors on l'enregistre et on supprime l'ancienne du répertoire :
        if (req.file) {
            modifiedSauce = {
                ...JSON.parse(req.body.sauce),
                imageUrl: `${req.protocol}://${req.get("host")}/uploads/images/${req.file.filename}`,
            };

            // Récupérer l'url de l'ancienne image de la sauce :
            const imgUrl = sauce.imageUrl;

            // Création u path pour supprimer l'ancienne image :
            const path = "./uploads/images/" + imgUrl.split("/images/")[1];

            // Suppression de l'ancienne image :
            fs.unlink(path, err => {
                if (err) throw err;
                console.log("Fichier supprimé !");
            });
        }

        // Si aucune image n'est reçue lors de la modification alors on récupère uniquement les données via le body :
        if (!req.file) {
            modifiedSauce = {...req.body};
        }

        // Appliquer les modification dans la base de données :
        await modifySauceQuery(sauceId, modifiedSauce);
        res.status(201).json({message: "La modification de la sauce a bien été effectuer."});
    } catch (err) {
        next(err);
    }
};

// Suppression de sauce :
exports.deleteSauce = async (req, res, next) => {
    try {
        const sauceId = req.params.id;
        const sauce = await getSauceQuery(sauceId);

        if (sauce.userId !== req.user.userId) {
            res.status(403);
            throw new Error("403: Unauthorized request.");
        }

        await deleteSauceQuery(sauceId);

        const imgUrl = sauce.imageUrl;
        const path = "./uploads/images/" + imgUrl.split("/images/")[1];

        fs.unlink(path, err => {
            if (err) throw err;
            console.log("Fichier supprimé !");
        });

        res.status(200).json({message: "La sauce a bien été supprimé !"});
    } catch (err) {
        next(err);
    }
};

// Ajout de like et dislike :
exports.addLike = async (req, res, next) => {
    try {
        const sauceId = req.params.id;
        const userId = req.body.userId;

        const sauce = await getSauceQuery(sauceId);
        const indexLike = sauce.usersLiked.indexOf(userId);
        const indexDislike = sauce.usersDisliked.indexOf(userId);

        // Si on tente d'envoyer autre chose que -1, 0, ou 1, alors renvoyer une erreur :
        if (req.body.like < -1 || req.body.like > 1 || isNaN(req.body.like)) {
            res.status(400);
            throw new Error(`Cette valeur n'est pas acceptée : ${req.body.like}`);
        }

        // Ajout de Like :
        if (req.body.like === 1) {
            // Si l'user a déja liker, retourner une erreur :
            if (indexLike !== -1) {
                res.status(400);
                throw new Error("Vous avez déja liker cette sauce.");
            }

            // Si l'user a déja disliker, supprimer le dislike :
            if (indexDislike !== -1) {
                sauce.dislikes--;
                const newArray = sauce.usersDisliked.filter(id => id != userId);
                sauce.usersDisliked = newArray;
            }

            // Ajouter le like :
            sauce.usersLiked.push(userId);
            sauce.likes++;
            await sauce.save();
            res.status(200).json({message: "Votre like a été ajouté !"});
        }

        // Ajout de Dislike :
        if (req.body.like === -1) {
            // Si l'user a déja disliker, retourner une erreur :
            if (indexDislike !== -1) {
                res.status(400);
                throw new Error("Vous avez déja disliker cette sauce.");
            }

            // Si l'user a déja liker, supprimer le like :
            if (indexLike !== -1) {
                sauce.likes--;
                const newArray = sauce.usersLiked.filter(id => id != userId);
                sauce.usersLiked = newArray;
            }

            // Ajouter le dislike :
            sauce.usersDisliked.push(userId);
            sauce.dislikes++;
            await sauce.save();
            res.status(200).json({message: "Votre dislike a été ajouté !"});
        }

        // Enlever son like / dislike :
        if (req.body.like === 0) {
            if (indexLike > -1) {
                sauce.likes--;
                const newArray = sauce.usersLiked.filter(id => id != userId);
                sauce.usersLiked = newArray;
                await sauce.save();
                res.status(200).json({message: "Votre like a été supprimé !"});
            }

            if (indexDislike > -1) {
                sauce.dislikes--;
                const newArray = sauce.usersDisliked.filter(id => id != userId);
                sauce.usersDisliked = newArray;
                await sauce.save();
                res.status(200).json({message: "Votre dislike a été supprimé !"});
            }
        }
    } catch (err) {
        next(err);
    }
};
