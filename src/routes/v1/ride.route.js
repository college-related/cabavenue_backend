const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const rideValidation = require('../../validations/ride.validation');
const rideController = require('../../controllers/ride.controller');

const router = express.Router();

router
  .route('/')
  .post(auth(), validate(rideValidation.createRide), rideController.createRide);

router
  .route('/:rideId')
  .patch(auth(), validate(rideValidation.updateRide), rideController.updateRide)
  .delete(auth(), validate(rideValidation.deleteRide), rideController.deleteRide);

router
  .route('/my/:driverId')
  .get(auth(), rideController.getRides);

router
  .route('/:lat/:lng')
  .get(auth(), validate(rideValidation.searchRide), rideController.searchRides);

// router
//   .route('/byRole/:role')
//   .get(auth('getUsers'), validate(userValidation.getUsersByRole), userController.getUsersByRole);

module.exports = router;
