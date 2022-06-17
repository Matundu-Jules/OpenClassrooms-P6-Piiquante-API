const saucesCtlr = require("../controllers/sauces.controller");
const jwt = require("../config/jwt.config");
const router = require("express").Router();

router.get("/", jwt.verifyJwtToken, saucesCtlr.getAllSauces);
router.get("/:id", jwt.verifyJwtToken, saucesCtlr.getSauce);

module.exports = router;
