const httpStatus = require("http-status");
const { Report } = require('../models');
const ApiError = require('../utils/ApiError');

const createReport = async (reportBody) => {
    return Report.create(reportBody);
}

const getReports = async () => {
    return Report.find({});
}

const getReport = async (id) => {
    const report = await Report.findById(id);
    if(!report){
        throw new ApiError(httpStatus.NOT_FOUND, "Report not found");
    }
    return report;
}

const deleteReport = async (id) => {
    const report = await getReport(id);
    if(!report){
        throw new ApiError(httpStatus.NOT_FOUND, "Report not found");
    }

    const reports = await Report.find({ userId: report.userId });

    reports.forEach(async r => {
        await r.remove();
    })
}

module.exports = {
    createReport,
    getReports,
    getReport,
    deleteReport,
}
