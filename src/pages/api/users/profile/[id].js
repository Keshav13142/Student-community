import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  if (req.method === "PUT") {
    const { id } = req.query;

    const { bio, githubLink, linkedinLink } = req.body;

    try {
      const updatedUser = await prisma.profile.update({
        where: {
          userId: id,
        },
        data: {
          bio,
          githubLink,
          linkedinLink,
        },
        include: {
          user: true,
        },
      });

      res.json(updatedUser);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Something went wrong!!" });
    }
  }
}
