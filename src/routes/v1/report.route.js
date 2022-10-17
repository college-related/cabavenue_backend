const express = require('express');
const validate = require("../../middlewares/validate");
const reportController = require("../../controllers/report.controller");
const reportValidation = require("../../validations/report.validation");
const auth = require("../../middlewares/auth");

const router = express.Router();

router
  .route("/")
  .post(auth("manageReports"), validate(reportValidation.createReport), reportController.createReport)
  .get(auth("getReports"), reportController.getReports);

router
  .route("/:reportId")
  .get(auth("getReports"), validate(reportValidation.getReport), reportController.getReport)
  .delete(auth("deleteReport"), validate(reportValidation.deleteReport), reportController.deleteReport);

module.exports = router;
