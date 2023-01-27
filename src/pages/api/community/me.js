import prisma from "@/lib/prisma";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  const { user } = await unstable_getServerSession(req, res, authOptions);

  if (!user) {
    res.status(401).json({ message: "You must be logged in." });
    return;
  }

  if (req.method === "GET") {
    try {
      res.json(
        await prisma.community.findMany({
          where: {
            members: {
              some: {
                id: user.id,
              },
            },
          },
          select: {
            name: true,
            id: true,
          },
        })
      );
    } catch (error) {
      res.status(500).json({ error: "Something went wrong!!" });
    }
  }
}
