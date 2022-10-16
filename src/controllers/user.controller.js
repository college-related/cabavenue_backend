const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService } = require('../services');
const { Area } = require('../models');

const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);

  if(req.body.area) {
    const area = await Area.findById(userBody.area.id);

    if(!area) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Area not found');
    }

    area.driverList.push(user._id);
    area.save();
  }

  res.status(httpStatus.CREATED).send(user);
});

const getUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await userService.queryUsers(filter, options);
  res.send(result);
});

const getUsersByRole = catchAsync(async (req, res) => {
  const result = await userService.queryUsersByRole(req.params.role);
  res.send(result);
});

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(user);
});

const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUserById(req.params.userId, req.body);
  res.send(user);
});

const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send();
});

const getDashboard = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  const dashboard = await userService.getDashboard(user);

  res.status(httpStatus.OK).send(dashboard);
});

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getDashboard,
  getUsersByRole,
};
