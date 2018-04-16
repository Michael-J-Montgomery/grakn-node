const messages = require("./autogenerated/grakn_pb");
const conceptMessages = require("./autogenerated/concept_pb");

function deleteConcept(conceptId) {
  const TxRequest = new messages.TxRequest();
  const runConceptMethodRequest = new messages.RunConceptMethod();
  const conceptMethod = new conceptMessages.ConceptMethod();
  const unitDelete = new conceptMessages.Unit();
  conceptMethod.setDelete(unitDelete);
  runConceptMethodRequest.setId(conceptId);
  runConceptMethodRequest.setConceptmethod(conceptMethod);
  TxRequest.setRunconceptmethod(runConceptMethodRequest);
  return TxRequest;
}

module.exports = { delete: deleteConcept };
