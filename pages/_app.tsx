import "../styles/globals.css";
import type { AppProps } from "next/app";

import { Header } from "@/components";
import { SessionProvider } from "next-auth/react";

import { ApolloProvider } from "@apollo/client";
import { UserProvider } from "@/context";
import { apolloClient } from "@/apollo/apollo-client";

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <ApolloProvider client={apolloClient()}>
        <UserProvider>
          <Header />
          <Component {...pageProps} />
        </UserProvider>
      </ApolloProvider>
    </SessionProvider>
  );
}

export default MyApp;
