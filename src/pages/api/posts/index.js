import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  // Return error if user is not logged in
  if (!session) {
    res.status(401).json({ message: "You must be logged in." });
    return;
  }

  const { user } = session;

  try {
    const posts = await prisma.post.findMany({
      where: {
        institution: {
          OR: [
            { members: { some: { id: user.id } } },
            { admins: { some: { id: user.id } } },
          ],
        },
      },
    });

    res.json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
}
