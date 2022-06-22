const bcrypt = require("bcrypt");
const Sauce = require("../models/sauce.model");
const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const {getSauces, getSauce, modifySauce} = require("../queries/sauces.queries");
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

exports.modifySauce = async (req, res, next) => {
    try {
        const sauceId = req.params.id;
        console.log(sauceId);

        // const sauce = JSON.parse(req.body.sauce);
        // console.log({sauce});

        const file = req.file;
        console.log("file :", file);

        const sauceObject = req.file
            ? {
                  ...JSON.parse(req.body.sauce),
                  imageUrl: `${req.protocol}://${req.get("host")}/uploads/images/${req.file.filename}`,
              }
            : {...req.body};

        if (req.file) {
            const initialModifiedSauce = await getSauce(sauceId);
            console.log("initialModifiedSauce : ", initialModifiedSauce);
            const imgUrl = initialModifiedSauce.imageUrl;
            console.log(imgUrl);

            const path = "./uploads/images/" + imgUrl.split("/")[5];
            console.log("PATH : ", path);

            fs.unlink(path, err => {
                if (err) throw err;
                console.log("File delete !");
            });
        }

        console.log("sauceObject : ", sauceObject);
        await modifySauce(sauceId, sauceObject);
        res.status(201).json({message: "La modification de la sauce a bien été effectuer."});
    } catch (err) {
        res.status(400).json(err);
    }
};
