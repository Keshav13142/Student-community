import prisma from "@/lib/prisma";
import { checkIfUserIsCommAdmin } from "@/src/utils/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  // Return error if user is not logged in
  if (!session) {
    res.status(401).json({ message: "You must be logged in." });
    return;
  }

  const { user } = session;

  try {
    // Check if the user is an admin of the community
    if (!checkIfUserIsCommAdmin(user.id)) {
      res
        .status(500)
        .json({ error: "Only community admins can perform this action!!" });
      return;
    }

    if (req.method === "PATCH") {
      const { userId, action, role, communityId } = req.body;

      const community = await prisma.community.update({
        where: {
          id: communityId,
        },
        data: {
          ...(role === "admin"
            ? {
                admins: {
                  ...(action === "promote"
                    ? {
                        connect: {
                          id: userId,
                        },
                      }
                    : {
                        disconnect: {
                          id: userId,
                        },
                      }),
                },
                moderators: {
                  disconnect: {
                    id: userId,
                  },
                },
              }
            : {
                moderators: {
                  ...(action === "promote"
                    ? {
                        connect: {
                          id: userId,
                        },
                      }
                    : {
                        disconnect: {
                          id: userId,
                        },
                      }),
                },
                admins: {
                  disconnect: {
                    id: userId,
                  },
                },
              }),
        },
        include: {
          members: {
            select: {
              id: true,
              name: true,
              username: true,
              image: true,
              communityAdmin: {
                select: {
                  id: true,
                },
                where: {
                  id: communityId,
                },
              },
              communityModerator: {
                select: {
                  id: true,
                },
                where: {
                  id: communityId,
                },
              },
            },
          },
        },
      });

      res.json(community);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
}
