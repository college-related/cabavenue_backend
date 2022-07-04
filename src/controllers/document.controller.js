const httpStatus = require('http-status');
const { Document } = require('../models');
const catchAsync = require('../utils/catchAsync');
const fs = require('fs')

const upload = catchAsync(async (req, res) => {

    let documents = [];

    for (let i = 0; i < req.files.length; i++) {
      var img = fs.readFileSync(req.files[i].path);
      var encode_img = img.toString('base64');
      var final_img = {
          contentType: req.files[i].mimetype,
          image: new Buffer.from(encode_img,'base64')
      };

      documents[i] = await Document.create({
        name: `name${new Date().toString()}`,
        user: req.params.userId,
        img: final_img,
      });
    }

  res.status(httpStatus.CREATED).json({ documents });
})

module.exports = {
  upload,
}
