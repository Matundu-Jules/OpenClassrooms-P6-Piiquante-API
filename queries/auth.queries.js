const User = require("../models/user.model");

exports.userExistQuery = email => {
    return User.findOne({email}).exec();
};
