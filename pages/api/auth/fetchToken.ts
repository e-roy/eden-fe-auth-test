/* eslint-disable import/no-anonymous-default-export */
import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";

import { NEXT_PUBLIC_API_URL } from "../../../constants";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const token = await getToken({
    req,
    secret: process.env.NEXT_PUBLIC_SECRET,
  });

  let edenToken = null;
  let error = null;

  if (!token || !token?.accessToken) {
    return res.status(200).send({
      edenToken,
      error: error,
    });
    // return res.status(404).end();
  }

  await fetch(`${NEXT_PUBLIC_API_URL}/auth/token`, {
    method: "POST",
    body: JSON.stringify({ access_token: token.accessToken }),
    headers: { "Content-Type": "application/json" },
  })
    .then((res) => res.json())
    .then((data) => {
      //   console.log("FETCH TOKEN API DATA", data);
      if (data.eden_token) {
        edenToken = data.eden_token;
      }
      if (data.error) {
        error = data.error;
      }
    })
    .catch((err) => {
      error = err;
    });

  return res.status(200).send({
    edenToken,
    error: error,
  });
};
