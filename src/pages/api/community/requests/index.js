import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  const { userId, communityId } = req.body;

  // TODO => Get the logged in user details from the session instead of req body

  // Return error if user is not logged in
  if (!communityId || !userId) {
    res.status(500).json({ error: "Missing Fields!!" });
    return;
  }

  try {
    // handle POST request
    if (req.method === "POST") {
      // Here the userId is the Id of the user requsting to join the community
      await handlePOST(userId, communityId, res);
    }
  } catch (error) {
    console.log(error);

    res.status(500).json({ error: error.message });
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
            id: userId,
          },
        },
      },
    });
    res.json(approval);
  } catch (error) {
    res.status(500).json({
      error: `Request is being processed by Community admins!`,
    });
    return;
  }
};
