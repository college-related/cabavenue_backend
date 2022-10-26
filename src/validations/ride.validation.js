const Joi = require("joi");
// const { objectId } = require("./custom.validation");

const searchRide = {
  params: Joi.object().keys({
    lat: Joi.number().required(),
    lng: Joi.number().required(),
  }),
};

module.exports = {
  searchRide,
}
