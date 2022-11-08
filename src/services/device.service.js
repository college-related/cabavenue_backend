const httpStatus = require("http-status");
const { Device } = require("../models");
const { NotificationManagerDriver } = require("../helper/NotificationManagerDriver");
const ApiError = require("../utils/ApiError");
const { NotificationManagerPassenger } = require("../helper/NotificationManagerPassenger");

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
  const device = await Device.findOne({ firebaseToken: id });
  if(!device){
    throw new ApiError(httpStatus.NOT_FOUND, "Device not found");
  }
  device.user = null;
  await device.save();
}

const notifyDevice = async (userId, body) => {
  const { title, desc, to } = body;

  const device = await Device.find({ user: userId });

  const notification = {
    title: title,
    body: desc,
  }

  const firebaseTokens = device.map((device) => device.firebaseToken);

  if(to === 'driver'){
    NotificationManagerDriver.sendToDevices(notification, firebaseTokens);
  }else{
    console.log("passenger lai send bhayo???")
    NotificationManagerPassenger.sendToDevices(notification, firebaseTokens);
  }
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
