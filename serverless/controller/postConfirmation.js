// const { getTimestamp } = require("../lib/helpers");
const { addUserToGroup } = require("../lib/auth");
// const { Organization } = require("../models");
// const connectToDatabase = require("./../lib/db");
// const { createItemInDynamoDB } = require("./../lib/dynamodb");
// const { searchItemsFromES } = require("./../lib/elasticSearch");

async function postConfirmation(event, context, callback) {
  console.log("events", JSON.stringify(event));

  if (event["triggerSource"] !== "PostConfirmation_ConfirmSignUp")
    return callback(null, event);

  let userAttributes = event.request.userAttributes;
  let userId = userAttributes["sub"];
  let role = userAttributes["custom:role"];
  let { email } = event.request.userAttributes;

  let group = role === "Volunteer" ? "Volunteers" : "Corporate";

  console.log("userId", JSON.stringify(userId));
  console.log("group", JSON.stringify(group));
  console.log("role", JSON.stringify(role));
  console.log("emails", JSON.stringify(email));

  try {
    await addUserToGroup(email, "Volunteers");
    return callback(null, event);
  } catch (error) {
    return callback(error.message, event);
  }
}

exports.postConfirmation = postConfirmation;
