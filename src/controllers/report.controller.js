const httpStatus = require("http-status");
const { reportService } = require("../services");
const catchAsync = require('../utils/catchAsync');

const createReport = catchAsync(async (req, res) => {
    const report = await reportService.createReport(req.body);
    res.status(httpStatus.CREATED).send(report);
})

const getReports = catchAsync(async (req, res) => {
    const reports = await reportService.getReports();
    res.status(httpStatus.OK).send(reports);
})

const getReport = catchAsync(async (req, res) => {
    const report = await reportService.getReport(req.params.reportId);
    res.status(httpStatus.OK).send(report);
})

const deleteReport = catchAsync(async (req, res) => {
    await reportService.deleteReport(req.params.reportId);
    res.status(httpStatus.NO_CONTENT).send();
})

module.exports = {
    createReport,
    getReports,
    getReport,
    deleteReport,
}
