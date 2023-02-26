import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  // Return error if user is not logged in
  if (!session) {
    res.status(401).json({ message: "You must be logged in." });
    return;
  }

  const { id } = req.query;

  if (!id) {
    res.status(401).json({ message: "Invalid community ID!!" });
    return;
  }

  //   const { user } = session;
  if (req.method === "GET") {
    const comm = await prisma.community.findUnique({
      where: { id },
      include: {
        messages: true,
        admins: true,
        moderators: true,
        members: true,
      },
    });
    res.json(comm);
  }
}
