import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

// Handle request to join private communitites
export default async function handler(req, res) {
  if (req.method !== "POST") return;

  const session = await getServerSession(req, res, authOptions);

  // Return error if user is not logged in
  if (!session) {
    res.status(401).json({ message: "You must be logged in." });
    return;
  }

  const { user } = session;

  const { inviteCode } = req.body;

  // Return error if user is not logged in
  if (!inviteCode) {
    res.status(500).json({ error: "Missing fields!!" });
    return;
  }

  try {
    // Check if user is in the same institution as the community, and also if the code is valid
    const institution = await prisma.institution.findFirst({
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
            communities: {
              some: {
                code: inviteCode,
              },
            },
          },
        ],
      },
      select: {
        name: true,
      },
    });

    // Throw error if the code is invalid or the user does not belong to the institution
    if (!institution) {
      res.status(500).json({
        error: `Invalid code!!`,
      });
      return;
    }

    // Check if user is already a member of the community
    const community = await prisma.community.findFirst({
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
            code: inviteCode,
          },
        ],
      },
    });

    // Return if above case is true
    if (community) {
      res.json({ ...community, isExistingUser: true });
      return;
    }

    // Add the user as a member of the community
    const joinedCommunity = await prisma.community.update({
      where: {
        code: inviteCode,
      },
      data: {
        members: {
          connect: {
            id: user.id,
          },
        },
      },
      select: {
        name: true,
        id: true,
        image: true,
      },
    });

    res.json(joinedCommunity);
  } catch (error) {
    res.status(422).json({ error: error.message });
  }
}
