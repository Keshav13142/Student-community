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
  const { institutionId } = req.query;

  try {
    if (!user.type === "ADMIN") {
      res
        .status(500)
        .json({ error: "Only community admins can perform this action!!" });
      return;
    }

    // Get a list of all the pending Approvals for that community
    if (req.method === "GET") {
      res.json(
        await prisma.pendingApprovals.findMany({
          where: {
            institution: {
              id: req.query.institutionId,
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
          institutionId: true,
          user: {
            select: {
              id: true,
              name: true,
              image: true,
              username: true,
            },
          },
        },
      });

      await prisma.user.update({
        where: {
          id: approval.user.id,
        },
        data: {
          enrollmentStatus: approvalStatus ? "APPROVED" : "REJECTED",
        },
      });

      // If the request is approved then add the user as a instiution member
      if (approvalStatus) {
        await prisma.institution.update({
          where: {
            id: institutionId,
          },
          data: {
            members: {
              connect: {
                id: approval.user.id,
              },
            },
          },
        });

        const community = await prisma.community.findFirst({
          where: {
            default: true,
            institutionId: approval.institutionId,
          },
          select: {
            id: true,
          },
        });

        // Add the user to the default community
        await prisma.community.update({
          where: {
            id: community.id,
          },
          data: {
            members: {
              connect: {
                id: approval.user.id,
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
