import prisma from "@/lib/prisma";
import {
  checkIfUserIsInstAdmin,
  getCommunityWithName,
} from "@/src/utils/server";
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

  // Get all public and restricted communities in the institution
  if (req.method === "GET") {
    res.json(
      await prisma.community.findMany({
        where: {
          AND: [
            {
              institution: {
                members: {
                  some: {
                    id: user.id,
                  },
                },
              },
            },
            {
              type: {
                not: "PRIVATE",
              },
            },
            {
              members: {
                none: {
                  id: user.id,
                },
              },
              admins: {
                none: {
                  id: user.id,
                },
              },
            },
          ],
        },
      })
    );
    return;
  }

  // Return error if user is not an admin of the institution
  try {
    const institution = await checkIfUserIsInstAdmin(user.id);

    if (!institution) {
      res.status(500).json({
        error: "Only admins of institutions can  create communities!!",
      });
      return;
    }

    // Handle POST request => Create a new Community
    if (req.method === "POST") {
      await handlePOST(req, res, user.id, institution);
    }
  } catch (error) {
    console.log(error);

    res.status(500).json({ error: error.message });
  }
}

// Create a new Community
const handlePOST = async (req, res, userId, institution) => {
  const { name, image, desc, type } = req.body;

  if (!name) {
    res.status(500).json({ error: "Community name is required!!" });
    return;
  }

  // Check if a community with the name already exists
  try {
    if (await getCommunityWithName(name)) {
      res
        .status(500)
        .json({ error: "Community with this name already exists!!" });
      return;
    }

    const community = await prisma.community.create({
      data: {
        name,
        desc,
        image,
        type,
        admins: {
          connect: {
            id: userId,
          },
        },
        members: {
          connect: {
            id: userId,
          },
        },
        institution: {
          connect: {
            id: institution.id,
          },
        },
      },
      include: {
        admins: {
          select: {
            name: true,
          },
        },
        members: {
          select: {
            name: true,
          },
        },
      },
    });

    res.json(community);
  } catch (error) {
    console.log(error);

    res.status(500).json({ error: error.message });
  }
};
