import prisma from "@/lib/prisma";
import { checkIfUserIsCommAdmin } from "@/src/utils/server";

// Allow admins to view , approve/reject community requests
export default async function handler(req, res) {
  const { userId, communityId, approvalId, approvalStatus } = req.body;

  // TODO => Get the logged in user details from the session instead of req body

  if (!checkIfUserIsCommAdmin(userId)) {
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
          community: {
            id: communityId,
          },
        },
      })
    );
  }

  // handle PUT request
  if (req.method === "PUT") {
    await handlePUT(approvalStatus, approvalId, res);
  }
}

// Approve/reject requests
const handlePUT = async (approvalStatus, approvalId, res) => {
  const approval = await prisma.pendingApprovals.update({
    where: {
      id: approvalId,
    },
    data: {
      approved: approvalStatus,
    },
  });

  // If the request is approved then add the user as a community member
  if (approvalStatus) {
    await prisma.community.update({
      where: {
        id: approval.communityId,
      },
      data: {
        members: {
          connect: {
            id: approval.userId,
          },
        },
      },
    });
  }

  res.json(approval);
};
