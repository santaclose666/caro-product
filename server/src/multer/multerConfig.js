const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: "./public/avatars",
  filename: (req, file, cb) => {
    const fileName = req.body.fileName;
    const newImg = fileName + ".jpg";
    cb(null, newImg);
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
