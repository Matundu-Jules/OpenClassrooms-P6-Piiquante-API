const bcrypt = require("bcrypt");
const Sauces = require("../models/sauces.model");
const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const {getSauces, getSauce} = require("../queries/sauces.queries");

exports.getAllSauces = async (req, res, next) => {
    const sauces = await getSauces();
    res.status(200).json(sauces);
};

exports.getSauce = async (req, res, next) => {
    const sauce = await getSauce();
    res.status(200).json(sauce);
};
