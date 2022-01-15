import React, { useState, useEffect } from "react";
import "./App.css";
import Signup from "./auth/signup";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./auth/signin";
import Confirmation from "./auth/confirmation";
import { Auth } from "aws-amplify";
import { ApolloLink } from "apollo-link";
import { createAuthLink } from "aws-appsync-auth-link";
import { createHttpLink } from "apollo-link-http";
import { InMemoryCache, ApolloClient, ApolloProvider } from "@apollo/client";
import { FinedeedsAppClient } from "./graphql-clients";
import Home from "./Home";
// import { ApolloProvider } from "react-apollo";
// import { ApolloProvider } from "@apollo/react-hooks";

function App() {
  const [client, setClient] = useState();

  useEffect(() => {
    checkAuth();
  }, []);
  console.log("client", client);

  function checkAuth() {
    Auth.currentSession()
      .then((session) => {
        console.log("session", session);
        const token = session.getIdToken();
        const jwtToken = token.getJwtToken();
        console.log("jwtToken", jwtToken);
        if (typeof jwtToken == "string") {
          const authClientConfig = {
            url: process.env.REACT_APP_APPSYNC_GRAPHQL_ENDPOINT,
            region: process.env.REACT_APP_REGION,
            auth: {
              type: "AMAZON_COGNITO_USER_POOLS",
              jwtToken: jwtToken,
            },
          };
          const link = ApolloLink.from([
            createAuthLink({
              url: authClientConfig.url,
              region: authClientConfig.region,
              auth: authClientConfig.auth,
            }),
            createHttpLink({ uri: authClientConfig.url }),
          ]);

          const FinedeedsAppClient = new ApolloClient({
            link,
            cache: new InMemoryCache(),
          });
          setClient(FinedeedsAppClient);
        } else {
          throw "error";
        }
      })
      .catch((e) => {
        console.log("runnig");
        console.log(e);
        const config = {
          url: process.env.REACT_APP_APPSYNC_GRAPHQL_ENDPOINT,
          region: process.env.REACT_APP_REGION,
          auth: {
            type: "API_KEY",
            apiKey: process.env.REACT_APP_FINEDEEDS_APPSYNC,
          },
        };
        const link = ApolloLink.from([
          createAuthLink({
            url: config.url,
            region: config.region,
            auth: config.auth,
          }),
          createHttpLink({ uri: config.url }),
        ]);

        const FinedeedsAppClient = new ApolloClient({
          link,
          cache: new InMemoryCache(),
        });
        setClient(FinedeedsAppClient);
      });
  }

  if (!client) {
    return <p>Loading..</p>;
  }

  return (
    <ApolloProvider client={client}>
      <div className="App">
        <button onClick={() => Auth.signOut()}>Logout</button>
        <Router>
          <Routes>
            <Route path="" element={<Home />} />
            <Route path="signup" element={<Signup />} />
            <Route path="signin" element={<SignIn />} />
            <Route path="confirmation" element={<Confirmation />} />
          </Routes>
        </Router>
      </div>
    </ApolloProvider>
  );
}

export default App;
