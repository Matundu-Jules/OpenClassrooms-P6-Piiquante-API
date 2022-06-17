const Sauces = require("../models/sauces.model");

exports.getSauces = () => {
    return Sauces.find({}).exec();
};

exports.getSauce = sauceId => {
    return Sauces.findOne({_id: sauceId}).exec();
};
