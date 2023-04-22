import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

// Check if user is institution admin.
export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  // Return error if user is not logged in
  if (!session) {
    res.status(401).json({ message: "You must be logged in." });
    return;
  }

  const { user } = session;

  if (req.method === "GET") {
    res.json(
      await prisma.user.findUnique({
        where: { id: user.id },
        select: {
          name: true,
          username: true,
          image: true,
          githubLink: true,
          linkedinLink: true,
          bio: true,
        },
      })
    );
  }

  if (req.method === "PATCH") {
    const { name, username, bio, image, linkedinLink, githubLink } = req.body;

    if (
      await prisma.user.findFirst({
        where: {
          AND: [{ id: { not: user.id } }, { username }],
        },
      })
    ) {
      res
        .status(500)
        .json({ error: "Username is already taken!!", ref: "username" });
      return;
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { name, username, bio, image, linkedinLink, githubLink },
    });

    res.status(200).end();
  }
}
