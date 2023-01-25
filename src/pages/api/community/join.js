import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  const { communityCode, userId } = req.body;

  if (!communityCode) {
    res.status(500).json({ error: "Invalid code!!" });
    res.end();
  }

  if (!userId) {
    res.status(500).json({ error: "Unauthorized!!" });
    res.end();
  }

  try {
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

    if (!institution) {
      res.status(500).json({
        error: `You must be a member of the institution to join the community!!`,
      });
      res.end();
    }

    const community = await prisma.community.findFirst({
      where: {
        members: {
          some: {
            id: userId,
          },
        },
      },
    });

    if (community) {
      res.json(community);
      res.end();
    }

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
    res.status(500).json({ error: "Something went wrong!!" });
  }
}
