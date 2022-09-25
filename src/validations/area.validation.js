const Joi = require('joi');

const createArea = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    latitude: Joi.string().required(),
    longitude: Joi.string().required(),
    radius: Joi.number().required(),
  }),
};

module.exports = {
  createArea,
};
