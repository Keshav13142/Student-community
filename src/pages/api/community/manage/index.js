import prisma from "@/lib/prisma";

// Update community details
export default async function handler(req, res) {
  const { userId } = req.body;

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

    if (
      await prisma.institution.findFirst({
        where: {
          admins: {
            some: {
              id: userId,
            },
          },
        },
      })
    ) {
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
          private: isPrivate,
        },
      });

      res.json(community);
    } catch (error) {
      console.log(error);

      res.status(500).json({ error: "Something went wrong!!" });
    }
  }
}
