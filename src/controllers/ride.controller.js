const httpStatus = require("http-status");
const { Ride } = require("../models");
const { areaService, userService } = require("../services");
const catchAsync = require("../utils/catchAsync");
const { calculateDistance } = require("../utils/rides");

const searchRides = catchAsync(async (req, res) => {
  const { lat, lng } = req.params;

  const areas = await areaService.getAreas();

  const distances = areas.map((area) => calculateDistance(lat, area.latitude, lng, area.longitude));
  const index = distances.indexOf(Math.min(...distances));

  const drivers = await userService.getDriversByArea(areas[index]._id);

  res.status(httpStatus.OK).send({
    drivers: drivers,
    price: 300,
  });
})

const createRide = catchAsync(async (req, res) => {
  const ride = await Ride.create(req.body);
  res.status(httpStatus.CREATED).send(ride);
})

const getRides = catchAsync(async (req, res) => {
  const { driverId } = req.params;

  const rides = await Ride.find({ driver: driverId }, { source: 1, destination: 1, price: 1, createdAt: 1, passenger: 1, driver: 1 });
  res.status(httpStatus.OK).send(rides);
})

const updateRide = catchAsync(async (req, res) => {
  const { rideId } = req.params;

  const ride = await Ride.findByIdAndUpdate(rideId, req.body, { new: true });
  res.status(httpStatus.OK).send(ride);
});

const deleteRide = catchAsync(async (req, res) => {
  const { rideId } = req.params;

  await Ride.findByIdAndDelete(rideId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  searchRides,
  createRide,
  getRides,
  updateRide,
  deleteRide,
}
