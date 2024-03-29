import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

const messageSelect = {
  id: true,
  communityId: true,
  content: true,
  createdAt: true,
  deletedBy: true,
  isDeleted: true,
  sender: {
    select: {
      id: true,
      username: true,
      name: true,
    },
  },
};

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  // Return error if user is not logged in
  if (!session) {
    res.status(401).json({ message: "You must be logged in." });
    return;
  }

  const { user } = session;
  const { communityId } = req.query;

  if (!communityId) {
    res.status(401).json({ error: "Community id not provided!!" });
    return;
  }

  if (req.method === "POST") {
    const { content } = req.body;
    if (!content) {
      res.status(401).json({ error: "Empty message content!!" });
      return;
    }

    try {
      const message = await prisma.message.create({
        data: {
          content,
          sender: {
            connect: {
              id: user.id,
            },
          },
          community: {
            connect: {
              id: communityId,
            },
          },
        },
        select: {
          id: true,
          content: true,
          createdAt: true,
          sender: {
            select: {
              username: true,
              id: true,
            },
          },
        },
      });

      res.status(201).json(message);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  }

  if (req.method === "GET") {
    try {
      const messages = await prisma.message.findMany({
        where: {
          community: {
            id: communityId,
          },
        },
        select: messageSelect,
        orderBy: {
          createdAt: "asc",
        },
      });

      res.json(messages);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  }
}
