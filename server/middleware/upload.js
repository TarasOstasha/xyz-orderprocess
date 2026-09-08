require('dotenv').config();
const path = require('node:path');
const fs = require('node:fs');
const multer = require('multer');
const createHttpError = require('http-errors');
const { STATIC_PATH } = require('../constants');

const imagesDir = path.join(STATIC_PATH, 'images');
fs.mkdirSync(imagesDir, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    fs.mkdirSync(imagesDir, { recursive: true });
    cb(null, imagesDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + Date.now() + ext);
  },
});

function fileFilter(req, file, cb) {
  const MIMETYPE_REG_EXP = /^image\/(gif|png|jpeg|jpg)$/;

  if (MIMETYPE_REG_EXP.test(file.mimetype)) {
    return cb(null, true);
  }

  cb(createHttpError(415, 'Support only jpeg/jpg/png/gif mimetypes'));
}

const upload = multer({ storage, fileFilter });

module.exports.uploadTaskPhoto = upload.any();
