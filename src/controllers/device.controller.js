const httpStatus = require("http-status");
const { deviceService } = require("../services");
const catchAsync = require("../utils/catchAsync")

const createDevice = catchAsync(async (req, res) => {
  const area = await deviceService.createDevice(req.body);
  res.status(httpStatus.CREATED).send(area);
})

const getDevice = catchAsync(async (req, res) => {
  const area = await deviceService.getDevice(req.params.deviceId);
  res.status(httpStatus.OK).send(area);
})

const updateDevice = catchAsync(async (req, res) => {
  const area = await deviceService.updateDevice(req.params.deviceId, req.body);
  res.status(httpStatus.OK).send(area);
})

const deleteDevice = catchAsync(async (req, res) => {
  await deviceService.deleteDevice(req.params.deviceId);
  res.status(httpStatus.NO_CONTENT).send();
})

const notifyDevice = catchAsync(async (req, res) => {
  await deviceService.notifyDevice(req.params.userId, req.body);
  res.status(httpStatus.OK).send({message: "Notification sent"});
})

const getDeviceByFirebaseToken = catchAsync(async (req, res) => {
  const device = await deviceService.getDeviceByFirebaseToken(req.params.firebaseToken);
  res.status(httpStatus.OK).send(device);
})

module.exports = {
  createDevice,
  getDevice,
  updateDevice,
  deleteDevice,
  notifyDevice,
  getDeviceByFirebaseToken,
}
