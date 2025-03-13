require('dotenv').config();
const path = require('node:path');
const fs = require('node:fs');
const multer = require('multer');
const createHttpError = require('http-errors');


if (!fs.existsSync(process.env.STATIC_FOLDER)) {
  fs.mkdirSync(process.env.STATIC_FOLDER, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(process.env.STATIC_FOLDER, 'images'));
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
      cb(null, file.fieldname + '-' + Date.now() + ext);
    },
  });

  function fileFilter (req, file, cb) {
    const MIMETYPE_REG_EXP = /^image\/(gif|png|jpeg|jpg)$/;
  
    //   cb(null, MIMETYPE_REG_EXP.test(file.mimetype));
  
    if (MIMETYPE_REG_EXP.test(file.mimetype)) {
      return cb(null, true);
    }

    cb(createHttpError(415, 'Support only jpeg/jpg/png/gif mimetypes'));
  }

  const upload = multer({ storage, fileFilter });

  module.exports.uploadTaskPhoto = upload.any();