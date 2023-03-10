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
  const { communityId } = req.query;

  try {
    if (req.method === "POST") {
      if (
        await prisma.community.findFirst({
          where: {
            AND: [
              {
                id: communityId,
              },
              {
                members: {
                  some: {
                    user: {
                      id: user.id,
                    },
                  },
                },
              },
            ],
          },
        })
      ) {
        res.status(406).json({
          error: `You are already a member!!`,
        });
        return;
      }

      try {
        const approval = await prisma.pendingApprovals.create({
          data: {
            community: {
              connect: {
                id: communityId,
              },
            },
            user: {
              connect: {
                id: user.id,
              },
            },
          },
        });
        res.json(approval);
      } catch (error) {
        res.status(400).json({
          error: `Request is being processed by Community admins!`,
        });
        return;
      }
    }

    if (!(await checkIfUserIsCommAdmin(user.id, communityId))) {
      res
        .status(401)
        .json({ error: "Only community admins can perform this action!!" });
      return;
    }

    // Get a list of all the pending Approvals for that community
    if (req.method === "GET") {
      res.json(
        await prisma.pendingApprovals.findMany({
          where: {
            community: {
              id: req.query.communityId,
            },
          },
          select: {
            id: true,
            status: true,
            user: {
              select: {
                id: true,
                name: true,
                image: true,
                username: true,
              },
            },
          },
        })
      );
    }

    // handle PUT request
    if (req.method === "PATCH") {
      const { approvalId, approvalStatus } = req.body;

      const approval = await prisma.pendingApprovals.update({
        where: {
          id: approvalId,
        },
        data: {
          status: approvalStatus ? "APPROVED" : "REJECTED",
        },
        select: {
          id: true,
          status: true,
          user: approvalStatus,
        },
      });

      // If the request is approved then add the user as a community member
      if (approvalStatus) {
        await prisma.community.update({
          where: {
            id: communityId,
          },
          data: {
            members: {
              create: {
                user: {
                  connect: {
                    id: approval.user.id,
                  },
                },
                type: "MEMBER",
              },
            },
          },
        });
      }

      res.json(approval);
    }
  } catch (error) {
    console.log(error);
    res.status(422).json({ error: error.message });
  }
}
