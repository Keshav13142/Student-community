import prisma from "@/lib/prisma";
import { checkIfUserIsInstAdmin } from "@/src/utils/server";

// Route to handle assigning and removing institution admins
export default async function handler(req, res) {
  const { institutionId, userId } = req.body;

  // TODO => Get the logged in user details from the session instead of req body

  // Return error if user is not logged in
  if (!institutionId || !userId) {
    res.status(500).json({ error: "Missing details!!" });
    return;
  }

  // If the current user is not an admin then return error
  if (!(await checkIfUserIsInstAdmin(userId))) {
    res
      .status(500)
      .json({ error: "You don't have permission to perform this action!!" });
    return;
  }

  try {
    if (req.method === "POST") {
      // Get the list of members that need to be promoted to admin status
      const { memberIds } = req.body;

      const institution = await prisma.institution.update({
        where: {
          id: institutionId,
        },
        data: {
          admins: {
            connect: memberIds.map((m) => ({
              id: m,
            })),
          },
        },
        include: {
          admins: {
            select: {
              id: true,
              email: true,
            },
          },
          members: {
            select: {
              id: true,
              email: true,
            },
          },
        },
      });

      res.json(institution);
    }

    // Handle removing member from admin status
    if (req.method === "DELETE") {
      const { memberIds } = req.body;

      const institution = await prisma.institution.update({
        where: {
          id: institutionId,
        },
        data: {
          admins: {
            disconnect: memberIds.map((m) => ({
              id: m,
            })),
          },
        },
        include: {
          admins: {
            select: {
              id: true,
              email: true,
            },
          },
          members: {
            select: {
              id: true,
              email: true,
            },
          },
        },
      });

      res.json(institution);
    }
  } catch (error) {
    console.log(error);

    res.status(500).json({ error: error.message });
  }
}
