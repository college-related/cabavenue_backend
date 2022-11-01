const Joi = require("joi");
const { objectId } = require("./custom.validation");

const createDevice = {
  body: Joi.object().keys({
    user: Joi.string().optional().custom(objectId),
    firebaseToken: Joi.string().required(),
  }),
};

const getDevice = {
  params: Joi.object().keys({
    deviceId: Joi.string().required().custom(objectId),
  }),
}

const updateDevice = {
  params: Joi.object().keys({
    deviceId: Joi.string().required().custom(objectId),
  }),
  body: Joi.object().keys({
    user: Joi.string().optional().custom(objectId),
    firebaseToken: Joi.string().optional(),
  }),
}

const deleteDevice = {
  params: Joi.object().keys({
    deviceId: Joi.string().required().custom(objectId),
  }),
}

const notifyDevice = {
  params: Joi.object().keys({
    userId: Joi.string().required().custom(objectId),
  }),
  body: Joi.object().keys({
    title: Joi.string().required(),
    desc: Joi.string().required(),
    to: Joi.string().required().valid("passenger", "driver"),
  }),
}

const getDeviceByFirebaseToken = {
  params: Joi.object().keys({
    firebaseToken: Joi.string().required(),
  }),
}

module.exports = {
  createDevice,
  getDevice,
  updateDevice,
  deleteDevice,
  notifyDevice,
  getDeviceByFirebaseToken,
}
