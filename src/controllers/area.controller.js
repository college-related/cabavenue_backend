const httpStatus = require("http-status");
const { areaService } = require("../services");
const catchAsync = require("../utils/catchAsync")

const createArea = catchAsync(async (req, res) => {
  const area = await areaService.createArea(req.body);
  res.status(httpStatus.CREATED).send(area);
})

const getAreas = catchAsync(async (req, res) => {
  const areas = await areaService.getAreas();
  res.status(httpStatus.OK).send(areas);
})

const getArea = catchAsync(async (req, res) => {
  const area = await areaService.getArea(req.params.areaId);
  res.status(httpStatus.OK).send(area);
})

const updateArea = catchAsync(async (req, res) => {
  const area = await areaService.updateArea(req.params.areaId, req.body);
  res.status(httpStatus.OK).send(area);
})

const deleteArea = catchAsync(async (req, res) => {
  await areaService.deleteArea(req.params.areaId);
  res.status(httpStatus.NO_CONTENT).send();
})

module.exports = {
  createArea,
  getAreas,
  getArea,
  updateArea,
  deleteArea,
}
