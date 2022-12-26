import {
  ApolloClient,
  InMemoryCache,
  from,
  fromPromise,
  toPromise,
  HttpLink,
  ApolloLink,
  split,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { RetryLink } from "@apollo/client/link/retry";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";
import axios from "axios";

import jwt_decode from "jwt-decode";

type decodedType = {
  exp: number;
  iat: number;
  id: string;
  role: string;
};
let decoded: decodedType;

import { NEXT_PUBLIC_GRAPHQL_URL, NEXT_PUBLIC_GRAPHQL_WSS } from "../constants";

const httpLinkEden = new HttpLink({ uri: NEXT_PUBLIC_GRAPHQL_URL });

const edenLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem("eden_access_token");
  // console.log("TOKEN", token);

  if (token) decoded = jwt_decode(token as string);

  if (token && decoded.exp > Math.floor(Date.now() / 1000)) {
    console.log("TOKEN IS GOOD");
    operation.setContext({
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    return forward(operation);
  }

  return fromPromise(
    axios(`/api/auth/fetchToken`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((data: any) => {
        // console.log("DATA", data.data);
        if (data.data.error || !data.data.edenToken)
          return toPromise(forward(operation));
        const edenToken = data.data.edenToken;
        operation.setContext({
          headers: {
            authorization: `Bearer ${edenToken}`,
          },
        });
        if (edenToken) localStorage.setItem("eden_access_token", edenToken);
        return toPromise(forward(operation));
      })

      .catch(() => {
        return toPromise(forward(operation));
      })
  );
});

const httpLinkExtra = new HttpLink({ uri: NEXT_PUBLIC_GRAPHQL_URL, fetch });

const extraLink = new ApolloLink((operation, forward) => {
  // Use the setContext method to set the HTTP headers.
  operation.setContext({
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  });
  // Call the next link in the middleware chain.
  return forward(operation);
});

const directionalLink = new RetryLink().split(
  (operation) => operation.getContext().serviceName === "soilservice",
  edenLink.concat(httpLinkEden),
  extraLink.concat(httpLinkExtra)
);

const errorLink = onError(({ graphQLErrors }) => {
  if (graphQLErrors) graphQLErrors.map(({ message }) => console.log(message));
});

const wsLink =
  typeof window !== "undefined"
    ? new GraphQLWsLink(
        createClient({
          url: `${NEXT_PUBLIC_GRAPHQL_WSS}`,
        })
      )
    : null;

const splitLink =
  typeof window !== "undefined" && wsLink
    ? split(
        ({ query }) => {
          const definition = getMainDefinition(query);
          return (
            definition.kind === "OperationDefinition" &&
            definition.operation === "subscription"
          );
        },
        wsLink,
        directionalLink
      )
    : directionalLink;

export const apolloClient = () => {
  const apolloClient = new ApolloClient({
    ssrMode: typeof window === "undefined",
    // link: authLink.concat(httpLink),
    link: from([errorLink, splitLink]),
    // uri: NEXT_PUBLIC_GRAPHQL_URL,
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {},
        },
      },
    }),
  });
  return apolloClient;
};

// const edenPagination = (keyArgs: any) => {
//   return {
//     keyArgs: [keyArgs],
//     merge(existing: any, incoming: any) {
//       if (!existing) {
//         return incoming;
//       }
//       const existingItems = existing.items;
//       const incomingItems = incoming.items;

//       return {
//         items: existingItems.concat(incomingItems),
//         pageInfo: incoming.pageInfo,
//       };
//     },
//   };
// };
