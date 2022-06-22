const Sauce = require("../models/sauce.model");

exports.getSauces = () => {
    return Sauce.find({}).exec();
};

exports.getSauce = sauceId => {
    return Sauce.findOne({_id: sauceId}).exec();
};

exports.modifySauce = (sauceId, sauceObject) => {
    return Sauce.findByIdAndUpdate(sauceId, {...sauceObject, _id: sauceId}).exec();
};

exports.deleteSauceQuery = sauceId => {
    return Sauce.findByIdAndDelete(sauceId).exec();
};
