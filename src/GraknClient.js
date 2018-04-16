const grpc = require("grpc");
const messages = require("./autogenerated/grakn_pb");
const conceptMessages = require("./autogenerated/concept_pb");
const services = require("./autogenerated/grakn_grpc_pb");
const ConceptFactory = require("./ConceptFactory");
const GrpcCommunicator = require("./util/GrpcCommunicator");

function GraknClient(uri, keyspace, credentials) {
  this.client = new services.GraknClient(
    uri,
    grpc.credentials.createInsecure()
  );
  this.keyspace = keyspace;
  this.credentials = credentials;
  this.communicator = null;
  this.result = [];
}

GraknClient.prototype._executeQuery = async function executeQuery(query) {
  const txRequest = new messages.TxRequest();
  const executeQuery = new messages.ExecQuery();
  const queryRequest = new messages.Query();
  queryRequest.setValue(query);
  executeQuery.setQuery(queryRequest);
  txRequest.setExecquery(executeQuery);
  const result = await this.communicator.send(txRequest);
  return await this._executeQueryCb(result);
};

GraknClient.prototype._openTx = async function() {
  const openRequest = new messages.Open();
  const txRequest = new messages.TxRequest();
  const messageKeyspace = new messages.Keyspace();
  messageKeyspace.setValue(this.keyspace);

  openRequest.setKeyspace(messageKeyspace);
  openRequest.setTxtype(messages.TxType.WRITE);
  openRequest.setUsername(this.credentials.username);
  openRequest.setPassword(this.credentials.password);
  txRequest.setOpen(openRequest);

  await this.communicator.send(txRequest);
};

GraknClient.prototype._executeQueryCb = async function executeQueryCb(resp) {
  if (resp.hasDone()) {
    const currentResult = this.result;
    this.result = [];
    return currentResult;
  } else if (resp.hasIteratorid()) {
    this.nextRequest = _createNextRequest(resp.getIteratorid());
    const nextResult = await this._getNextResult();
    return await this._executeQueryCb(nextResult);
  } else if (resp.hasQueryresult()) {
    this._parseResult(resp.getQueryresult());
    const nextResult = await this._getNextResult();
    return await this._executeQueryCb(nextResult);
  }
};

function _createNextRequest(iteratorId) {
  const nr = new messages.Next();
  nr.setIteratorid(iteratorId);
  const tr = new messages.TxRequest();
  tr.setNext(nr);
  return tr;
}

GraknClient.prototype._getNextResult = async function(cb) {
  return await this.communicator.send(this.nextRequest);
};

GraknClient.prototype._parseResult = function(queryResult) {
  if (queryResult.hasOtherresult()) {
    // compute or aggregate query
    this.result = JSON.parse(queryResult.getOtherresult());
  } else {
    const answerMap = new Map();
    queryResult
      .getAnswer()
      .getAnswerMap()
      .forEach((grpcConcenpt, key) => {
        answerMap.set(
          key,
          ConceptFactory.createConcept(grpcConcenpt, this.communicator)
        );
      });
    this.result.push(answerMap);
  }
};

GraknClient.prototype._init = async function() {
  this.communicator = new GrpcCommunicator(this.client.tx());
  await this._openTx();
};

GraknClient.prototype.execute = async function execute(query) {
  if (!this.communicator) {
    await this._init();
  }
  return await this._executeQuery(query);
};

module.exports = GraknClient;
