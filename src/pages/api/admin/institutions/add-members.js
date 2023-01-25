import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  //Return error if admin secret is missing
  if (req.body.secret !== process.env.ADMIN_SECRET) {
    res.status(500).json({ error: "Unauthorized" });
    res.end();
  }

  if (req.method === "POST") {
    const { members, institutionId, communityId } = req.body;

    try {
      await prisma.community.update({
        where: {
          id: communityId,
        },
        data: {
          admins: {
            connect: members.map((m) => ({
              id: m,
            })),
          },
          members: {
            connect: members.map((m) => ({
              id: m,
            })),
          },
        },
      });

      const institution = await prisma.institution.update({
        where: {
          id: institutionId,
        },
        data: {
          admins: {
            connect: members.map((m) => ({
              id: m,
            })),
          },
          members: {
            connect: members.map((m) => ({
              id: m,
            })),
          },
        },
        include: {
          _count: true,
          admins: true,
          members: true,
          communities: {
            select: {
              admins: true,
              members: true,
            },
          },
        },
      });

      res.json(institution);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Something went wrong!!" });
    }
  }
}
