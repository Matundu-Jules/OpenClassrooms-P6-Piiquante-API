const bcrypt = require("bcrypt");
const Sauce = require("../models/sauce.model");
const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const {getSauces, getSauce} = require("../queries/sauces.queries");
const util = require("util");
const path = require("path");

// Création de sauce à partir des données formulaire :
exports.createSauce = async (req, res, next) => {
    try {
        const sauceObject = JSON.parse(req.body.sauce);
        const sauceFile = req.file;
        console.log("sauceObject : ", sauceObject);
        console.log("FILE :", sauceFile);
        const sauce = new Sauce({
            ...sauceObject,
            imageUrl: `${req.protocol}://${req.get("host")}/uploads/images/${req.file.filename}`,
            likes: 0,
            dislikes: 0,
            usersLiked: [],
            usersDisliked: [],
        });
        await sauce.save();

        console.log("LA SAUCE : ", sauce);
        console.log("LA SAUCE ID : ", sauce._id);

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
        console.log(req.params);

        const sauceId = req.params.id;
        const sauce = await getSauce(sauceId);
        console.log(sauce);
        res.status(200).json(sauce);
    } catch (err) {
        res.status(400).json({err});
    }
};
