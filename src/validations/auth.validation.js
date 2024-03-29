const Joi = require('joi');
const { password } = require('./custom.validation');

const register = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    name: Joi.string().required(),
    address: Joi.string().required(),
    phone: Joi.number().required(),
    secondaryPhone: Joi.number().optional(),
    vehicleData: Joi.object().optional(),
    role: Joi.string().optional().valid('user', 'driver', 'admin'),
    area: Joi.string().optional(),
    documents: Joi.array().optional(),
    profileUrl: Joi.string().optional(),
    provideEmergencyService: Joi.boolean().optional(),
  }),
};

const login = {
  body: Joi.object().keys({
    email: Joi.string().optional(),
    phone: Joi.number().optional(),
    password: Joi.string().required(),
  }),
};

const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};

const resetPassword = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
  body: Joi.object().keys({
    password: Joi.string().required().custom(password),
  }),
};

const verifyEmail = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
};

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  verifyEmail,
};
