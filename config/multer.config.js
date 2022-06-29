const multer = require("multer");
const path = require("path");

// Définition des formats d'image supportés :
const MIME_TYPES = {
    "image/jpg": "jpg",
    "image/jpeg": "jpg",
    "image/png": "png",
};

const storage = multer.diskStorage({
    // Chemin de destination des images :
    destination: function (request, file, callback) {
        callback(null, "uploads/images");
    },
    filename: function (req, file, callback) {
        // Remplacer les espaces du nom de fichier par des '_':
        const name = file.originalname.split(" ").join("_");
        callback(null, Date.now() + "-" + name);
    },
});

// Autoriser uniquement les images des types déclaré au préalable :
const fileFilter = (req, file, cb) => {
    if (!MIME_TYPES[file.mimetype]) {
        cb(new Error("Seuls les formats JPG et PNG sont pris en charge."));
    } else {
        cb(null, true);
    }
};

// Exportation de la configuration multer pour la gestion des images :
module.exports = multer({
    storage,
    limits: {
        fieldSize: 1024 * 1024 * 3,
    },
    fileFilter: fileFilter,
}).single("image");
