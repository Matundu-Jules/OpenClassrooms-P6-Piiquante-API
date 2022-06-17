const User = require("../models/user.model");

exports.userExist = email => {
    return User.findOne({email}).exec();
};
