const httpStatus = require('http-status');
const fetch = require('node-fetch');
const config = require('../config/config');
const { User, Area, Report, Ride } = require('../models');
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
  const users = await User.find({ role: 'driver', area: areaId, isAvailable: true, isInRide: false });
  const drivers = users.map(user => {
    return {
      id: user._id,
      name: user.name,
      vehicle: user.vehicleData,
      img: user.profileUrl,
      phone: user.phone,
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

  const rides = await Ride.find({ driver: user._id, status: 'completed', rating: { $exists: true } });

  if(user.rideHistory.length > 0) {
    dashboard = {
      totalRides: user.rideHistory.length,
      totalEarnings: user.rideHistory.reduce((total, ride) => total + ride.price, 0),
      totalRating: calculateTotalRating(rides),
      totalsToday: {
        totalRides: user.rideHistory.filter(ride => ride?.createdAt?.toDateString() === new Date().toDateString()).length,
        totalEarnings: user.rideHistory.reduce((total, ride) => total + (ride?.createdAt?.toDateString() === new Date().toDateString() ? ride.price : 0), 0),
      },
    };
  }

  return dashboard;
};

const calculateTotalRating  = (rides) => {
  const totalOneRating = rides.filter(ride => ride.rating === 1).length * 1;
  const totalTwoRating = rides.filter(ride => ride.rating === 2).length * 2;
  const totalThreeRating = rides.filter(ride => ride.rating === 3).length * 3;
  const totalFourRating = rides.filter(ride => ride.rating === 4).length * 4;
  const totalFiveRating = rides.filter(ride => ride.rating === 5).length * 5;


  const totalRating = totalOneRating + totalTwoRating + totalThreeRating + totalFourRating + totalFiveRating;

  return parseInt(totalRating / rides.length);
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
        if(user.favoritePlaces[i].latitude !== place.latitude || user.favoritePlaces[i].longitude !== place.longitude) {
          const res = await fetch(`https://api.geoapify.com/v1/geocode/reverse?lat=${place.latitude}&lon=${place.longitude}&apiKey=${config.geoapify.key}`)
          const data = await res.json();
          place['name'] = data.features[0].properties.name;
        }else{
          place['name'] = user.favoritePlaces[i].name;
        }
        user.favoritePlaces[i] = place;
        break;
      }
    }
  }else{
    const res = await fetch(`https://api.geoapify.com/v1/geocode/reverse?lat=${place.latitude}&lon=${place.longitude}&apiKey=${config.geoapify.key}`)
    const data = await res.json();
    place['name'] = data.features[0].properties.name;

    user.favoritePlaces.push(place);
  }
  await user.save();
  return user;
}

const getFavoritePlaces = async (user) => {
  let fav = {
    favoritePlaces: [],
    iconList: [],
  }
  if(user.favoritePlaces.length > 0){
    fav = {
      favoritePlaces: user.favoritePlaces,
      iconList: user.favoritePlaces.map(place => place.iconIndex),
    }
  }

  return fav;
}

const deleteFavoritePlaces = async (user, index) => {
  user.favoritePlaces = user.favoritePlaces.filter(place => place.iconIndex !== index);
  await user.save();
  return user;
}

const getEmergencyCabs = async () => {
  const users = await User.find({ role: 'driver', isAvailable: true, provideEmergencyService: true, isInRide: false });
  const drivers = users.map(user => {
    return {
      name: user.name,
      vehicle: user.vehicleData,
      phone: user.phone,
    }
  });
  return drivers;
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
  getEmergencyCabs,
};
