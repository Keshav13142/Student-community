import prisma from "@/lib/prisma";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";

export default async function handler(req, res) {
  const { user } = await unstable_getServerSession(req, res, authOptions);

  if (!user) {
    res.status(401).json({ message: "You must be logged in." });
    return;
  }

  if (req.method === "POST") {
    const { bio, githubLink, linkedinLink, codeType, institutionCode } =
      req.body;

    try {
      if (codeType === "adminCode") {
        await prisma.institution.update({
          where: {
            [codeType]: institutionCode,
          },
          data: {
            admins: {
              connect: {
                id: user.id,
              },
            },
            members: {
              connect: {
                id: user.id,
              },
            },
          },
        });
      } else {
        await prisma.institution.update({
          where: {
            [codeType]: institutionCode,
          },
          data: {
            members: {
              connect: {
                id: user.id,
              },
            },
          },
        });
      }

      const updatedUser = await prisma.user.update({
        where: { id: user.id },
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
              [codeType]: institutionCode,
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
