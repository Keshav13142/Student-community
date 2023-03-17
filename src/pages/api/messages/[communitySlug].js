import prisma from "@/lib/prisma";
import pusher from "@/lib/pusher";
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
  const { communitySlug } = req.query;

  if (!communitySlug) {
    res.status(401).json({ error: "Community slug not provided!!" });
    return;
  }

  if (req.method === "POST") {
    const { content } = req.body;

    if (!content) {
      res.status(401).json({ error: "Empty message content!!" });
      return;
    }

    await pusher.trigger(`community-${communitySlug}`, "chat", {
      content,
      sender: { id: user.id, username: user.username },
      createdAt: new Date(),
    });

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
              slug: communitySlug,
            },
          },
        },
        select: messageSelect,
      });

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
            slug: communitySlug,
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
      res.status(422).json({ error: error.message });
    }
  }
}
