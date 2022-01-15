import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import Amplify from "aws-amplify";
import awsCognitoConfig from "./awsCognitoConfig";

Amplify.configure(awsCognitoConfig);

ReactDOM.render(<App />, document.getElementById("root"));
