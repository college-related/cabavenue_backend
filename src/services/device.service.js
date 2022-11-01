const httpStatus = require("http-status");
const { Device } = require("../models");
const { NotificationManager } = require("../NotificationManager");
const ApiError = require("../utils/ApiError")

const createDevice = async (deviceBody) => {
  return Device.create(deviceBody);
}

const getDevices = async () => {
  return Device.find({});
}

const getDevice = async (id) => {
  return Device.findById(id);
}

const updateDevice = async (id, updatedBody) => {
  const device = await getDevice(id);
  if(!device){
    throw new ApiError(httpStatus.NOT_FOUND, "Device not found");
  }
  Object.assign(device, updatedBody);
  await device.save();
  return device;
}

const deleteDevice = async (id) => {
  const device = await getDevice(id);
  if(!device){
    throw new ApiError(httpStatus.NOT_FOUND, "Device not found");
  }
  await device.remove();
}

const notifyDevice = async (userId, body) => {
  const { title, desc } = body;

  const device = await Device.findOne({ user: userId });

  if(!device){
    throw new ApiError(httpStatus.NOT_FOUND, "Device not found");
  }

  NotificationManager.sendToDevices({title: title, body: desc}, [device.firebaseToken]);
}

const getDeviceByFirebaseToken = async (firebaseToken) => {
  const device = await Device.findOne({ firebaseToken });
  if(!device){
    throw new ApiError(httpStatus.NOT_FOUND, "Device not found");
  }
  return device;
}

module.exports = {
  createDevice,
  getDevices,
  getDevice,
  updateDevice,
  deleteDevice,
  notifyDevice,
  getDeviceByFirebaseToken,
}
