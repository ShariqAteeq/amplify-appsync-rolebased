"use strict";

const { postConfirmation } = require("./controller/index");

module.exports.postConfirmation = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  return postConfirmation(event, context, callback);
};
