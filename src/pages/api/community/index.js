import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  const { userId } = req.body;

  if (!userId) {
    res.status(500).json({ error: "Unauthorized!!" });
  }

  if (req.method === "GET") {
    res.json(
      await prisma.community.findMany({
        where: {
          members: {
            some: {
              id: userId,
            },
          },
        },
      })
    );
    return;
  }

  try {
    const institution = await getInstitutionByUserId(userId);

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
    await handlePOST(req, res, institution);
  }

  // Handle PUT request => Update community details
  if (req.method === "PUT") {
    await handlePUT(req, res);
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
const handlePOST = async (req, res, institution) => {
  const { name, image, userId, desc } = req.body;

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

const handlePUT = async (req, res) => {
  const { name, desc, image, communityId } = req.body;

  if (await getCommunityWithName(name)) {
    res
      .status(500)
      .json({ error: "Community with this name already exists!!" });
    return;
  }

  try {
    const community = await prisma.community.update({
      where: {
        id: communityId,
      },
      data: {
        name,
        desc,
        image,
      },
    });

    res.json(community);
  } catch (error) {
    console.log(error);

    res.status(500).json({ error: "Something went wrong!!" });
  }
};
