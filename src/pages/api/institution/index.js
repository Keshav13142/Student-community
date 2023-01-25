import prisma from "@/lib/prisma";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  const session = await unstable_getServerSession(req, res, authOptions);
  if (session) {
    // Signed in
    console.log("Session", JSON.stringify(session, null, 2));
  } else {
    // Not Signed in
    res.status(401);
  }
  res.end();
}
