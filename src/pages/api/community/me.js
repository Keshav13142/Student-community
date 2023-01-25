import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { userId } = req.body;

    if (!userId) {
      res.status(500).json({ error: "Unauthorized!!" });
      return;
    }

    try {
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
    } catch (error) {
      res.status(500).json({ error: "Something went wrong!!" });
    }
  }
}
