const httpStatus = require('http-status');
const { Area } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a user
 * @param {Object} areaBody
 * @returns {Promise<User>}
 */
const createArea = async (areaBody) => {
  return Area.create(areaBody);
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
// const queryUsers = async (filter, options) => {
//   const users = await User.paginate(filter, options);
//   return users;
// };

const getAreas = async () => {
  return await Area.find({});
}
/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getAreaById = async (id) => {
  return Area.findById(id);
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateAreaById = async (areaId, updateBody) => {
  const area = await getAreaById(areaId);
  if (!area) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Area not found');
  }
  Object.assign(area, updateBody);
  await area.save();
  return area;
};

/**
 * Delete user by id
 * @param {ObjectId} areaId
 * @returns {Promise<User>}
 */
const deleteAreaById = async (areaId) => {
  const area = await getAreaById(areaId);
  if (!area) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Area not found');
  }
  await area.remove();
  return area;
};

module.exports = {
  createArea,
  getAreas,
  updateAreaById,
  deleteAreaById,
};
