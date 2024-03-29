const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const docsRoute = require('./docs.route');
const config = require('../../config/config');
const areaRoute = require('./area.route');
const reportRoute = require('./report.route');
const adminRoute = require('./admin.route');
const rideRoute = require('./ride.route');
const deviceRoute = require('./device.route');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/areas',
    route: areaRoute,
  },
  {
    path: '/reports',
    route: reportRoute,
  },
  {
    path: '/admin',
    route: adminRoute,
  },
  {
    path: '/rides',
    route: rideRoute,
  },
  {
    path: '/devices',
    route: deviceRoute,
  }
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
