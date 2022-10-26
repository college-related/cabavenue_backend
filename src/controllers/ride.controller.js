const httpStatus = require("http-status");
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

module.exports = {
  searchRides,
}
