const Sauce = require("../models/sauce.model");

exports.getAllSaucesQuery = () => {
    return Sauce.find({}).exec();
};

exports.getSauceQuery = sauceId => {
    return Sauce.findOne({_id: sauceId}).exec();
};

exports.modifySauceQuery = (sauceId, sauceObject) => {
    return Sauce.findByIdAndUpdate(sauceId, {...sauceObject, _id: sauceId}).exec();
};

exports.deleteSauceQuery = sauceId => {
    return Sauce.findByIdAndDelete(sauceId).exec();
};
