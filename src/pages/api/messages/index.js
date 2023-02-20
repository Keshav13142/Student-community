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

  const { user } = session;

  if (req.method === "POST") {
    const { content, communityId } = req.body;

    try {
      await prisma.message.create({
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
      });
      res.status(201).json({ message: "Message sent successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  }
}
