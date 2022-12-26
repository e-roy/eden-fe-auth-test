import { useQuery, useSubscription } from "@apollo/client";
import { FIND_CURRENTUSER, FIND_CURRENTUSER_SUB } from "../../graphql";
import React, { useEffect, useState } from "react";

import { UserContext } from "./UserContext";
import { Maybe, Members } from "@/apollo/generated/graphqlEden";
import { useSession } from "next-auth/react";

export interface UserProviderProps {
  children: React.ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const { data: session } = useSession();
  const { id } = session?.user || { id: null };

  const [memberServers, setMemberServers] = useState<any>(null);
  const [selectedServer, setSelectedServer] = useState<any>();
  const [currentUser, setCurrentUser] = useState<Maybe<Members>>(null);

  const { data: dataMember } = useQuery(FIND_CURRENTUSER, {
    variables: {
      fields: {
        _id: id as string,
      },
    },
    skip: !id,
    context: { serviceName: "soilservice" },
    ssr: false,
  });

  useSubscription(FIND_CURRENTUSER_SUB, {
    variables: {
      fields: {
        _id: id as string,
      },
    },
    skip: !id,
    context: { serviceName: "soilservice" },
  });

  // if (dataMember?.findMember) console.log("dataMember", dataMember?.findMember);

  useEffect(() => {
    if (dataMember?.findMember) {
      setCurrentUser(dataMember?.findMember);
      setMemberServers(dataMember?.findMember?.servers);
    }
    if (dataMember && process.env.NODE_ENV === "development") {
      console.log(`==== current USER ====`);
      console.log(dataMember.findMember);
      console.log(`==== ----------- ====`);
    }
  }, [dataMember]);

  useEffect(() => {
    if (selectedServer && process.env.NODE_ENV === "development") {
      console.log(`==== current SERVER ====`);
      console.log(selectedServer);
      console.log(`==== ----------- ====`);
    }
  }, [selectedServer]);

  const injectContext = {
    currentUser: currentUser,
    setCurrentUser: (user: Members) => {
      console.log("setCurrentUser", user);
      // injectContext.currentUser = user;
    },
    clearCurrentUser: () => {
      console.log("clearCurrentUser");
      setCurrentUser(null);
    },
    memberServers,
    selectedServer,
    setSelectedServer,
  };

  return (
    <UserContext.Provider value={injectContext}>
      {children}
    </UserContext.Provider>
  );
};
