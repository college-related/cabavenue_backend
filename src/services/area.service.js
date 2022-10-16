const httpStatus = require("http-status");
const { Area } = require("../models")
const ApiError = require("../utils/ApiError")

const createArea = async (areaBody) => {
  if(await Area.isNameTaken(areaBody.name)){
    throw new ApiError(httpStatus.BAD_REQUEST, "Area name already taken");
  }
  return Area.create(areaBody);
}

const getAreas = async () => {
  return Area.find({});
}

const getArea = async (id) => {
  return Area.findById(id);
}

const updateArea = async (id, updatedBody) => {
  const area = await getArea(id);
  if(!area){
    throw new ApiError(httpStatus.NOT_FOUND, "Area not found");
  }
  if(await Area.isNameTaken(updatedBody.name) && area.name !== updatedBody.name){
    throw new ApiError(httpStatus.BAD_REQUEST, "Area name already taken");
  }
  Object.assign(area, updatedBody);
  await area.save();
  return area;
}

const deleteArea = async (id) => {
  const area = await getArea(id);
  if(!area){
    throw new ApiError(httpStatus.NOT_FOUND, "Area not found");
  }
  await area.remove();
}

module.exports = {
  createArea,
  getAreas,
  getArea,
  updateArea,
  deleteArea,
}
