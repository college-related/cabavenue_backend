const express = require('express');
const validate = require("../../middlewares/validate");
const areaController = require("../../controllers/area.controller");
const areaValidation = require("../../validations/area.validation");
const auth = require("../../middlewares/auth");

const router = express.Router();

router
  .route("/")
  .post(auth("manageAreas"), validate(areaValidation.createArea), areaController.createArea)
  .get(auth("getAreas"), areaController.getAreas);

router
  .route("/:areaId")
  .get(auth("getAreas"), validate(areaValidation.getArea), areaController.getArea)
  .patch(auth("manageAreas"), validate(areaValidation.updateArea), areaController.updateArea)
  .delete(auth("manageAreas"), validate(areaValidation.deleteArea), areaController.deleteArea);

module.exports = router;
