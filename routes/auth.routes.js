const authCtrl = require("../controllers/auth.controller");
const router = require("express").Router();

router.post("/signup", authCtrl.userSignup);
router.post("/login", authCtrl.userLogin);

module.exports = router;
