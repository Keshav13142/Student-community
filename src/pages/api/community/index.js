import prisma from "@/lib/prisma";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  const { user } = await unstable_getServerSession(req, res, authOptions);

  if (!user) {
    res.status(401).json({ message: "You must be logged in." });
    return;
  }

  // Get all public communities in the institution
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
              private: {
                equals: false,
              },
            },
          ],
        },
      })
    );
    return;
  }

  try {
    const institution = await getInstitutionByUserId(user.id);

    if (!institution) {
      res.status(500).json({
        error: "Only admins of institutions can  create communities!!",
      });
      return;
    }
  } catch (error) {
    console.log(error);

    res.status(500).json({ error: "Something went wrong!!" });
  }

  // Handle POST request => Create a new Community
  if (req.method === "POST") {
    await handlePOST(req, res, user.id, institution);
  }
}

// Get community with unique name
const getCommunityWithName = async (name) => {
  return await prisma.community.findUnique({
    where: {
      name,
    },
  });
};

const getInstitutionByUserId = async (id) => {
  return await prisma.institution.findFirst({
    where: {
      admins: {
        some: {
          id,
        },
      },
    },
  });
};

// Create a new Community
const handlePOST = async (req, res, userId, institution) => {
  const { name, image, desc, isPrivate } = req.body;

  if (!name) {
    res.status(500).json({ error: "Community name is required!!" });
    return;
  }

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
        private: isPrivate,
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

    res.status(500).json({ error: "Something went wrong!!" });
  }
};
