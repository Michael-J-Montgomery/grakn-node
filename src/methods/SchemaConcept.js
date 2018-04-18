const MethodBuilder = require("../util/MethodBuilder");

const methods = {
  getLabel: function() {
    const getLabelMethod = MethodBuilder.getLabel(this.id);
    return this.communicator.send(getLabelMethod).then(resp =>
      resp
        .getConceptresponse()
        .getLabel()
        .getValue()
    );
  },
  setLabel: function() {},
  isImplicit: function() {
    const isImplicitMethod = MethodBuilder.isImplicit(this.id);
    return this.communicator
      .send(isImplicitMethod)
      .then(resp => resp.getConceptresponse().getBool());
  },
  getSubConcepts: function() {},
  getSuperConcepts: function() {},
  getDirectSuperConcept: function() {},
  setDirectSuperConcept: function() {}
};

module.exports = {
  get: function() {
    return methods;
  }
};