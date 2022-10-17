const allRoles = {
  user: ['getAreas'],
  admin: ['getUsers', 'manageUsers', 'getAreas', 'createArea', 'manageAreas',],
  driver: ['toggleAvailability'],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
