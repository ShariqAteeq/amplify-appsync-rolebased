const fetch = require("node-fetch");
const AWS = require("aws-sdk");
const Credentials = require(`./../config/config.${process.env.TABLE_PREFIX}.json`);

AWS.config.update({ region: "eu-west-1" });
const appsync = new AWS.AppSync({ apiVersion: "2017-07-25" });

const getTimestamp = () => {
  return new Date().getTime();
};

let getUnique = (arr, comp) => {
  const unique = arr
    .map((e) => e[comp])

    // store the keys of the unique objects
    .map((e, i, final) => final.indexOf(e) === i && i)

    // eliminate the dead keys & store unique objects
    .filter((e) => arr[e])
    .map((e) => arr[e]);

  return unique;
};

let removeSameItems = (arr1, arr2, id) => {
  if (arr1 && arr2 && id) {
    return arr1.filter((a) => {
      let flag = false;
      arr2.map((d) => {
        if (d[id] === a[id]) flag = true;
        return null;
      });
      if (!flag) return a;
      return null;
    });
  } else {
    return [];
  }
};

let getSameItems = (arr1, arr2, id) => {
  if (arr1 && arr2 && id) {
    return arr1.filter((a) => {
      let flag = false;
      arr2.map((d) => {
        if (d[id] === a[id]) flag = true;
        return null;
      });
      if (flag) return a;
      return null;
    });
  } else {
    return [];
  }
};

let generateId = (length = 8, separator = "-") => {
  this.length = length;
  this.timestamp = +new Date();

  var _getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  var ts = this.timestamp.toString();
  var parts = ts.split("").reverse();
  var id = "";

  for (var i = 0; i < this.length; ++i) {
    var index = _getRandomInt(0, parts.length - 1);
    if (i % 4 === 0 && i && separator) id += separator;
    id += parts[index];
  }

  return id;
};

const generateFieldValueFormatLowerCase = (value) => {
  return value.toLowerCase().replace(/\s/g, "_");
};

const generateFieldValueFormatUpperCase = (value) => {
  return value.toUpperCase().replace(/\s/g, "_");
};

const convertMetersToFeet = (meters) => {
  if (meters < 0) {
    return "input cannot be less than zero";
  } else {
    return meters * 1.09361;
  }
};

const isBooleanCheck = (attr) => {
  if (attr !== null && attr !== undefined && attr !== "") {
    return true;
  } else {
    return false;
  }
};

const isAmountCheck = (amount) => {
  if (amount !== null && amount !== undefined && amount !== "" && amount >= 0) {
    return true;
  } else {
    return false;
  }
};

const getFileExtension = (type) => {
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
  switch (type) {
    case "application/msword":
      return ".doc";

    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      return ".docx";

    case "application/vnd.ms-powerpoint":
      return ".ppt";

    case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      return ".pptx";

    case "application/vnd.ms-excel":
      return ".xls";

    case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
      return ".xlsx";

    case "image/gif":
      return ".gif";

    case "image/jpeg":
      return ".jpeg";

    case "image/jpg":
      return ".jpg";

    case "image/png":
      return ".png";

    case "image/svg+xml":
      return ".svg";

    case "application/pdf":
      return ".pdf";

    case "application/json":
      return ".json";

    case "audio/mpeg":
      return ".mp3";

    case "video/mpeg":
      return ".mpeg";

    case "video/mp4":
    case "application/mp4":
      return ".mp4";

    case "application/x-troff-msvideo":
    case "video/avi":
    case "video/msvideo":
    case "video/x-msvideo":
      return ".avi";

    case "audio/ogg":
    case "video/ogg":
      return ".ogg";

    case "application/vnd.rar":
      return ".rar";

    case "application/rtf":
      return ".rtf";

    case "text/plain":
      return ".txt";

    case "application/zip":
      return ".zip";
    default:
      return "";
  }
};

const getCurrentDate = () => {
  let date = new Date();
  return `${date.getFullYear()}-${isNeededZero(
    date.getMonth() + 1
  )}-${isNeededZero(date.getDate())}`;

  function isNeededZero(n) {
    if (n < 10) {
      return `0${n}`;
    }
    return n;
  }
};

