const Joi = require("joi");
const { objectId } = require("./custom.validation");

const createRide = {
  body: Joi.object().keys({
    source: Joi.object().keys({
      name: Joi.string().required(),
      latitude: Joi.number().required(),
      longitude: Joi.number().required(),
    }),
    destination: Joi.object().keys({
      name: Joi.string().required(),
      latitude: Joi.number().required(),
      longitude: Joi.number().required(),
    }),
    price: Joi.number().required(),
    driver: Joi.string().required().custom(objectId),
    passenger: Joi.string().required().custom(objectId),
    status: Joi.string().valid("pending", "accepted", "completed"),
    rating: Joi.number(),
  }),
}

const updateRide = {
  params: Joi.object().keys({
    rideId: Joi.string().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      source: Joi.object().keys({
        name: Joi.string().required(),
        latitude: Joi.number().required(),
        longitude: Joi.number().required(),
      }).optional(),
      destination: Joi.object().keys({
        name: Joi.string().required(),
        latitude: Joi.number().required(),
        longitude: Joi.number().required(),
      }).optional(),
      price: Joi.number().optional(),
      driver: Joi.string().optional().custom(objectId),
      passenger: Joi.string().optional().custom(objectId),
      status: Joi.string().optional().valid("pending", "accepted", "completed"),
      rating: Joi.number().optional(),
    })
    .min(1),
}

const deleteRide = {
  params: Joi.object().keys({
    rideId: Joi.string().custom(objectId),
  }),
}

const searchRide = {
  params: Joi.object().keys({
    lat: Joi.number().required(),
    lng: Joi.number().required(),
  }),
  body: Joi.object().keys({
    source: Joi.object().keys({
      name: Joi.string().required(),
      latitude: Joi.number().required(),
      longitude: Joi.number().required(),
    }),
    destination: Joi.object().keys({
      name: Joi.string().required(),
      latitude: Joi.number().required(),
      longitude: Joi.number().required(),
    }),
  }),
};

module.exports = {
  searchRide,
  createRide,
  updateRide,
  deleteRide,
}
