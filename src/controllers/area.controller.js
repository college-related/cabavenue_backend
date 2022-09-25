const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { areaService } = require('../services');

const createArea = catchAsync(async (req, res) => {
  const area = await areaService.createArea(req.body);
  res.status(httpStatus.CREATED).send(area);
});

const getAreas = catchAsync(async (req, res) => {
  const result = await areaService.getAreas();
  res.send(result);
});

// const getUser = catchAsync(async (req, res) => {
//   const user = await userService.getUserById(req.params.userId);
//   if (!user) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
//   }
//   res.send(user);
// });

const updateArea = catchAsync(async (req, res) => {
  const area = await areaService.updateAreaById(req.params.areaId, req.body);
  res.send(area);
});

const deleteArea = catchAsync(async (req, res) => {
  await areaService.deleteAreaById(req.params.areaId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createArea,
  getAreas,
  updateArea,
  deleteArea,
};