const withPagination = (data, pk) => {
  return {
    items: data,
    count: data.length,
    scannedCount: data.length,
    exclusiveStartKey: null,
    // exclusiveStartKey: data['LastEvaluatedKey'] ? data['LastEvaluatedKey'][pk] : null
  };
};

const withPaginationNew = (data, totalCount, skip, limit) => {
  return {
    items: data,
    count: data.length,
    skip,
    limit,
    totalCount,
  };
};

const getPerPageLimit = () => {
  return 24;
};

const getPrimaryEmail = () => "Finedeeds <info@finedeeds.com>";
const getDevEmail = () => "Finedeeds <mohsinghani.777@gmail.com>";

const getSESRedirectUrl = () => {
  if (process.env.TABLE_PREFIX === "prod") {
    return "https://www.finedeeds.com";
  } else if (process.env.TABLE_PREFIX === "stage") {
    return "https://stage.d1pctbmfokd5yz.amplifyapp.com";
  } else {
    return "https://dev.d1pctbmfokd5yz.amplifyapp.com";
  }
};

const getTableName = (name) => {
  return `${name}-${process.env.TABLE_PREFIX}`;
};

const checkForTimeOutErr = (err) => {
  if (err.includes("timed out")) {
    return "Something went wrong! Please try again!";
  }
};

const parseError = (err) => {
  console.log("parser err", JSON.stringify(err));

  if (err) {
    if (
      typeof err === "object" &&
      err["name"] &&
      err["name"] === "MongoNetworkTimeoutError"
    ) {
      return "Something went wrong! Please try again!";
    } else if (typeof err === "string") {
      checkForTimeOutErr(err);
      switch (err) {
        default:
          return err;
      }
    } else if (typeof err === "object" && err["message"]) {
      checkForTimeOutErr(err["message"]);
      return err["message"];
    } else {
      return err;
    }
  } else {
    return null;
  }
};

const genEmailTemplate = (path, inviteId, teamName, msg) => {
  return `
    <table style="background-color: lightgrey;">
        <tr style="background-color: black; height: 60px;">
            <th style="color: white;">Join Team</th>
        </tr>
        <tr style="height: 120px;">
            <td>
                You recieved an invitation to join ${teamName} team on finedeeds.
                <br />
                <p>${msg}</p>
                <br />
                <a href="${getSESRedirectUrl()}/${path}/${inviteId}" target="_blank">Accept Invite</a>
            </td>
        </tr>
    </table>
  `;
};

// const genAcceptDeclineParticipateReqTemplate = (
//   objTitle,
//   status,
//   declineMsg
//   // orgName
// ) => {
//   return `
//     <table style="background-color: lightgrey;">
//         <tr style="background-color: black; height: 60px;">
//             <th style="color: white;">Request Status</th>
//         </tr>
//         <tr style="height: 120px;">
//             <td>
//               ${
//                 status === "ACCEPTED"
//                   ? `
//                     <p>
//                       Your application for ${objTitle} has been accepted. You will be contacted soon by the organization.
//                     </p>
//                   `
//                   : status === "DECLINED"
//                   ? `
//                     <p>
//                       Your application for ${objTitle} has been declined.
//                       Thank you for applying for this project, kindly consider other projects here: <a href="https://dev.d1pctbmfokd5yz.amplifyapp.com/projects" title="see projects list">list of projects link</a>.
//                       <br /><br />
//                       <h4>Reason:</h4>
//                       <p>${declineMsg}</p>
//                     </p>
//                   `
//                   : ""
//               }
//             </td>
//         </tr>
//     </table>
//   `;
// };

// const genAcceptDeclineVolunteerReqTemplate = (status, declineMsg, orgName) => {
//   return `
//     <table style="background-color: lightgrey;">
//         <tr style="background-color: black; height: 60px;">
//             <th style="color: white;">Request Status</th>
//         </tr>
//         <tr style="height: 120px;">
//             <td>
//               ${
//                 status === "ACCEPTED"
//                   ? `
//                     <p>
//                       The organization ${orgName} has accepted your request. You are now a volunteer.
//                     </p>
//                   `
//                   : status === "DECLINED"
//                   ? `
//                     <p>
//                       The organization ${orgName} has declined your request.
//                       <br /><br />
//                       <h4>Reason:</h4>
//                       <p>${declineMsg}</p>
//                     </p>
//                   `
//                   : ""
//               }
//             </td>
//         </tr>
//     </table>
//   `;
// };

