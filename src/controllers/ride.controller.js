const httpStatus = require("http-status");
const fetch = require("node-fetch");
const config = require("../config/config");
const { Ride } = require("../models");
const { areaService, userService } = require("../services");
const catchAsync = require("../utils/catchAsync");
const { calculateDistance, calculatePrice } = require("../utils/rides");

const searchRides = catchAsync(async (req, res) => {
  const { lat, lng } = req.params;
  const { source, destination } = req.body;

  const areas = await areaService.getAreas();

  const distances = areas.map((area) => calculateDistance(lat, area.latitude, lng, area.longitude));
  const index = distances.indexOf(Math.min(...distances));

  const drivers = await userService.getDriversByArea(areas[index]._id);

  const rideDistance = calculateDistance(source.latitude, destination.latitude, source.longitude, destination.longitude);
  const price = calculatePrice(rideDistance);

  res.status(httpStatus.OK).send({
    drivers: drivers,
    price,
  });
})

const createRide = catchAsync(async (req, res) => {
  const result = await fetch(`https://api.geoapify.com/v1/geocode/reverse?lat=${req.body.source.latitude}&lon=${req.body.source.longitude}&apiKey=${config.geoapify.key}`)
  const data = await result.json();
  req.body.source.name = data.features[0].properties.road ?? data.features[0].properties.name;

  const ride = await Ride.create(req.body);
  res.status(httpStatus.CREATED).send(ride);
})

const getRides = catchAsync(async (req, res) => {
  const { driverId } = req.params;
  const { filter } = req.query;

  let rides;
  if(filter === "all") {
    rides = await Ride.find({ driver: driverId }, { source: 1, destination: 1, price: 1, createdAt: 1, passenger: 1, driver: 1, status: 1 });
  }else{
    rides = await Ride.find({ driver: driverId, status: { $ne: "completed" } }, { source: 1, destination: 1, price: 1, createdAt: 1, passenger: 1, driver: 1, status: 1 });
  }

  res.status(httpStatus.OK).send(rides);
})

const updateRide = catchAsync(async (req, res) => {
  const { rideId } = req.params;

  const ride = await Ride.findByIdAndUpdate(rideId, req.body, { new: true });

  if(req.body.status != null) {
    const driver = await userService.getUserById(ride.driver);
    if(!driver){
      throw new ApiError(httpStatus.NOT_FOUND, "Driver not found");
    }
    const passenger = await userService.getUserById(ride.passenger);
    if(!passenger){
      throw new ApiError(httpStatus.NOT_FOUND, "Passenger not found");
    }

    if(req.body.status === "accepted") {
      driver.isInRide = true;
      driver.isAvailable = false;

      passenger.isInRide = true;
    }else{
      driver.isInRide = false;
      driver.isAvailable = true;
      driver.rideHistory.push({
        source: ride.source.name,
        destination: ride.destination.name,
        price: ride.price,
        driver: {
          name: driver.name,
          id: driver._id,
        },
        user: {
          name: passenger.name,
          id: passenger._id,
        },
        rating: 0,
        createdAt: ride.createdAt,
      });

      passenger.isInRide = false;
      passenger.rideHistory.push({
        source: ride.source.name,
        destination: ride.destination.name,
        price: ride.price,
        driver: {
          name: driver.name,
          id: driver._id,
        },
        user: {
          name: passenger.name,
          id: passenger._id,
        },
        rating: 0,
        createdAt: ride.createdAt,
      });
    }
    await driver.save();
    await passenger.save();
  }

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
