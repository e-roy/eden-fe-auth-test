import type { GetServerSideProps, NextPage } from "next";
import { useEffect, useContext } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

import context from "../_app";

const CallbackPage: NextPage = () => {
  // const { setUser, user } = useContext(context);
  // let loaderData = useLoaderData();
  // const { setUser, user } = useContext(context);

  // const navigate = useNavigate();

  // console.log("loaderData", loaderData);
  const router = useRouter();
  const { code } = router.query;

  useEffect(() => {
    if (code) {
      console.log(code);
      router.push("/profile");
    }
    // if (
    //   //   loaderData &&
    //   //   loaderData.discord_user &&
    //   //   // loaderData.eden_user &&
    //   //   loaderData.token &&

    //   code
    // ) {
    //   console.log({ code });
    //   //   let { discord_user, eden_user, token } = code;
    //   //   setUser({ discord_user, eden_user, token });

    //   return router.push("/profile");
    // }
  }, []);

  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <p>Authenticating....</p>
      </main>
    </div>
  );
};

export default CallbackPage;

// import { IncomingMessage, ServerResponse } from "http";
// import { Context } from "@apollo/client";
// import { getSession } from "next-auth/react";

export const getServerSideProps: GetServerSideProps = async (context) => {
  // export async function getServerSideProps(ctx: any) {
  console.log("context", context.query);
  const { code } = context.query;
  //   const session = await getSession(ctx);
  console.log(process.env.NEXT_PUBLIC_API_URL);

  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      code,
      redirect_uri: process.env.NEXT_PUBLIC_CALLBACK_URL,
    }),
  })
    .then((res) => res.json())
    .then(({ discord_user, eden_user, token }) => {
      console.log({ discord_user, eden_user, token });
      //   localStorage.setItem("eden_token", token);
      //   return { discord_user, eden_user, token };
    });

  //   const url = ctx.req.url?.replace("/", "");

  // if (!data) {
  //   return {
  //     redirect: {
  //       destination: `/login?redirect=${data.loginUrl}`,
  //       permanent: false,
  //     },
  //   };
  // }

  return {
    props: {},
  };
};
