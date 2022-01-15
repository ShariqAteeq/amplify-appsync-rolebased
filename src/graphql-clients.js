import { ApolloLink } from "apollo-link";
import { createAuthLink } from "aws-appsync-auth-link";
import { createHttpLink } from "apollo-link-http";
import { InMemoryCache, ApolloClient } from "@apollo/client";

const url = process.env.REACT_APP_APPSYNC_GRAPHQL_ENDPOINT;
const region = process.env.REACT_APP_REGION.region;
const auth = {
  type: "API_KEY",
  apiKey: process.env.REACT_APP_FINEDEEDS_APPSYNC,
};

const link = ApolloLink.from([
  createAuthLink({ url, region, auth }),
  createHttpLink({ uri: url }),
]);

const FinedeedsAppClient = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

export { FinedeedsAppClient };
