import type { NextPage } from "next";
import { useContext } from "react";
import { UserContext } from "@/context";
import styles from "../../styles/Home.module.css";

const AuthPage: NextPage = () => {
  const { currentUser } = useContext(UserContext);

  return (
    <div>
      <main>
        <div className={styles.card}>
          <img
            className={styles.avatar}
            src={currentUser?.discordAvatar || ""}
            alt="avatar"
          />
          <div>{currentUser?.discordName}</div>
          <div>#{currentUser?.discriminator}</div>
          <div>Bio : {currentUser?.bio}</div>
        </div>
      </main>
    </div>
  );
};

export default AuthPage;

import { IncomingMessage, ServerResponse } from "http";
import { getSession } from "next-auth/react";

export async function getServerSideProps(ctx: {
  query: any;
  req: IncomingMessage;
  res: ServerResponse;
}) {
  const session = await getSession(ctx);
  // console.log("auth-only session", session);

  const url = ctx.req.url?.replace("/", "");

  if (!session) {
    return {
      redirect: {
        destination: `/login?redirect=${url}`,
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}
