import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
} from "@apollo/client";

// import {
//   getAuthenticationToken,
//   getRefreshToken,
//   setAuthenticationToken,
// } from "@/lib/auth/state";
import jwt_decode from "jwt-decode";

// import { refreshAuth } from "@/queries/auth/refresh";
import { EDEN_URL } from "./constants";

type decodedType = {
  exp: number;
  iat: number;
  id: string;
  role: string;
};
let decoded: decodedType;

const httpLink = new HttpLink({ uri: EDEN_URL });

const authLink = new ApolloLink((operation, forward) => {
  //   const token = getAuthenticationToken() as string;
  //   const refreshToken = getRefreshToken() as string;
  //   if (token) decoded = jwt_decode(token as string);
  const token = "";
  console.log("token", token);
  // Use the setContext method to set the HTTP headers.
  operation.setContext({
    headers: {
      authorization: token ? `Bearer ${token}` : "",
    },
  });

  //   if (token && decoded.exp < Date.now() / 1000) {
  //     refreshAuth(refreshToken).then((res) => {
  //       operation.setContext({
  //         headers: {
  //           "x-access-token": token
  //             ? `Bearer ${res?.data?.refresh?.accessToken}`
  //             : "",
  //         },
  //       });
  //       setAuthenticationToken({ token: res.data.refresh });
  //     });
  //   }

  // Call the next link in the middleware chain.
  return forward(operation);
});

export const apolloClient = () => {
  const apolloClient = new ApolloClient({
    link: authLink.concat(httpLink),
    uri: EDEN_URL,
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