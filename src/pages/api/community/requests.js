import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  const { userId, communityId, approvalId, approvalStatus } = req.body;

  // handle PUT request
  if (req.method === "PUT") {
    await handlePUT(approvalStatus, approvalId, res);
    return;
  }

  if (!communityId) {
    res.status(500).json({ error: "Invalid Id!!" });
    return;
  }

  if (!userId) {
    res.status(500).json({ error: "Unauthorized!!" });
    return;
  }

  try {
    // handle GET request
    if (req.method === "GET") {
      // Here userId is the Id of the community admin trying to acess this
      res.json(
        await prisma.pendingApprovals.findMany({
          where: {
            community: {
              AND: [
                { id: communityId },
                {
                  admins: {
                    some: {
                      id: userId,
                    },
                  },
                },
              ],
            },
          },
        })
      );
    }

    // handle POST request
    if (req.method === "POST") {
      // Here the userId is the Id of the user requsting to join the community
      await handlePOST(userId, communityId, res);
    }
  } catch (error) {
    console.log(error);

    res.status(500).json({ error: "Something went wrong!!" });
  }
}

// Add user to pending approvals
const handlePOST = async (userId, communityId, res) => {
  if (
    await prisma.community.findFirst({
      where: {
        AND: [
          {
            members: {
              some: {
                id: userId,
              },
            },
          },
          {
            id: communityId,
          },
        ],
      },
    })
  ) {
    res.status(500).json({
      error: `You are already a member!!`,
    });
    return;
  }

  // TODO => check if user belongs to the institution (idk if this case is really needed)

  const approval = await prisma.pendingApprovals.create({
    data: {
      community: {
        connect: {
          id: communityId,
        },
      },
      users: {
        connect: {
          id: userId,
        },
      },
    },
  });

  res.json(approval);
};

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
