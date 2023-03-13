import prisma from "@/lib/prisma";
import {
  checkIfUserIsCommAdmin,
  getCommunityWithName,
} from "@/src/utils/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";

// Update community details
export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  // Return error if user is not logged in
  if (!session) {
    res.status(401).json({ message: "You must be logged in." });
    return;
  }

  const { user } = session;

  // Return all the communitites the user is admin of
  if (req.method === "GET") {
    res.json(
      await prisma.community.findMany({
        where: {
          admins: {
            some: {
              id: user.id,
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

  if (req.method === "PATCH") {
    const { name, desc, image, communityId, type } = req.body;

    if (!name || !communityId || !type) {
      res.status(500).json({ error: "Missing required fields!!" });
      return;
    }

    // Check if user is an admin of the institutions
    if (!(await checkIfUserIsCommAdmin(user.id))) {
      res
        .status(500)
        .json({ error: "Only community admin can perform this action!!" });
      return;
    }

    // Check if a community with the name already exists
    if (await getCommunityWithName(name, user.id, communityId)) {
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
          type,
        },
        select: {
          id: true,
          name: true,
          desc: true,
          image: true,
          type: true,
          slug: true,
        },
      });

      res.json(community);
    } catch (error) {
      console.log(error);
      res.status(422).json({ error: error.message });
    }
  }
}