const genAcceptDeclineParticipateReqTemplate = (
  status,
  declineMsg,
  objTitle,
  volunteerName
) => {
  return `
  <body style="font-family: Helvetica" ;>
  <div style="text-align: center; padding: 30px 0">
    <img
      width="200px"
      height="87px"
      src="https://finedeeds-public.s3-eu-west-1.amazonaws.com/findeeds_logo.png"
    />
  </div>
  <div style="max-width: 1160px; margin: 0 auto">
    <h1 style="margin: 24px 0; padding-left: 10px; margin-bottom: 15px">
      Hi ${volunteerName}
    </h1>
    ${
      status === "ACCEPTED"
        ? `
          <p style="
          margin: 30px 0;
          font-weight: 400;
          font-size: 18px;
          padding-left: 10px;
        ">
        Your application for ${objTitle} has been accepted. You will be contacted soon by the organization.
          </p>
        `
        : status === "DECLINED"
        ? `
        <p
        style="
          margin: 30px 0;
          font-weight: 400;
          font-size: 18px;
          padding-left: 10px;
        "
      >
      Your application for ${objTitle} has been declined. 
      </p>
      <p
        style="
          margin: 30px 0;
          font-weight: 400;
          font-size: 18px;
          padding-left: 10px;
        "
      >
        <strong>Reason: </strong>  ${declineMsg}
      </p>
        `
        : ""
    }
    <p
      style="
        margin: 30px 0;
        font-weight: 400;
        font-size: 18px;
        padding-left: 10px;
      "
    >
      Best,<br />
      The Finedeeds Team
    </p>
  </div>
  <div style="background-color: #e5e5e5; padding-bottom: 30px">
    <div style="max-width: 1160px; margin: 0 auto; text-align: center">
      <nav>
        <ul style="list-style: none">
          <li>
            <a
              style="
                text-decoration: none;
                color: #f06e06;
                font-weight: 600;
                font-size: 20px;
                padding: 12px 0;
                display: inline-block;
              "
              href="https://finedeeds.com/about"
              >About</a
            >
          </li>
          <li>
            <a
              style="
                text-decoration: none;
                color: #f06e06;
                font-weight: 600;
                font-size: 20px;
                padding: 12px 0;
                display: inline-block;
              "
              href="https://finedeeds.com/events-list"
              >Events</a
            >
          </li>
          <li>
            <a
              style="
                text-decoration: none;
                color: #f06e06;
                font-weight: 600;
                font-size: 20px;
                padding: 12px 0;
                display: inline-block;
              "
              href="https://finedeeds.com/projects"
              >Projects</a
            >
          </li>
        </ul>
      </nav>
      <p
        style="
          margin: 30px 0;
          font-weight: 400;
          font-size: 18px;
          text-align: center;
          color: gray;
        "
      >
        HQ: Dublin, Ireland <br />
        info@finedeeds.com
      </p>
      <p
        style="
          margin: 30px 0;
          font-weight: 400;
          font-size: 18px;
          text-align: center;
          color: gray;
        "
      >
        To unsubscribe email to <br />
        unsub@finedeeds.com
      </p>
    </div>
  </div>
</body>
  `;
};
const genAcceptDeclineVolunteerReqTemplate = (
  status,
  declineMsg,
  orgName,
  volunteerName
) => {
  return `
  <body style="font-family: Helvetica" ;>
  <div style="text-align: center; padding: 30px 0">
    <img
      width="200px"
      height="87px"
      src="https://finedeeds-public.s3-eu-west-1.amazonaws.com/findeeds_logo.png"
    />
  </div>
  <div style="max-width: 1160px; margin: 0 auto">
    <h1 style="margin: 24px 0; padding-left: 10px; margin-bottom: 15px">
      Hi ${volunteerName}
    </h1>
    ${
      status === "ACCEPTED"
        ? `
          <p style="
          margin: 30px 0;
          font-weight: 400;
          font-size: 18px;
          padding-left: 10px;
        ">
        Congratulations you're now a member of the organization ${orgName}. Let's create a ripple effect of goodness around.
          </p>
        `
        : status === "DECLINED"
        ? `
        <p
        style="
          margin: 30px 0;
          font-weight: 400;
          font-size: 18px;
          padding-left: 10px;
        "
      >
        The organization ${orgName} has declined your request.
      </p>
      <p
        style="
          margin: 30px 0;
          font-weight: 400;
          font-size: 18px;
          padding-left: 10px;
        "
      >
        <strong>Reason: </strong>  ${declineMsg}
      </p>
        `
        : ""
    }
    <p
      style="
        margin: 30px 0;
        font-weight: 400;
        font-size: 18px;
        padding-left: 10px;
      "
    >
      Best,<br />
      The Finedeeds Team
    </p>
  </div>
  <div style="background-color: #e5e5e5; padding-bottom: 30px">
    <div style="max-width: 1160px; margin: 0 auto; text-align: center">
      <nav>
        <ul style="list-style: none">
          <li>
            <a
              style="
                text-decoration: none;
                color: #f06e06;
                font-weight: 600;
                font-size: 20px;
                padding: 12px 0;
                display: inline-block;
              "
              href="https://finedeeds.com/about"
              >About</a
            >
          </li>
          <li>
            <a
              style="
                text-decoration: none;
                color: #f06e06;
                font-weight: 600;
                font-size: 20px;
                padding: 12px 0;
                display: inline-block;
              "
              href="https://finedeeds.com/events-list"
              >Events</a
            >
          </li>
          <li>
            <a
              style="
                text-decoration: none;
                color: #f06e06;
                font-weight: 600;
                font-size: 20px;
                padding: 12px 0;
                display: inline-block;
              "
              href="https://finedeeds.com/projects"
              >Projects</a
            >
          </li>
        </ul>
      </nav>
      <p
        style="
          margin: 30px 0;
          font-weight: 400;
          font-size: 18px;
          text-align: center;
          color: gray;
        "
      >
        HQ: Dublin, Ireland <br />
        info@finedeeds.com
      </p>
      <p
        style="
          margin: 30px 0;
          font-weight: 400;
          font-size: 18px;
          text-align: center;
          color: gray;
        "
      >
        To unsubscribe email to <br />
        unsub@finedeeds.com
      </p>
    </div>
  </div>
</body>
  `;
};

