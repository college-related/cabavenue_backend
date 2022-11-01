const express = require('express');
const validate = require("../../middlewares/validate");
const deviceController = require("../../controllers/device.controller");
const deviceValidation = require("../../validations/device.validation");
const auth = require("../../middlewares/auth");

const router = express.Router();

router
  .route("/")
  .post(validate(deviceValidation.createDevice), deviceController.createDevice)

router
  .route("/notify/:userId")
  .post(auth(), validate(deviceValidation.notifyDevice), deviceController.notifyDevice);

router
  .route("/:deviceId")
  .get(auth(), validate(deviceValidation.getDevice), deviceController.getDevice)
  .patch(auth(), validate(deviceValidation.updateDevice), deviceController.updateDevice)
  .delete(auth(), validate(deviceValidation.deleteDevice), deviceController.deleteDevice);

router
  .route("/byFirebaseToken/:firebaseToken")
  .get(validate(deviceValidation.getDeviceByFirebaseToken), deviceController.getDeviceByFirebaseToken);

module.exports = router;
