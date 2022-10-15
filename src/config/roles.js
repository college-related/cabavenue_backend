const allRoles = {
  user: [],
  admin: ['getUsers', 'manageUsers', 'getAreas', 'createArea', 'manageAreas',],
  driver: [],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
