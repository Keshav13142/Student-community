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

  if (req.method === "GET") {
    let institution = await prisma.institution.findFirst({
      where: {
        members: {
          some: {
            user: {
              id: user.id,
            },
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
            id: true,
            type: true,
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
      },
    });

    res.json(institution);
  }
}
