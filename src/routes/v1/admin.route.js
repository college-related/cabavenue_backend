const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const userValidation = require('../../validations/user.validation');
const userController = require('../../controllers/user.controller');

const router = express.Router();

router
  .route('/dashboard')
  .get(auth('dashboardManage'), userController.getAdminDashboard)

router
  .route('/byRole/:role')
  .get(auth('getUsers'), validate(userValidation.getUsersByRole), userController.getUsersByRole);

module.exports = router;
