import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  if (req.method === "PUT") {
    const { id } = req.query;

    const { name, image, bio, githubLink, linkedinLink } = req.body;

    try {
      const updatedUser = await prisma.user.update({
        where: {
          id,
        },
        data: {
          name,
          image,
          profile: {
            update: {
              bio,
              githubLink,
              linkedinLink,
            },
          },
        },
        include: {
          profile: true,
        },
      });

      res.json(updatedUser);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Something went wrong!!" });
    }
  }
}
