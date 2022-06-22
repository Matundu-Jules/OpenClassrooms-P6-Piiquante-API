const bcrypt = require("bcrypt");
const Sauce = require("../models/sauce.model");
const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const {getSauces, getSauce, modifySauce, deleteSauceQuery} = require("../queries/sauces.queries");
const util = require("util");
const path = require("path");
const fs = require("fs");

// Création de sauce à partir des données formulaire :
exports.createSauce = async (req, res, next) => {
    try {
        const sauceObject = JSON.parse(req.body.sauce);
        const sauceFile = req.file;
        // console.log("sauceObject : ", sauceObject);1
        // console.log("FILE :", sauceFile);
        const sauce = new Sauce({
            ...sauceObject,
            imageUrl: `${req.protocol}://${req.get("host")}/uploads/images/${req.file.filename}`,
            likes: 0,
            dislikes: 0,
            usersLiked: [],
            usersDisliked: [],
        });
        await sauce.save();

        // console.log("LA SAUCE : ", sauce);
        // console.log("LA SAUCE ID : ", sauce._id);

        res.status(201).json({message: "L'ajout de votre nouvelle sauce a été prise en compte."});
    } catch (err) {
        console.log(util.inspect(err, {compact: false, depth: 5, breakLength: 80, color: true}));
        res.status(500).json({err});
    }
};

// Récupération d'une sauce via son Id :
exports.getAllSauces = async (req, res, next) => {
    try {
        const sauces = await getSauces();
        res.status(200).json(sauces);
    } catch (err) {
        res.status(400).json({err});
    }
};

// Récupération d'une sauce via son Id :
exports.getSauce = async (req, res, next) => {
    try {
        // console.log(req.params);

        const sauceId = req.params.id;
        const sauce = await getSauce(sauceId);
        // console.log(sauce);
        res.status(200).json(sauce);
    } catch (err) {
        res.status(400).json({err});
    }
};

// Modifier une sauce :
exports.modifySauce = async (req, res, next) => {
    try {
        const sauceId = req.params.id;
        // console.log(sauceId);
        const sauce = await getSauce(sauceId);
        console.log("sauce.userId : ", sauce.userId);
        console.log("req.user : ", req.user);

        if (sauce.userId !== req.user.userId) {
            return res.status(401).json({message: "Veuillez vous identifier."});
        }
        // const sauce = JSON.parse(req.body.sauce);
        // console.log({sauce});

        const file = req.file;
        // console.log("file :", file);

        // Si une nouvelle img est ajoutée alors on récupère les infos de la sauce et mettons a jour l'imageUrl.
        // Sinon on met a jour les differentes proprietes :
        const sauceObject = req.file
            ? {
                  ...JSON.parse(req.body.sauce),
                  imageUrl: `${req.protocol}://${req.get("host")}/uploads/images/${req.file.filename}`,
              }
            : {...req.body};

        // Si une nouvelle img est ajouté alors on supprime la précédante du répertoire :
        if (req.file) {
            const initialModifiedSauce = await getSauce(sauceId);
            // console.log("initialModifiedSauce : ", initialModifiedSauce);
            const imgUrl = initialModifiedSauce.imageUrl;
            // console.log("imgUrl : ", imgUrl);

            const path = "./uploads/images/" + imgUrl.split("/images/")[1];
            // console.log("PATH : ", path);

            fs.unlink(path, err => {
                if (err) throw err;
                console.log("File delete !");
            });
        }

        // console.log("sauceObject : ", sauceObject);
        await modifySauce(sauceId, sauceObject);
        res.status(201).json({message: "La modification de la sauce a bien été effectuer."});
    } catch (err) {
        res.status(400).json(err);
    }
};

// Suppression de sauce :
exports.deleteSauce = async (req, res, next) => {
    try {
        const sauceId = req.params.id;
        const sauce = await getSauce(sauceId);
        const imgUrl = sauce.imageUrl;

        // console.log("DELETE SAUCE : ", sauce);
        // console.log(req.user.userId === sauce.userId);

        if (req.user.userId === sauce.userId) {
            await deleteSauceQuery(sauceId);

            const path = "./uploads/images/" + imgUrl.split("/images/")[1];
            // console.log("PATH : ", path);

            fs.unlink(path, err => {
                if (err) throw err;
                // console.log("File delete !");
            });

            res.status(200).json({message: "Deleted !"});
        }
    } catch (err) {
        res.status(400).json(err);
    }
};

// Ajout de like :
exports.addLike = async (req, res, next) => {
    try {
        const sauceId = req.params.id;
        const userId = req.body.userId;
        console.log("sauceId : ", sauceId);
        const sauce = await getSauce(sauceId);
        const indexLike = sauce.usersLiked.indexOf(userId);
        const indexDislike = sauce.usersDisliked.indexOf(userId);
        console.log("indexLike : ", indexLike);
        console.log("indexDislike : ", indexDislike);

        if (req.body.like === 1) {
            // if (indexDislike > -1) {
            //     sauce.dislikes--;
            //     const newArray = sauce.usersDisliked.filter(id => id != userId);
            //     sauce.usersDisliked = newArray;
            //     await sauce.save();
            // }

            sauce.usersLiked.push(userId);
            sauce.likes++;
            console.log("sauce : ", sauce);
            await sauce.save();
        }

        if (req.body.like === 0) {
            console.log("sauce before  : ", sauce);

            if (indexLike > -1) {
                sauce.likes--;
                const newArray = sauce.usersLiked.filter(id => id != userId);
                sauce.usersLiked = newArray;
                await sauce.save();

                // console.log("test : ", newArray);
                // console.log("sauce after  : ", sauce);
            }
            if (indexDislike > -1) {
                sauce.dislikes--;
                const newArray = sauce.usersDisliked.filter(id => id != userId);
                sauce.usersDisliked = newArray;
                await sauce.save();

                console.log("test : ", newArray);
                console.log("sauce after  : ", sauce);
            }
        }

        if (req.body.like === -1) {
            sauce.usersDisliked.push(userId);
            sauce.dislikes++;
            console.log("sauce : ", sauce);
            await sauce.save();
        }

        // console.log(sauce);
        res.status(200).json({message: "test !"});
    } catch (err) {
        res.status(400).json(err);
    }
};
