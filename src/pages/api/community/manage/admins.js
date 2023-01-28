import prisma from "@/lib/prisma";
import { checkIfUserIsCommAdmin } from "@/src/utils/server";

export default async function handler(req, res) {
  const { communityId, userId } = req.body;

  // TODO => Get the logged in user details from the session instead of req body

  if (!communityId || !userId) {
    res.status(500).json({ error: "Missing fields!!" });
    return;
  }

  try {
    // Check if the user is an admin of the community
    if (!checkIfUserIsCommAdmin(userId)) {
      res
        .status(500)
        .json({ error: "Only community admins can perform this action!!" });
      return;
    }

    if (req.method === "POST") {
      const { memberIds } = req.body;

      const community = await prisma.community.update({
        where: {
          id: communityId,
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

      res.json(community);
    }

    if (req.method === "DELETE") {
      const { memberIds } = req.body;

      const community = await prisma.community.update({
        where: {
          id: communityId,
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

      res.json(community);
    }
  } catch (error) {
    console.log(error);

    res.status(500).json({ error: error.message });
  }
}
