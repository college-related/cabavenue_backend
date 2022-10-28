const httpStatus = require('http-status');
const { User, Area, Report } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  if (await User.isPhoneNumberTaken(userBody.phone)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Phone Number already taken');
  }
  return User.create(userBody);
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
const queryUsers = async (filter, options) => {
  const users = await User.paginate(filter, options);
  return users;
};

const queryUsersByRole = async (role) => {
  let users = await User.find({ role: role });
  return users;
}

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
  return User.findById(id);
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
  return User.findOne({ email });
};

/**
 * Get user by phone number
 * @param {Number} phone
 * @returns {Promise<User>}
 */
const getUserByPhone = async (phone) => {
  return User.findOne({ phone });
}

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.remove();
  return user;
};

const getDriversByArea = async (areaId) => {
  const users = await User.find({ role: 'driver', area: areaId});
  const drivers = users.map(user => {
    return {
      id: user._id,
      name: user.name,
      vehicle: user.vehicleData,
      img: user.profileUrl,
    }
  });
  return drivers;
}

const getDashboard = async (user) => {
  let dashboard = {
    totalRides: 0,
    totalEarnings: 0,
    totalRating: 0,
    totalsToday: {
      totalRides: 0,
      totalEarnings: 0,
    }
  }

  if(user.rideHistory.length > 0) {
    dashboard = {
      totalRides: user.rideHistory.length,
      totalEarnings: user.rideHistory.reduce((total, ride) => total + ride.price, 0),
      totalRating: calculateTotalRating(user.rideHistory),
      totalsToday: {
        totalRides: user.rideHistory.filter(ride => ride?.createdAt?.toDateString() === new Date().toDateString()).length,
        totalEarnings: user.rideHistory.reduce((total, ride) => total + (ride?.createdAt?.toDateString() === new Date().toDateString() ? ride.price : 0), 0),
      },
    };
  }

  return dashboard;
};

const calculateTotalRating  = (rideHistory) => {
  const totalZeroRating = rideHistory.filter(ride => ride.rating === 0).length * 0;
  const totalOneRating = rideHistory.filter(ride => ride.rating === 1).length * 1;
  const totalTwoRating = rideHistory.filter(ride => ride.rating === 2).length * 2;
  const totalThreeRating = rideHistory.filter(ride => ride.rating === 3).length * 3;
  const totalFourRating = rideHistory.filter(ride => ride.rating === 4).length * 4;
  const totalFiveRating = rideHistory.filter(ride => ride.rating === 5).length * 5;

  const totalRating = totalZeroRating + totalOneRating + totalTwoRating + totalThreeRating + totalFourRating + totalFiveRating;

  return totalRating / rideHistory.length;
}

const getAdminDashboard = async () => {
  return {
    totalUsers: await User.find({ role: 'user' }).countDocuments(),
    totalDrivers: await User.find({ role: 'driver' }).countDocuments(),
    totalAreas: await Area.find().countDocuments(),
    totalReports: await Report.find().countDocuments(),
  }
}

const toggleAvailability = async (user) => {
  user.isAvailable = !user.isAvailable;
  await user.save();
  return user;
}

const favoritePlaces = async (user, place) => {
  if(place.index !== undefined) {
    for(let i = 0; i < user.favoritePlaces.length; i++) {
      if(user.favoritePlaces[i].iconIndex === place.index) {
        user.favoritePlaces[i] = place;
        break;
      }
    }
  }else{
    user.favoritePlaces.push(place);
  }
  await user.save();
  return user;
}

const getFavoritePlaces = async (user) => {
  const fav = {
    favoritePlaces: user.favoritePlaces,
    iconList: user.favoritePlaces.map(place => place.iconIndex),
  }

  return fav;
}

const deleteFavoritePlaces = async (user, index) => {
  user.favoritePlaces = user.favoritePlaces.filter(place => place.iconIndex !== index);
  await user.save();
  return user;
}

module.exports = {
  createUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  getUserByPhone,
  updateUserById,
  deleteUserById,
  getDashboard,
  queryUsersByRole,
  toggleAvailability,
  getAdminDashboard,
  getDriversByArea,
  favoritePlaces,
  getFavoritePlaces,
  deleteFavoritePlaces,
};
