const saucesCtlr = require("../controllers/sauces.controller");
const jwt = require("../config/jwt.config");
const router = require("express").Router();
const multer = require("../config/multer.config");

router.get("/", jwt.verifyJwtToken, saucesCtlr.getAllSauces);
router.post("/", jwt.verifyJwtToken, multer, saucesCtlr.createSauce);
router.get("/:id", jwt.verifyJwtToken, saucesCtlr.getSauce);

module.exports = router;