const getRegisterEmailTemplate = (username, name) => {
  return `
  <body style="font-family: Helvetica" ;>
  <div style="text-align: center; padding: 30px 0">
    <img
      width="200px"
      height="87px"
      src="https://finedeeds-public.s3-eu-west-1.amazonaws.com/findeeds_logo.png"
    />
  </div>
  <div style="max-width: 1160px; margin: 0 auto">
    <h1 style="margin: 24px 0; padding-left: 10px; margin-bottom: 15px">
      Welcome ${name}
    </h1>
    <p
      style="
        margin: 30px 0;
        font-weight: 400;
        font-size: 18px;
        padding-left: 10px;
      "
    >
      Your account has been successfully created, please sign in using your
      id: ${username}.
    </p>
    <p
      style="
        margin: 30px 0;
        font-weight: 400;
        font-size: 18px;
        padding-left: 10px;
      "
    >
      Best,<br />
      The Finedeeds Team
    </p>
  </div>
  <div style="background-color: #e5e5e5; padding-bottom: 30px">
    <div style="max-width: 1160px; margin: 0 auto; text-align: center">
      <nav>
        <ul style="list-style: none">
          <li>
            <a
              style="
                text-decoration: none;
                color: #f06e06;
                font-weight: 600;
                font-size: 20px;
                padding: 12px 0;
                display: inline-block;
              "
              href="https://finedeeds.com/about"
              >About</a
            >
          </li>
          <li>
            <a
              style="
                text-decoration: none;
                color: #f06e06;
                font-weight: 600;
                font-size: 20px;
                padding: 12px 0;
                display: inline-block;
              "
              href="https://finedeeds.com/events-list"
              >Events</a
            >
          </li>
          <li>
            <a
              style="
                text-decoration: none;
                color: #f06e06;
                font-weight: 600;
                font-size: 20px;
                padding: 12px 0;
                display: inline-block;
              "
              href="https://finedeeds.com/projects"
              >Projects</a
            >
          </li>
        </ul>
      </nav>
      <p
        style="
          margin: 30px 0;
          font-weight: 400;
          font-size: 18px;
          text-align: center;
          color: gray;
        "
      >
        HQ: Dublin, Ireland <br />
        info@finedeeds.com
      </p>
      <p
        style="
          margin: 30px 0;
          font-weight: 400;
          font-size: 18px;
          text-align: center;
          color: gray;
        "
      >
        To unsubscribe email to <br />
        unsub@finedeeds.com
      </p>
    </div>
  </div>
</body>
  `;
};

