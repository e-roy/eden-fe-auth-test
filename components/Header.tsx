import { useContext } from "react";
import { UserContext } from "@/context";
import { signIn, signOut } from "next-auth/react";

import styles from "../styles/Home.module.css";

export const Header = () => {
  const { currentUser, clearCurrentUser } = useContext(UserContext);

  const handleLogout = () => {
    signOut();
    localStorage.removeItem("eden_access_token");
  };
  return (
    <div style={{ padding: "2rem" }}>
      {!currentUser && (
        <div>
          <button className={styles.button} onClick={() => signIn("discord")}>
            Login with Discord
          </button>
        </div>
      )}

      {currentUser && (
        <div>
          <button className={styles.button} onClick={() => handleLogout()}>
            log out
          </button>
          <span className={styles.loggedIn}>STATUS: Logged In</span>
        </div>
      )}
    </div>
  );
};
