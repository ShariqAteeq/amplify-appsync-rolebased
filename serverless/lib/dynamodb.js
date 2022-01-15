const AWS = require("aws-sdk");
let Credentials = require(`./../config/config.${process.env.TABLE_PREFIX}.json`);
const docClient = new AWS.DynamoDB.DocumentClient({
  region: Credentials.REGION,
});
const { getTableName } = require("./helpers");

let createItemInDynamoDB = (
  itemAttributes,
  table,
  expressionAttributes,
  conditionExpression
) => {
  let tableParams = {
    Item: itemAttributes,
    TableName: getTableName(table),
    ExpressionAttributeNames: expressionAttributes,
    ConditionExpression: conditionExpression,
  };

  return docClient.put(tableParams).promise();
};

let createItemOrUpdate = (itemAttributes, table) => {
  let tableParams = {
    Item: itemAttributes,
    TableName: getTableName(table),
  };

  return docClient.put(tableParams).promise();
};

let getItemByQuery = (
  table,
  KeyConditionExpression,
  ExpressionAttributeNames,
  ExpressionAttributeValues
) => {
  var params = {
    TableName: getTableName(table),
    KeyConditionExpression,
    ExpressionAttributeNames,
    ExpressionAttributeValues,
  };

  return docClient.query(params).promise();
};

let getItemByIndex = (
  table,
  IndexName,
  KeyConditionExpression,
  ExpressionAttributeNames,
  ExpressionAttributeValues
) => {
  var params = {
    TableName: getTableName(table),
    IndexName,
    KeyConditionExpression,
    ExpressionAttributeNames,
    ExpressionAttributeValues,
  };

  return docClient.query(params).promise();
};

let getItem = (table, Key) => {
  var params = {
    TableName: getTableName(table),
    Key,
  };
  return docClient.get(params).promise();
};

let writeBatchItems = (table, items) => {
  let params = {
    RequestItems: {
      [getTableName(table)]: items,
    },
  };

  return docClient.batchWrite(params).promise();
};

let writeBatchItemsInMultipleTables = (params) => {
  return docClient.batchWrite(params).promise();
};

let getBatchItems = (table, Keys) => {
  let params = {
    RequestItems: {
      [getTableName(table)]: { Keys },
    },
  };

  return docClient.batchGet(params).promise();
};

let scan = (params) => {
  params["TableName"] = getTableName(params["TableName"]);
  return docClient.scan(params).promise();
};

let describeTable = (params) => {
  params["TableName"] = getTableName(params["TableName"]);
  return docClient.describeTable(params).promise();
};

let deleteItem = (table, Key) => {
  var params = {
    TableName: getTableName(table),
    Key,
    ReturnValues: "ALL_OLD",
  };

  return docClient.delete(params).promise();
};

let updateItemInDynamoDB = ({
  table,
  Key,
  UpdateExpression,
  ExpressionAttributeValues,
  ReturnValues,
  ExpressionAttributeNames,
  ConditionExpression,
}) => {
  let params = {
    TableName: getTableName(table),
    Key,
    UpdateExpression,
    ExpressionAttributeValues,
    ReturnValues: ReturnValues ? ReturnValues : "ALL_NEW",
  };
  if (ExpressionAttributeNames) {
    params["ExpressionAttributeNames"] = ExpressionAttributeNames;
  }

  if (ConditionExpression) {
    params["ConditionExpression"] = ConditionExpression;
  }

  return docClient.update(params).promise();
};

module.exports = {
  createItemInDynamoDB,
  createItemOrUpdate,
  getItemByQuery,
  getItem,
  writeBatchItems,
  getItemByIndex,
  getBatchItems,
  scan,
  deleteItem,
  updateItemInDynamoDB,
  writeBatchItemsInMultipleTables,
  describeTable,
};
