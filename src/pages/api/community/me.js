import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

// Get the communities that the current user is a part of
export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  // Return error if user is not logged in
  if (!session) {
    res.status(401).json({ message: "You must be logged in." });
    return;
  }

  const { user } = session;

  if (req.method === "GET") {
    try {
      res.json(
        await prisma.community.findMany({
          where: {
            OR: [
              {
                members: {
                  some: {
                    id: user.id,
                  },
                },
              },
              {
                admins: {
                  some: {
                    id: user.id,
                  },
                },
              },
            ],
          },
          select: {
            name: true,
            id: true,
            image: true,
          },
        })
      );
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}
