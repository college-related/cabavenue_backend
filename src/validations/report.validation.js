const Joi = require("joi");
const { objectId } = require("./custom.validation");

const createReport = {
    body: Joi.object().keys({
        userId: Joi.string().required().custom(objectId),
        userType: Joi.string().required().valid('user', 'driver'),
        userName: Joi.string().required(),
        report: Joi.string().required(),
    })
};

const getReport = {
    params: Joi.object().keys({
        reportId: Joi.string().required().custom(objectId),
    }),
};

const deleteReport = {
    params: Joi.object().keys({
        reportId: Joi.string().required().custom(objectId),
    }),
}

module.exports = {
    createReport,
    getReport,
    deleteReport,
}
