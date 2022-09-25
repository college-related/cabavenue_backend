const Joi = require("joi");
const { objectId } = require("./custom.validation");

const createArea = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    latitude: Joi.string().required(),
    longitude: Joi.string().required(),
    radius: Joi.number().required(),
  }),
};

const getArea = {
  params: Joi.object().keys({
    areaId: Joi.string().required().custom(objectId),
  }),
}

const updateArea = {
  params: Joi.object().keys({
    areaId: Joi.string().required().custom(objectId),
  }),
  body: Joi.object().keys({
    name: Joi.string().optional(),
    latitude: Joi.string().optional(),
    longitude: Joi.string().optional(),
    radius: Joi.number().optional(),
    driverList: Joi.array().optional(),
  }),
}

const deleteArea = {
  params: Joi.object().keys({
    areaId: Joi.string().required().custom(objectId),
  }),
}

module.exports = {
  createArea,
  getArea,
  updateArea,
  deleteArea,
}
