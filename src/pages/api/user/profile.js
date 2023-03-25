import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

// Route to create a new user's profile and get them enrolled in an institution.
export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  // Return error if user is not logged in
  if (!session) {
    res.status(401).json({ message: "You must be logged in." });
    return;
  }

  const { user } = session;

  if (req.method !== "POST") {
    res.status(405).end();
    return;
  }

  const { username, bio, githubLink, linkedinLink, name, institutionCode } =
    req.body;

  try {
    if (
      await prisma.user.findUnique({
        where: {
          username,
        },
      })
    ) {
      res
        .status(500)
        .json({ error: "Username is already taken!!", ref: "username" });
      return;
    }

    const institution = await prisma.institution.findFirst({
      where: {
        institutionCodes: {
          some: {
            code: institutionCode,
          },
        },
      },
      select: {
        id: true,
        institutionCodes: {
          select: {
            code: true,
            type: true,
          },
        },
      },
    });

    // Check if the code is valid
    if (!institution) {
      res.status(500).json({ error: "Invalid code!!", ref: "institutionCode" });
      return;
    }

    const userType = institution.institutionCodes.find(
      (item) => item.code === institutionCode
    ).type;

    if (userType === "ADMIN") {
      await prisma.institution.update({
        where: {
          id: institution.id,
        },
        data: {
          members: {
            create: {
              user: {
                connect: {
                  id: user.id,
                },
              },
              type: userType,
            },
          },
        },
      });

      const community = await prisma.community.findFirst({
        where: {
          default: true,
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
            create: {
              user: {
                connect: {
                  id: user.id,
                },
              },
              type: userType,
            },
          },
        },
      });
    }

    if (userType === "MEMBER") {
      await prisma.pendingApprovals.create({
        data: {
          institution: {
            connect: {
              id: institution.id,
            },
          },
          user: {
            connect: {
              id: user.id,
            },
          },
        },
      });
    }

    // Update the user's profile
    await prisma.user.update({
      where: { id: user.id },
      data: {
        hasProfile: true,
        enrollmentStatus: {
          set: userType === "ADMIN" ? "APPROVED" : "PENDING",
        },
        isInstitutionAdmin: userType === "ADMIN" ? true : false,
        username,
        bio,
        name,
        githubLink,
        linkedinLink,
      },
    });

    res.status(201).end();
  } catch (error) {
    console.log(error);
    res.status(422).json({ error: error.message });
  }
}
