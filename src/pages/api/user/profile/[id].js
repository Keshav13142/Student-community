import prisma from "@/lib/prisma";

// Handle requests to update the user's profile
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
          bio,
          githubLink,
          linkedinLink,
        },
      });

      res.json(updatedUser);
    } catch (error) {
      console.log(error);
      res.status(422).json({ error: error.message });
    }
  }
}