const defaultDataQueryLimit = null;

const callSendNotificationMutation = (variables) => {
  // const dummyVariables = {
  //   message: "Test Notification",
  //   link: "https://www.google.com/",
  //   receiverId: "123",
  //   senderId: "456",
  //   notificationType: "PROJECT",
  // }

  const sendNotification = `
    mutation sendNotification($input: NotificationInput!) {
      sendNotification(input: $input) {
        message
        receiverId
        notificationType
        link
      }
    }
  `;

  return new Promise((resolve, reject) => {
    fetch(Credentials.APPSYNC_GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": Credentials.APPSYNC_API_KEY,
        Accept: "application/json",
      },
      body: JSON.stringify({
        query: sendNotification,
        variables: {
          input: {
            ...variables,
          },
        },
      }),
    })
      .then((res) => res.json())
      .then((json) => resolve(json))
      .catch((err) => reject(err));
  });
};

async function withFlushCache(event, context, callback, cb) {
  console.log("flushCache called");

  // if (process.env.TABLE_PREFIX === "stage") {
  //   return cb(event, context, callback);
  // } else {
  try {
    const cache = await appsync
      .getApiCache({
        apiId: Credentials.APPSYNC_API_ID,
      })
      .promise();
    console.log("cache outside", JSON.stringify(cache));
    if (cache && cache.apiCache && cache.apiCache.status === "AVAILABLE") {
      console.log("cache inside", JSON.stringify(cache));
      const data = await appsync
        .flushApiCache({ apiId: Credentials.APPSYNC_API_ID })
        .promise();
      console.log("FLUSHED DATA: ", JSON.stringify({ data }, null, 2));
      return cb(event, context, callback);
    } else {
      return cb(event, context, callback);
    }
  } catch (error) {
    return cb(event, context, callback);
  }
  // }
}



// async function withFlushCacheCheck(event, context, callback, cb) {
//   console.log("flushCache called");

//   try {
//     const cache = await appsync.getApiCache({
//       apiId: Credentials.APPSYNC_API_ID,
//     });

//     if (cache.apiCache.status === "AVAILABLE") {
//       const data = await appsync
//         .flushApiCache({ apiId: Credentials.APPSYNC_API_ID })
//         .promise();
//       console.log("FLUSHED DATA: ", JSON.stringify({ data }, null, 2));
//       return cb(event, context, callback);
//     } else {
//       return cb(event, context, callback);
//     }
//   } catch (error) {
//     return context.fail(parseError(error));
//   }
// }

module.exports = {
  // withFlushCacheCheck,
  getTimestamp,
  getUnique,
  removeSameItems,
  getSameItems,
  generateId,
  generateFieldValueFormatLowerCase,
  generateFieldValueFormatUpperCase,
  convertMetersToFeet,
  isBooleanCheck,
  isAmountCheck,
  getFileExtension,
  getCurrentDate,
  withPagination,
  withPaginationNew,
  getPerPageLimit,
  getPrimaryEmail,
  getDevEmail,
  getSESRedirectUrl,
  getTableName,
  parseError,
  defaultDataQueryLimit,
  genEmailTemplate,
  genAcceptDeclineParticipateReqTemplate,
  genAcceptDeclineVolunteerReqTemplate,
  getRegisterEmailTemplate,
  callSendNotificationMutation,
  withFlushCache,
};
