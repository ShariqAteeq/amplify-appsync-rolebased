const AWS = require("aws-sdk");
// const { getItem } = require("./../lib/dynamodb");
// let Credentials = require(`./../config/config.${process.env.TABLE_PREFIX}.json`);
// AWS.config.update({ region: Credentials.REGION });
// const serviceProvider = new AWS.CognitoIdentityServiceProvider();

// const adminConfirmSignUp = (Username) => {
//   // console.log('=> lib/auth.js: Username, ', Username)
//   return new Promise((res, rej) => {
//     serviceProvider.adminConfirmSignUp(
//       {
//         UserPoolId: Credentials.ORG_POOL_ID,
//         Username,
//       },
//       (error, data) => {
//         console.log("=> adminConfirmSignUp callback");
//         if (error) {
//           console.log("=> error", JSON.stringify(error));
//           rej(error);
//         } else {
//           console.log(
//             "=> Admin Confirm SignUp successful!",
//             JSON.stringify(data)
//           );
//           res(data);
//         }
//       }
//     );
//   });
// };

// const adminGetUser = (Username) => {
//   console.log("Username", Username);
//   return serviceProvider
//     .adminGetUser({
//       UserPoolId: Credentials.ORG_POOL_ID,
//       Username,
//     })
//     .promise();
// };

// const isUserExistInCognito = (Username, pool) => {
//   return new Promise((res, rej) => {
//     serviceProvider.adminGetUser(
//       {
//         UserPoolId: Credentials[pool ? pool : "USER_POOL_ID"],
//         Username,
//       },
//       (error, data) => {
//         console.log("error", JSON.stringify(error));
//         console.log("data", JSON.stringify(data));
//         error ? res(false) : res(true);
//       }
//     );
//   });
// };

// const adminUpdateUserAttributes = (Username, attributes) => {
//   // console.log('=> /lib/auth.js : adminUpdateUserAttributes : Username', Username)
//   return new Promise((res, rej) => {
//     serviceProvider.adminUpdateUserAttributes(
//       {
//         UserPoolId: Credentials.ORG_POOL_ID,
//         UserAttributes: attributes,
//         Username,
//       },
//       (error, data) => {
//         if (error) {
//           console.log("error", error);
//           rej(error);
//         } else {
//           console.log(Username, "Admin Update User Attributes successful!");
//           res(Username);
//         }
//       }
//     );
//   });
// };

// const disableCognitoUser = (userId) => {
//   return new Promise((res, rej) => {
//     serviceProvider.adminDisableUser(
//       {
//         UserPoolId: Credentials.USER_POOL_ID,
//         Username: userId,
//       },
//       (error, data) => {
//         if (error) {
//           console.log("error", error);
//           rej(error);
//         } else {
//           console.log(userId, "disable successful!");
//           res(userId);
//         }
//       }
//     );
//   });
// };

// const enableCognitoUser = (userId) => {
//   return new Promise((res, rej) => {
//     getItem("User", { userId })
//       .then((data) => {
//         const { email, userRole, type, userStatus } = data["Item"];
//         if (userStatus === "FORCE_CHANGE_PASSWORD") {
//           createCognitoUser(email, userRole, type, "RESEND")
//             .then(() => {
//               serviceProvider.adminEnableUser(
//                 {
//                   UserPoolId: Credentials.USER_POOL_ID,
//                   Username: userId,
//                 },
//                 (error, data) => {
//                   if (error) {
//                     console.log("error", error);
//                     rej(error);
//                   } else {
//                     console.log(userId, "enable successful!");
//                     res(userId);
//                   }
//                 }
//               );
//             })
//             .catch((error) => {
//               rej(error);
//             });
//         } else {
//           serviceProvider.adminEnableUser(
//             {
//               UserPoolId: Credentials.USER_POOL_ID,
//               Username: userId,
//             },
//             (error, data) => {
//               if (error) {
//                 console.log("error", error);
//                 rej(error);
//               } else {
//                 console.log(userId, "enable successful!");
//                 res(userId);
//               }
//             }
//           );
//         }
//       })
//       .catch((error) => {
//         rej(error);
//       });
//   });
// };

// const enableCognitoUserWithoutDB = (userId, pool) => {
//   return new Promise((res, rej) => {
//     serviceProvider.adminEnableUser(
//       {
//         UserPoolId: Credentials[pool ? pool : "USER_POOL_ID"],
//         Username: userId,
//       },
//       (error, data) => {
//         if (error) {
//           console.log("error", error);
//           rej(error);
//         } else {
//           console.log(userId, "enable successful!");
//           res(userId);
//         }
//       }
//     );
//   });
// };

// const createCognitoUser = (
//   Username,
//   UserAttributes,
//   pool,
//   messageAction,
//   tempPassword
// ) => {
//   AWS.config.update({ region: Credentials.REGION });

//   let authenticationData = {
//     UserPoolId: Credentials[pool ? pool : "USER_POOL_ID"],
//     Username,
//     DesiredDeliveryMediums: ["EMAIL"],
//     UserAttributes,
//   };
//   if (messageAction) authenticationData["MessageAction"] = messageAction;
//   if (tempPassword) authenticationData["TemporaryPassword"] = tempPassword;

//   console.log("authenticationData", JSON.stringify(authenticationData));
//   let serviceProvider = new AWS.CognitoIdentityServiceProvider();
//   return serviceProvider.adminCreateUser(authenticationData).promise();
// };

// const deleteCognitoUser = (Username, pool) => {
//   AWS.config.update({ region: Credentials.REGION });

//   let authenticationData = {
//     UserPoolId: Credentials[pool ? pool : "USER_POOL_ID"],
//     Username,
//   };

//   console.log("authenticationData", JSON.stringify(authenticationData));
//   let serviceProvider = new AWS.CognitoIdentityServiceProvider();
//   return serviceProvider.adminDeleteUser(authenticationData).promise();
// };

const addUserToGroup = (Username, group) => {
  AWS.config.update({ region: "eu-west-1" });

  const params = {
    GroupName: group,
    UserPoolId: "eu-west-1_GYMQFjRQ7",
    Username: Username,
  };

  let serviceProvider = new AWS.CognitoIdentityServiceProvider();
  return serviceProvider.adminAddUserToGroup(params).promise();
};

// const setTempPasswordForCognitoUser = (Username, Password, Permanent) => {
//   AWS.config.update({ region: Credentials.REGION });

//   let authenticationData = {
//     Password,
//     Permanent,
//     UserPoolId: Credentials.USER_POOL_ID,
//     Username,
//   };

//   let serviceProvider = new AWS.CognitoIdentityServiceProvider();
//   return new Promise((res, rej) => {
//     serviceProvider.adminSetUserPassword(authenticationData, (err, data) => {
//       if (err) {
//         console.log("err", err);
//         rej(err);
//       } else {
//         res(data);
//       }
//     });
//   });
// };

module.exports = {
  addUserToGroup,
  // disableCognitoUser,
  // enableCognitoUser,
  // createCognitoUser,
  // deleteCognitoUser,
  // setTempPasswordForCognitoUser,
  // adminConfirmSignUp,
  // adminUpdateUserAttributes,
  // adminGetUser,
  // isUserExistInCognito,
  // enableCognitoUserWithoutDB,
};
