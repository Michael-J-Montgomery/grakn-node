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

function getLabel(conceptId) {
  const TxRequest = new messages.TxRequest();
  const runConceptMethodRequest = new messages.RunConceptMethod();
  const conceptMethod = new conceptMessages.ConceptMethod();
  const unitGetLabel = new conceptMessages.Unit();
  conceptMethod.setGetlabel(unitGetLabel);
  runConceptMethodRequest.setId(conceptId);
  runConceptMethodRequest.setConceptmethod(conceptMethod);
  TxRequest.setRunconceptmethod(runConceptMethodRequest);
  return TxRequest;
}

function isImplicit(conceptId) {
  const TxRequest = new messages.TxRequest();
  const runConceptMethodRequest = new messages.RunConceptMethod();
  const conceptMethod = new conceptMessages.ConceptMethod();
  const unitIsImplicit = new conceptMessages.Unit();
  conceptMethod.setIsimplicit(unitIsImplicit);
  runConceptMethodRequest.setId(conceptId);
  runConceptMethodRequest.setConceptmethod(conceptMethod);
  TxRequest.setRunconceptmethod(runConceptMethodRequest);
  return TxRequest;
}

module.exports = { delete: deleteConcept, getLabel, isImplicit };
