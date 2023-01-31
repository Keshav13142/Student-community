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
    const institution = await prisma.institution.findFirst({
      where: {
        members: {
          some: {
            id: user.id,
          },
        },
      },
      select: {
        id: true,
        name: true,
        website: true,
        supportEmail: true,
        image: true,
        members: {
          select: {
            name: true,
            email: true,
            image: true,
          },
        },
        admins: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    res.json(institution);
  }
}
