const express = require('express');
const validate = require('../../middlewares/validate');
const areaValidation = require('../../validations/area.validation');
const areaController = require('../../controllers/area.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.
  route('/')
  .get(auth('getAreas'), areaController.getAreas)
  .post(auth('createArea'), validate(areaValidation.createArea), areaController.createArea);

module.exports = router;
