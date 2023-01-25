import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  const { communityId, userId } = req.body;

  if (!communityId) {
    res.status(500).json({ error: "Invalid code!!" });
    return;
  }

  if (!userId) {
    res.status(500).json({ error: "Unauthorized!!" });
    return;
  }

  try {
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

    res.status(500).json({ error: "Something went wrong!!" });
  }
}
