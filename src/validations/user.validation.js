const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const createUser = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    name: Joi.string().required(),
    role: Joi.string().required().valid('user', 'admin'),
    phone: Joi.number().required(),
    secondaryPhone: Joi.number().optional(),
    address: Joi.string().required(),
    area: Joi.object().optional(),
  }),
};

const getUsers = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const getUsersByRole = {
  params: Joi.object().keys({
    role: Joi.string().required().valid('user', 'admin', 'driver'),
  }),
}

const updateUser = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().email().optional(),
      password: Joi.string().custom(password).optional(),
      name: Joi.string().optional(),
      phone: Joi.number().optional(),
      secondaryPhone: Joi.number().optional(),
      address: Joi.string().optional(),
      area: Joi.object().optional(),
      isEnabled: Joi.boolean().optional(),
      vehicleData: Joi.object().optional(),
      isAvailable: Joi.boolean().optional(),
      documents: Joi.array().optional(),
      profileUrl: Joi.string().optional(),
      favoritePlaces: Joi.array().optional(),
    })
    .min(1),
};

const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const favoriteUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
  body: Joi.object().keys({
    name: Joi.string().required(),
    givenName: Joi.string().required(),
    latitude: Joi.number().required(),
    longitude: Joi.number().required(),
    iconIndex: Joi.number().required(),
    index: Joi.number().optional(),
  }),
}

const deleteFavorite = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
  body: Joi.object().keys({
    index: Joi.number().required(),
  }),
}

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getUsersByRole,
  favoriteUser,
  deleteFavorite,
};
