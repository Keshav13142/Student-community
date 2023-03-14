import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";

// Route to handle assigning and removing institution admins
export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  // Return error if user is not logged in
  if (!session) {
    res.status(401).json({ message: "You must be logged in." });
    return;
  }

  const { institutionId, userId, action } = req.body;

  if (!institutionId || !userId || !action) {
    res.status(400).json({ error: "Missing details!!" });
    return;
  }

  // Adding user's as institution admins
  try {
    if (req.method === "PATCH") {
      const institution = await prisma.institution.update({
        where: {
          id: institutionId,
        },
        data: {
          members: {
            update: {
              where: {
                id: userId,
              },
              data: {
                user: {
                  update: {
                    isInstitutionAdmin: action === "promote" ? true : false,
                  },
                },
                type: action === "promote" ? "ADMIN" : "MEMBER",
              },
            },
          },
        },
        include: {
          members: {
            select: {
              id: true,
              user: {
                select: {
                  id: true,
                  name: true,
                  username: true,
                  image: true,
                },
              },
              type: true,
            },
          },
        },
      });

      res.json(institution);
    }
  } catch (error) {
    console.log(error);
    res.status(422).json({ error: error.message });
  }
}
