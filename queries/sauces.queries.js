const Sauce = require("../models/sauce.model");

exports.getSauces = () => {
    return Sauce.find({}).exec();
};

exports.getSauce = sauceId => {
    return Sauce.findOne({_id: sauceId}).exec();
};
