import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email, bio, githubLink, linkedinLink, institutionCode } = req.body;

    try {
      const updatedUser = await prisma.user.update({
        where: { email },
        data: {
          profile: {
            create: {
              bio,
              githubLink,
              linkedinLink,
            },
          },
          institution: {
            connect: {
              code: institutionCode,
            },
          },
        },
      });

      res.status(201).json(updatedUser);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Something went wrong!!" });
    }
  }
}
