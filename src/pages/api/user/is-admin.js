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
    let isAdmin = false;

    if (
      await prisma.institution.findFirst({
        where: {
          admins: {
            some: {
              id: user.id,
            },
          },
        },
      })
    ) {
      isAdmin = true;
    }

    res.json({ isAdmin });
  }
}
