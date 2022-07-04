const express = require('express');
const validate = require('../../middlewares/validate');
const { documentValidation } = require('../../validations');
const auth = require('../../middlewares/auth');
const multer = require('multer');
const { documentController } = require('../../controllers');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'storage')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
})

var upload = multer({ storage: storage })

const router = express.Router();

router.post('/upload/:userId',
  upload.array('documents', 3),
  documentController.upload
);

module.exports = router;
