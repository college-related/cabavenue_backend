const Joi = require('joi');
const { objectId } = require('./custom.validation');

const upload = {
  body: Joi.object().keys({
    citizenship: Joi.object().required(),
    license: Joi.object().required(),
    bluebook: Joi.object().required(),
  }),
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  upload,
};
