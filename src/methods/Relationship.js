const MethodBuilder = require("../util/MethodBuilder");

const methods = {
  addRelationship: function() {},
  getRolePlayers: function() {},
  getRolePlayersByRoles: function() {},
  setRolePlayer: function() {},
  unsetRolePlayer: function() {}
};

module.exports = {
  get: function() {
    return methods;
  }
};