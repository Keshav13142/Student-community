import prisma from "@/lib/prisma";
import { checkIfUserIsInstAdmin, getCommunityWithName } from "@/lib/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  // Return error if user is not logged in
  if (!session) {
    res.status(401).json({ message: "You must be logged in." });
    return;
  }

  const { user } = session;

  // Get all public and restricted communities in the institution
  if (req.method === "GET") {
    res.json(
      await prisma.community.findMany({
        where: {
          AND: [
            {
              institution: {
                members: {
                  some: {
                    user: {
                      id: user.id,
                    },
                  },
                },
              },
            },
            {
              type: {
                not: "PRIVATE",
              },
            },
            {
              members: {
                none: {
                  user: {
                    id: user.id,
                  },
                },
              },
            },
          ],
        },
        select: {
          id: true,
          name: true,
          desc: true,
          image: true,
          type: true,
        },
      })
    );
    return;
  }

  try {
    if (req.method === "POST") {
      if (user.isGuest) {
        if (user.communityCount >= 3) {
          res.status(500).json({
            error: "Guest accounts can only create upto 3 communities!!",
          });
          return;
        } else {
          await prisma.user.update({
            where: { id: user.id },
            data: { communityCount: { increment: 1 } },
          });
        }
      }

      const { name, image, desc, type } = req.body;

      const institution = await prisma.institution.findFirst({
        where: {
          members: {
            some: { user: { id: user.id } },
          },
        },
        select: { id: true },
      });

      // Return error if user is not an admin of the institution
      if (!(await checkIfUserIsInstAdmin(user.id, institution.id))) {
        res.status(401).json({
          error: "Only admins of institutions can  create communities!!",
        });
        return;
      }

      if (!name) {
        res.status(400).json({ error: "Community name is required!!" });
        return;
      }

      // Check if a community with the name already exists
      if (await getCommunityWithName(name, institution.id)) {
        res
          .status(500)
          .json({ error: "Community with this name already exists!!" });
        return;
      }

      const community = await prisma.community.create({
        data: {
          name,
          desc,
          image,
          type,
          members: {
            create: {
              user: {
                connect: {
                  id: user.id,
                },
              },
              type: "ADMIN",
            },
          },
          institution: {
            connect: {
              id: institution.id,
            },
          },
        },
        select: {
          id: true,
        },
      });

      res.json({ redirect: `/community/${community.id}` });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
}
