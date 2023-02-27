import prisma from "@/lib/prisma";
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

  const { communityId } = req.body;

  // Return error if user is not logged in
  if (!communityId) {
    res.status(401).json({ error: "Missing Fields!!" });
    return;
  }

  try {
    if (req.method === "POST") {
      if (
        await prisma.community.findFirst({
          where: {
            AND: [
              {
                members: {
                  some: {
                    id: user.id,
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
        res.status(500).json({
          error: `Request is being processed by Community admins!`,
        });
        return;
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
}
