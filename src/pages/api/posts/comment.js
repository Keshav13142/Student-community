import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  if (req.method !== "POST") return;

  const session = await getServerSession(req, res, authOptions);

  // Return error if user is not logged in
  if (!session) {
    res.status(401).json({ message: "You must be logged in." });
    return;
  }

  const { user } = session;
  const { comment, slug } = req.body;

  try {
    const newComment = await prisma.postComments.create({
      data: {
        comment,
        post: { connect: { slug } },
        user: { connect: { id: user.id } },
      },
      select: {
        id: true,
        comment: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    res.json(newComment);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
}
