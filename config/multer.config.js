const multer = require("multer");
const path = require("path");

const MIME_TYPES = {
    "image/jpg": "jpg",
    "image/jpeg": "jpg",
    "image/png": "png",
};

const storage = multer.diskStorage({
    destination: function (request, file, callback) {
        //    callback(null, "./upload/images");
        callback(null, "uploads/images");
    },
    filename: function (req, file, callback) {
        // Si l'user selectionne une image dont le nom contient des espaces alors,
        //  on remplace les espaces par des _ .
        const name = file.originalname.split(" ").join("_");
        const extension = MIME_TYPES[file.mimetype];
        //    console.log(Date.now() + "-" + name + "." + extension);
        //    console.log("PATH : ", path.join(__dirname, "../upload/images"));
        callback(null, Date.now() + "-" + name);
    },
});

const upload = multer({
    storage: storage,
    limits: {
        fieldSize: 1024 * 1024 * 3,
    },
});

console.log(storage);

module.exports = multer({storage}).single("image");
