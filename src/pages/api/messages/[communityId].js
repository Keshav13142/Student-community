import prisma from "@/lib/prisma";
import pusher from "@/lib/pusher";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

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
    res.status(401).json({ error: "Community ID not provided!!" });
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
          communityId: true,
          content: true,
          createdAt: true,
          isDeleted: true,
          deletedBy: true,
          sender: {
            select: {
              id: true,
              username: true,
              name: true,
            },
          },
        },
      });

      await pusher.trigger(`community-${communityId}`, "chat", message);
      res.status(201).json(message);
    } catch (error) {
      console.log(error);
      res.status(422).json({ error: error.message });
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
        select: {
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
        },
        orderBy: {
          createdAt: "asc",
        },
      });

      res.json(messages);
    } catch (error) {
      console.log(error);
      res.status(422).json({ error: error.message });
    }
  }
}
