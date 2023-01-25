import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  const { institutionId, userId } = req.body;

  if (!institutionId || !userId) {
    res.status(500).json({ error: "Missing details!!" });
    return;
  }

  try {
    if (req.method === "POST") {
      const { memberIds } = req.body;

      const institution = await prisma.institution.update({
        where: {
          id: institutionId,
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

      res.json(institution);
    }

    if (req.method === "DELETE") {
      const { memberIds } = req.body;

      const institution = await prisma.institution.update({
        where: {
          id: institutionId,
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

      res.json(institution);
    }
  } catch (error) {
    console.log(error);

    res.status(500).json({ error: "Something went wrong!!" });
  }
}
