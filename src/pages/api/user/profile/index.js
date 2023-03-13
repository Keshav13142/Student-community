import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";

// Route to create a new user's profile and get them enrolled in an institution.
export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  // Return error if user is not logged in
  if (!session) {
    res.status(401).json({ message: "You must be logged in." });
    return;
  }

  const { user } = session;

  if (req.method === "POST") {
    const {
      username,
      bio,
      githubLink,
      linkedinLink,
      codeType,
      name,
      institutionCode,
    } = req.body;

    // Check if the user has a admin or member code and perform appropriate action
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

      // Check if the code is valid
      if (
        !(await prisma.institution.findFirst({
          where: {
            [codeType]: institutionCode,
          },
        }))
      ) {
        res
          .status(500)
          .json({ error: "Invalid code!!", ref: "institutionCode" });
        return;
      }

      if (codeType === "adminCode") {
        await prisma.institution.update({
          where: {
            adminCode: institutionCode,
          },
          data: {
            admins: {
              connect: {
                id: user.id,
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
              connect: {
                id: user.id,
              },
            },
            ...(codeType === "adminCode"
              ? { admins: { connect: { id: user.id } } }
              : {}),
          },
        });
      }

      if (codeType === "memberCode") {
        await prisma.pendingApprovals.create({
          data: {
            institution: {
              connect: {
                memberCode: institutionCode,
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

      // Create the user's profile
      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: {
          hasProfile: true,
          enrollmentStatus: {
            set: codeType === "adminCode" ? "APPROVED" : "PENDING",
          },
          username,
          bio,
          name,
          githubLink,
          linkedinLink,
          type: {
            set: codeType === "adminCode" ? "ADMIN" : "MEMBER",
          },
        },
      });

      res.status(201).json(updatedUser);
    } catch (error) {
      console.log(error);
      res.status(422).json({ error: error.message });
    }
  }
}
