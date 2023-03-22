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

  const { communityId } = req.query;

  if (!communityId) {
    res.status(401).json({ message: "Invalid community ID!!" });
    return;
  }

  //   const { user } = session;
  if (req.method === "GET") {
    const comm = await prisma.community.findUnique({
      where: { id: communityId },
      select: {
        id: true,
        image: true,
        desc: true,
        type: true,
        name: true,
        institutionId: true,
        members: {
          select: {
            id: true,
            user: {
              select: {
                id: true,
                name: true,
                username: true,
                image: true,
              },
            },
            type: true,
          },
        },
      },
    });

    if (!comm) {
      res.status(404).json({
        message: "Community does not exist",
        redirect: "/community/discover",
      });
      return;
    }

    res.json(comm);
  }
}
