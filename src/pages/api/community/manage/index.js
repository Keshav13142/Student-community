import prisma from "@/lib/prisma";
import {
  checkIfUserIsInstAdmin,
  getCommunityWithName,
} from "@/src/utils/server";

// Update community details
export default async function handler(req, res) {
  const { userId } = req.body;

  // TODO => Get the logged in user details from the session instead of req body

  // Return error if user is not logged in
  if (!userId) {
    res.status(500).json({ error: "Who are you? !!" });
    return;
  }

  // Return all the communitites the user is admin of
  if (req.method === "GET") {
    res.json(
      await prisma.community.findMany({
        where: {
          admins: {
            some: {
              id: userId,
            },
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
      })
    );
  }

  if (req.method === "PUT") {
    const { name, desc, image, communityId, isPrivate } = req.body;

    // Check if user is an admin of the institutions
    if (!(await checkIfUserIsInstAdmin(userId))) {
      res
        .status(500)
        .json({ error: "Only community admin can perform this action!!" });
      return;
    }

    // Check if a community with the name already exists
    if (await getCommunityWithName(name)) {
      res
        .status(500)
        .json({ error: "Community with this name already exists!!" });
      return;
    }

    try {
      // Update the community details
      const community = await prisma.community.update({
        where: {
          id: communityId,
        },
        data: {
          name,
          desc,
          image,
          private: isPrivate,
        },
      });

      res.json(community);
    } catch (error) {
      console.log(error);

      res.status(500).json({ error: error.message });
    }
  }
}
