import prisma from "@/lib/prisma";

// Handle request to join private communitites
export default async function handler(req, res) {
  const { communityCode, userId } = req.body;

  // TODO => Get the logged in user details from the session instead of req body

  // Return error if user is not logged in
  if (!communityCode || !userId) {
    res.status(500).json({ error: "Missing fields!!" });
    return;
  }

  try {
    // Check if user is in the same institution as the community, and also if the code is valid
    const institution = await prisma.institution.findFirst({
      where: {
        AND: [
          {
            members: {
              some: {
                id: userId,
              },
            },
          },
          {
            communities: {
              some: {
                code: communityCode,
              },
            },
          },
        ],
      },
      select: {
        name: true,
      },
    });

    // Throw error if the code is invalid or the user does not belong to the institution
    if (!institution) {
      res.status(500).json({
        error: `Invalid code, or the community does not exist within your institution!!`,
      });
      return;
    }

    // Check if user is already a member of the community
    const community = await prisma.community.findFirst({
      where: {
        members: {
          some: {
            id: userId,
          },
        },
      },
    });

    // Return if above case is true
    if (community) {
      res.json(community);
      return;
    }

    // Add the user as a member of the community
    const joinedCommunity = await prisma.community.update({
      where: {
        code: communityCode,
      },
      data: {
        members: {
          connect: {
            id: userId,
          },
        },
      },
      include: {
        messages: true,
      },
    });

    res.json(joinedCommunity);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
