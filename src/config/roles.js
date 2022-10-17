const allRoles = {
  user: ['getAreas', 'manageReports'],
  admin: ['getUsers', 'manageUsers', 'getAreas', 'createArea', 'manageAreas', 'deleteReport', 'getReports'],
  driver: ['toggleAvailability', 'manageReports'],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
